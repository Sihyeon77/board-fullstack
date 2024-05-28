package com.myboard.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myboard.board_back.dto.request.board.PostBoardRequestDto;
import com.myboard.board_back.dto.response.board.PostBoardResponseDto;

public interface BoardService {
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email);
}
