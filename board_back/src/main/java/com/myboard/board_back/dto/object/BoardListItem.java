package com.myboard.board_back.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
@AllArgsConstructor
public class BoardListItem {
    private int BoardNumber;
    private String title;
    private String content;
    private String boardTitleImage;
    private int falvoriteCount;
    private int commentConut;
    private int viewCount;
    private String writtenDateTime;
    private String writerNickname;
    private String writerProfileImage;
}
