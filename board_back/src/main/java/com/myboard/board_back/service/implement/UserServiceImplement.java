package com.myboard.board_back.service.implement;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.myboard.board_back.dto.response.ResponseDto;
import com.myboard.board_back.dto.response.user.GetSignInUserResponseDto;
import com.myboard.board_back.entity.UserEntity;
import com.myboard.board_back.repository.UserRepository;
import com.myboard.board_back.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImplement implements UserService{
    private final UserRepository userRepository;
    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email) {
        try {
            Optional<UserEntity> userOptional = userRepository.findByEmail(email);
            if(!userOptional.isPresent()){
                return GetSignInUserResponseDto.notExistUser();
            }
            UserEntity userEntity = userOptional.get();
            
            return GetSignInUserResponseDto.success(userEntity);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
}
