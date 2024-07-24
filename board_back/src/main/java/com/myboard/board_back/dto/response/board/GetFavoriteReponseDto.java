package com.myboard.board_back.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.myboard.board_back.common.ResponseCode;
import com.myboard.board_back.common.ResponseMessage;
import com.myboard.board_back.dto.object.FavoriteListItem;
import com.myboard.board_back.dto.response.ResponseDto;
import com.myboard.board_back.repository.resultSet.GetFavoriteListResultSet;

import lombok.Getter;

@Getter
public class GetFavoriteReponseDto extends ResponseDto{
    
    private List<FavoriteListItem> favoriteList;
    
    private GetFavoriteReponseDto(List<GetFavoriteListResultSet> resultSets){
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.favoriteList = FavoriteListItem.copyList(resultSets);

    }
    public static ResponseEntity<GetFavoriteReponseDto> success(List<GetFavoriteListResultSet> resultSets){
        GetFavoriteReponseDto result = new GetFavoriteReponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistBoard(){
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_BOARD, ResponseMessage.NOT_EXISTED_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
