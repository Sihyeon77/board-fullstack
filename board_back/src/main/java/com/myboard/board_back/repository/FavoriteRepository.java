package com.myboard.board_back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.myboard.board_back.entity.FavoriteEntity;
import com.myboard.board_back.entity.primaryKey.FavoritePk;
import com.myboard.board_back.repository.resultSet.GetFavoriteListResultSet;

import jakarta.transaction.Transactional;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk>{
    Optional<FavoriteEntity> findByIdAndUserEmail (Integer id, String userEmail);

    @Query(value = 
        "SELECT "+
        "U.email AS email, "+
        "U.nickname AS nickname, "+
        "U.profile_image AS profileImage "+
        "FROM favorite AS F "+
        "INNER JOIN pageuser AS U "+
        "ON F.user_email = U.email "+
        "WHERE F.id = ?1;",
        nativeQuery = true
    )
    List<GetFavoriteListResultSet> GetFavoriteList(Integer id);

    @Transactional
    void deleteAllById(Integer id);
}
