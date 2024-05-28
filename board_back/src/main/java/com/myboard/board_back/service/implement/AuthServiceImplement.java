package com.myboard.board_back.service.implement;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.myboard.board_back.dto.request.auth.SignInRequestDto;
import com.myboard.board_back.dto.request.auth.SignUpRequestDto;
import com.myboard.board_back.dto.response.ResponseDto;
import com.myboard.board_back.dto.response.auth.SignInResponseDto;
import com.myboard.board_back.dto.response.auth.SignUpResponseDto;
import com.myboard.board_back.entity.UserEntity;
import com.myboard.board_back.repository.UserRepository;
import com.myboard.board_back.service.AuthService;
import com.myboard.board_back.provider.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImplement implements AuthService{

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {
        // TODO Auto-generated method stub\
        try {
            String email = dto.getEmail();
            String nickname = dto.getNickname();
            String telNumber = dto.getTelNumber();

            boolean existedEmail = userRepository.existsByEmail(email);
            boolean existedNickname = userRepository.existsByNickname(nickname);    
            boolean existedTelNumber = userRepository.existsByTelNumber(telNumber);

            if (existedEmail) 
                return SignUpResponseDto.duplicateEmail();
            if (existedNickname) 
                return SignUpResponseDto.duplicateNickname();
            if (existedTelNumber) 
                return SignUpResponseDto.duplicateTelNumber();
            
            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            // CustomPhysicalNamingStrategy customPhysicalNamingStrategy = new CustomPhysicalNamingStrategy();
            
            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignUpResponseDto.success();
    }

    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {
        // TODO Auto-generated method stub
        String token = null;

        try {
            String email = dto.getEmail();
            UserEntity userEntity = userRepository.findByEmail(email);
            if (userEntity == null){
                // log.trace("userEntity is null.");
                return SignInResponseDto.signInFail();
            }

            String password = dto.getPassword();
            String encodedPassword = userEntity.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if (!isMatched) {
                return SignInResponseDto.signInFail();
            }
            token = jwtProvider.create(email);
            
            return SignInResponseDto.success(token);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
    
}
