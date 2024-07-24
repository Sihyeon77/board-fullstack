package com.myboard.board_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.myboard.board_back.entity.CommentEntity;
import com.myboard.board_back.repository.resultSet.GetCommentListResultSet;

import jakarta.transaction.Transactional;

/**
 * CommentRepository
 */
@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Integer>{
    @Query(value = 
        "SELECT "+
        "U.nickname AS nickname, "+
        "U.profile_image AS profileImage, "+
        "C.written_date_time AS writtenDateTime, "+
        "C.content AS content "+
        "FROM comment AS C "+
        "INNER JOIN pageuser AS U "+
        "ON C.user_email = U.email "+
        "WHERE C.id = ?1 "+
        "ORDER BY writtenDateTime DESC;",
        nativeQuery = true
    )
    List<GetCommentListResultSet> getCommentList(Integer id);

    @Transactional
    void deleteAllById(Integer id);
}