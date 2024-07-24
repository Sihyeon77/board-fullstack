package com.myboard.board_back.dto.object;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

import com.myboard.board_back.repository.resultSet.GetFavoriteListResultSet;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteListItem {
    private String email;
    private String nickname;
    private String profileImage;

    public FavoriteListItem(GetFavoriteListResultSet resultSet){
        this.email = resultSet.getEmail();
        this.nickname = resultSet.getNickname();
        this.profileImage = resultSet.getProfileImage();
    }
    public static List<FavoriteListItem> copyList(List<GetFavoriteListResultSet> resultSets){
        List<FavoriteListItem> list = new ArrayList<>();
        for (GetFavoriteListResultSet resultSet : resultSets) {
            FavoriteListItem favoriteListItem = new FavoriteListItem(resultSet);
            list.add(favoriteListItem);
        }
        return list;
    }

}
