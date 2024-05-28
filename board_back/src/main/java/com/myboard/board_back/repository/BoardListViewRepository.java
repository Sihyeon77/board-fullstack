package com.myboard.board_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myboard.board_back.entity.BoardListViewEntity;

/**
 * BoardListViewRepository
 */
@Repository
public interface BoardListViewRepository extends JpaRepository<BoardListViewEntity, Integer>{

    
}