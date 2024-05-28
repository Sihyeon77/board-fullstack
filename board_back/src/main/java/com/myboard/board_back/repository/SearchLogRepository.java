package com.myboard.board_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myboard.board_back.entity.SearchLogEntity;

@Repository
public interface SearchLogRepository extends JpaRepository<SearchLogEntity,Integer>{
    
}
