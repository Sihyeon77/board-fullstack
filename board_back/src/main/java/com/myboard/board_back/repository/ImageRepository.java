package com.myboard.board_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.myboard.board_back.entity.ImageEntity;

import jakarta.transaction.Transactional;

import java.util.List;


@Repository
public interface ImageRepository extends JpaRepository<ImageEntity, Integer>{

    List<ImageEntity> findByBoardId(Integer id);
    @Transactional

    void deleteAllByBoardId(Integer id);
}
