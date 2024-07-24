package com.myboard.board_back.repository.resultSet;

public interface GetBoardResultSet {
    Integer getId();
    String getTitle();
    String getContent();
    String getWrittenDateTime();
    String getWriterEmail();
    String getWriterNickname();
    String getWriterProfileImage();
}
