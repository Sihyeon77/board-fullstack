package com.myboard.board_back.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.myboard.board_back.dto.request.board.PostCommentRequestDto;

import java.util.Date;
import java.time.Instant;
import java.text.SimpleDateFormat;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "comment")
@Table(name = "comment")
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentNumber;
    private String content;
    private String writtenDateTime;
    private String userEmail;
    private int id;

    public CommentEntity(PostCommentRequestDto dto, Integer id, String email) {
        
        Date now = Date.from(Instant.now());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String writtenDateTime = simpleDateFormat.format(now);

        this.content = dto.getContent();
        this.writtenDateTime = writtenDateTime;
        this.userEmail = email;
        this.id = id;
    }
}
