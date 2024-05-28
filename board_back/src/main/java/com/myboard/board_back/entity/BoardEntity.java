package com.myboard.board_back.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Date;

import com.myboard.board_back.dto.request.board.PostBoardRequestDto;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board")
@Table(name = "board")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String writerEmail;
    private String title;
    private String content;
    private String writtenDateTime;
    private int commentCount;
    private int favoriteCount;
    private int viewCount;

    public BoardEntity(PostBoardRequestDto dto, String email){
        Date now = Date.from(Instant.now());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String writtenDateTime = simpleDateFormat.format(now);
        
        this.writerEmail  = email;
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.writtenDateTime = writtenDateTime;
        this.commentCount = 0;
        this.favoriteCount = 0;
        this.viewCount = 0;
    }
}
