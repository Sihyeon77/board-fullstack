package com.myboard.board_back.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.myboard.board_back.common.ResponseCode;
import com.myboard.board_back.common.ResposeMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResponseDTO {
    // 모든 리스폰스는 코드와 메세지, 디비 에러를 가지고 있음 
    private String code;
    private String message;

    public static ResponseEntity<ResponseDTO> databaseError(){
        ResponseDTO responseBody = new ResponseDTO(ResponseCode.DATABASE_ERROR, ResposeMessage.DATABASE_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
