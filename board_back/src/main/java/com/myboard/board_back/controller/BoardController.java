package com.myboard.board_back.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myboard.board_back.dto.response.board.DeleteBoardResponseDto;
import com.myboard.board_back.dto.response.board.GetBoardResponseDto;
import com.myboard.board_back.dto.response.board.GetCommentListResponseDto;
import com.myboard.board_back.dto.response.board.GetFavoriteReponseDto;
import com.myboard.board_back.dto.response.board.IncreaseViewCountResponseDto;
import com.myboard.board_back.dto.request.board.PostBoardRequestDto;
import com.myboard.board_back.dto.request.board.PostCommentRequestDto;
import com.myboard.board_back.dto.response.board.PostBoardResponseDto;
import com.myboard.board_back.dto.response.board.PostCommentResponseDto;
import com.myboard.board_back.dto.response.board.PutFavoriteResponseDto;
import com.myboard.board_back.service.BoardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    // 게시글, 게시판, 본문, 글쓰기, board
    @GetMapping("/{id}")
    public ResponseEntity<? super GetBoardResponseDto> getBoard(@PathVariable("id") Integer id) {
        ResponseEntity<? super GetBoardResponseDto> response = boardService.getBoard(id);
        return response;
    }

    @PostMapping("")
    public ResponseEntity<? super PostBoardResponseDto> postBoard(
            @RequestBody @Valid PostBoardRequestDto requestBody,
            @AuthenticationPrincipal String email) {
        ResponseEntity<? super PostBoardResponseDto> response = boardService.postBoard(requestBody, email);
        return response;
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard(@PathVariable("id") Integer id,
            @AuthenticationPrincipal String email) {
        ResponseEntity<? super DeleteBoardResponseDto> response = boardService.deleteBoard(id, email);
        return response;
    }


    // 좋아요, 페이보릿, favorite
    @GetMapping("/{id}/favorite-list")
    public ResponseEntity<? super GetFavoriteReponseDto> getFavoriteList(@PathVariable("id") Integer id) {
        ResponseEntity<? super GetFavoriteReponseDto> response = boardService.getFavoriteList(id);
        return response;
    }

    @PutMapping("/{id}/favorite")
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(@PathVariable("id") Integer id,
            @AuthenticationPrincipal String email) {

        ResponseEntity<? super PutFavoriteResponseDto> response = boardService.putFavorite(id, email);
        return response;
    }


    // 코멘트, 댓글, 덧글, comment
    @PostMapping("/{id}/comment")
    public ResponseEntity<? super PostCommentResponseDto> postComment(
            @RequestBody @Valid PostCommentRequestDto requestBody,
            @PathVariable("id") Integer id,
            @AuthenticationPrincipal String email) {
        ResponseEntity<? super PostCommentResponseDto> response = boardService.postComment(requestBody, id, email);
        return response;
    }

    @GetMapping("/{id}/comment-list")
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(@PathVariable("id") Integer id) {
        ResponseEntity<? super GetCommentListResponseDto> response = boardService.getCommentList(id);
        return response;
    }

    
    // 조회수, view
    @GetMapping("/{id}/increase-view-count")
    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount(@PathVariable("id") Integer id) {
        ResponseEntity<? super IncreaseViewCountResponseDto> response = boardService.increaseViewCount(id);
        return response;
    }
}
