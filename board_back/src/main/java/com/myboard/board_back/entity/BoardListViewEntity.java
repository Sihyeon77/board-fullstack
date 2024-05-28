package com.myboard.board_back.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "board_list_view")
@Table(name = "board_list_view")
public class BoardListViewEntity {
    @Id
    private int boardNumber;
    private String title;
    private String content;
    private String titleImage;
    private int viewCount;
    private int favoriteCount;
    private int  commentCount;
    private String writtenDateTime;
    @Column(name = "writer_email")
    private String writerEmail;
    @Column(name = "writer_nickname")
    private String writerNickname;
    @Column(name = "writer_profile_image")
    private String writerProfileImage;
}
