package com.myboard.board_back.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.myboard.board_back.repository.resultSet.GetCommentListResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CommentListItem {
    private String nickname;
    private String profileImage;
    private String writtenDateTime;
    private String content;

    public CommentListItem(GetCommentListResultSet resultSet){
        this.nickname = resultSet.getNickname();
        this.profileImage = resultSet.getProflieImage();
        this.content = resultSet.getContent();
        this.writtenDateTime = resultSet.getWrittenDateTime();
    }

    public static List<CommentListItem> copyList(List<GetCommentListResultSet> resultSets) {
        List<CommentListItem> list = new ArrayList<>();
        for (GetCommentListResultSet resultSet : resultSets) {
            CommentListItem commentListItem = new CommentListItem(resultSet);
            list.add(commentListItem);
        }
        return list;
    }
}
