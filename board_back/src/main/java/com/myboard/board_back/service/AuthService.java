package com.myboard.board_back.service;

import org.springframework.http.ResponseEntity;

import com.myboard.board_back.dto.response.auth.SignInResponseDto;
import com.myboard.board_back.dto.response.auth.SignUpResponseDto;
import com.myboard.board_back.dto.request.auth.SignInRequestDto;
import com.myboard.board_back.dto.request.auth.SignUpRequestDto;

public interface AuthService {
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
}
