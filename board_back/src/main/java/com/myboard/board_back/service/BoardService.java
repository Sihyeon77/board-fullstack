package com.myboard.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myboard.board_back.dto.request.board.PostBoardRequestDto;
import com.myboard.board_back.dto.request.board.PostCommentRequestDto;
import com.myboard.board_back.dto.response.board.DeleteBoardResponseDto;
import com.myboard.board_back.dto.response.board.GetBoardResponseDto;
import com.myboard.board_back.dto.response.board.GetCommentListResponseDto;
import com.myboard.board_back.dto.response.board.GetFavoriteReponseDto;
import com.myboard.board_back.dto.response.board.IncreaseViewCountResponseDto;
import com.myboard.board_back.dto.response.board.PostBoardResponseDto;
import com.myboard.board_back.dto.response.board.PostCommentResponseDto;
import com.myboard.board_back.dto.response.board.PutFavoriteResponseDto;;

public interface BoardService {
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);
    ResponseEntity<? super GetBoardResponseDto> getBoard(Integer id);
    ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(Integer id, String email);

    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer id, String emailString);
    ResponseEntity<? super GetFavoriteReponseDto> getFavoriteList(Integer id);

    ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer id, String email);
    ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer id);

    ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(Integer id);
}
