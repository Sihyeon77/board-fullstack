package com.myboard.board_back.service.implement;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.myboard.board_back.dto.request.board.PostBoardRequestDto;
import com.myboard.board_back.dto.request.board.PostCommentRequestDto;
import com.myboard.board_back.dto.response.ResponseDto;
import com.myboard.board_back.dto.response.board.DeleteBoardResponseDto;
import com.myboard.board_back.dto.response.board.GetBoardResponseDto;
import com.myboard.board_back.dto.response.board.GetCommentListResponseDto;
import com.myboard.board_back.dto.response.board.GetFavoriteReponseDto;
import com.myboard.board_back.dto.response.board.IncreaseViewCountResponseDto;
import com.myboard.board_back.dto.response.board.PostBoardResponseDto;
import com.myboard.board_back.dto.response.board.PostCommentResponseDto;
import com.myboard.board_back.dto.response.board.PutFavoriteResponseDto;
import com.myboard.board_back.entity.BoardEntity;
import com.myboard.board_back.entity.CommentEntity;
import com.myboard.board_back.entity.FavoriteEntity;
import com.myboard.board_back.entity.ImageEntity;
import com.myboard.board_back.entity.UserEntity;
import com.myboard.board_back.repository.BoardRepository;
import com.myboard.board_back.repository.CommentRepository;
import com.myboard.board_back.repository.FavoriteRepository;
import com.myboard.board_back.repository.ImageRepository;
import com.myboard.board_back.repository.UserRepository;
import com.myboard.board_back.repository.resultSet.GetBoardResultSet;
import com.myboard.board_back.repository.resultSet.GetCommentListResultSet;
import com.myboard.board_back.repository.resultSet.GetFavoriteListResultSet;
import com.myboard.board_back.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardServiceImplement implements BoardService {
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final FavoriteRepository favoriteRepository;
    private final CommentRepository commentRepository;

    public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {
        try {
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent())
                return PostBoardResponseDto.notExistUser();

            BoardEntity boardEntity = new BoardEntity(dto, email);
            boardRepository.save(boardEntity);

            int id = boardEntity.getId();
            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image : boardImageList) {
                ImageEntity imageEntity = new ImageEntity(id, image);
                imageEntities.add(imageEntity);
            }
            imageRepository.saveAll(imageEntities);
            return PostBoardResponseDto.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetBoardResponseDto> getBoard(Integer id) {
        List<ImageEntity> imageEntities = new ArrayList<>();
        try {
            Optional<GetBoardResultSet> resultSetOptional = boardRepository.getBoard(id);

            if (!resultSetOptional.isPresent())
                return GetBoardResponseDto.noExistBoard();

            GetBoardResultSet resultSet = resultSetOptional.get();
            imageEntities = imageRepository.findByBoardId(id);

            BoardEntity boardEntity = boardRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Board not found. "));
            boardRepository.save(boardEntity);

            return GetBoardResponseDto.success(resultSet, imageEntities);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer id, String email) {
        try {
            Optional<BoardEntity> boardOptional = boardRepository.findById(id);
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if(!boardOptional.isPresent()){
                return DeleteBoardResponseDto.notExistBoard();
            }
            if(!userOptional.isPresent()){
                return DeleteBoardResponseDto.notExistUser();
            }
            BoardEntity boardEntity = boardOptional.get();
            UserEntity userEntity = userOptional.get();
            
            if(!userEntity.getEmail().equals(boardEntity.getWriterEmail())){
                return DeleteBoardResponseDto.noPermission();
            }

            commentRepository.deleteAllById(id);;
            favoriteRepository.deleteAllById(id);
            imageRepository.deleteAllByBoardId(id);
            boardRepository.deleteById(id);
            boardRepository.delete(boardEntity);
            
            return DeleteBoardResponseDto.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer id, String email) {
        try {
            Optional<BoardEntity> boardOptional = boardRepository.findById(id);
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent())
                return PutFavoriteResponseDto.noExistUser();

            if (!boardOptional.isPresent())
                return PutFavoriteResponseDto.noExistBoard();

            BoardEntity boardEntity = boardOptional.get();
            
            Optional<FavoriteEntity> optionalFavoriteEntity = favoriteRepository.findByIdAndUserEmail(id, email);
            if (optionalFavoriteEntity.isEmpty()) {
                FavoriteEntity favoriteEntity = new FavoriteEntity(email, id);
                favoriteRepository.save(favoriteEntity);
                boardEntity.increaseFavoriteCount();
            } else {
                favoriteRepository.delete(optionalFavoriteEntity.get());
                boardEntity.decreaseFavoriteCount();
            }
            boardRepository.save(boardEntity);
            return PutFavoriteResponseDto.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetFavoriteReponseDto> getFavoriteList(Integer id) {
        try {
            Optional<BoardEntity> boardOptional = boardRepository.findById(id);
            if (!boardOptional.isPresent())
                return GetFavoriteReponseDto.noExistBoard();

            List<GetFavoriteListResultSet> resultSets = favoriteRepository.GetFavoriteList(id);

            return GetFavoriteReponseDto.success(resultSets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer id,
            String email) {
        try {
            Optional<BoardEntity> boardEntityOptional = boardRepository.findById(id);
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if (!boardEntityOptional.isPresent())
                return PostCommentResponseDto.noExistUser();
            if (!userOptional.isPresent())
                return PostCommentResponseDto.noExistUser();

            CommentEntity commentEntity = new CommentEntity(dto, id, email);
            commentRepository.save(commentEntity);

            BoardEntity boardEntity = boardEntityOptional.get();
            boardEntity.increaseCommentCount();
            boardRepository.save(boardEntity);

            return PostCommentResponseDto.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer id) {
        try {
            Optional<BoardEntity> boardOptional = boardRepository.findById(id);
            if (!boardOptional.isPresent()) return GetCommentListResponseDto.noExistBoard();
            
            List<GetCommentListResultSet> resultSets = commentRepository.getCommentList(id);

            return GetCommentListResponseDto.success(resultSets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }

    @Override
    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer id) {
        try {
            Optional<BoardEntity> boardOptional = boardRepository.findById(id);
            if(!boardOptional.isPresent())
                IncreaseViewCountResponseDto.noExistBoard();

            BoardEntity boardEntity = boardOptional.get();
            boardEntity.increaseViewCount();
            
            boardRepository.save(boardEntity);

            return IncreaseViewCountResponseDto.success();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }


}
