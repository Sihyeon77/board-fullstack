package com.myboard.board_back.entity.primaryKey;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Column;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePk implements Serializable{
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "id")
    private int id;
}
