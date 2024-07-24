package com.myboard.board_back.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.myboard.board_back.entity.BoardEntity;
import com.myboard.board_back.repository.resultSet.GetBoardResultSet;

import jakarta.transaction.Transactional;



@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer>{
    
    // boolean existById(Integer id);
    Optional<BoardEntity> findById(Integer id);
    Optional<BoardEntity> findByWriterEmail(String email);
    
    @Query(
        value = "SELECT "+
                    "B.id AS id, "+
                    "B.title AS title, "+
                    "B.content AS content, "+
                    "B.written_date_time AS writtenDateTime, "+
                    "B.writer_email AS writerEmail, "+
                    "U.nickname AS writerNickname, "+
                    "U.profile_image AS writerProfileImage "+
                "From board AS B "+
                "INNER JOIN pageuser AS U "+
                "ON B.writer_email = U.email "+
                "WHERE B.id = ?1",
        nativeQuery = true
    )
    Optional<GetBoardResultSet> getBoard(Integer id);

    @Transactional
    void deleteById(BoardEntity boardEntity);
}
