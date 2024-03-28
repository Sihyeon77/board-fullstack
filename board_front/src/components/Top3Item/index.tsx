import React from 'react'
import './style.css';
import defaultProfileImage from 'assets/image/default_profile_image.jpg';
import { BoardListItem } from 'types/interface';
import { useNavigate } from 'react-router-dom';

interface Props{
  top3ListItem : BoardListItem
}
//      top3 lite item component
export default function Top3Item({top3ListItem}:Props) {

//        properties
  const {boardNumber, title, content, boardTitleImage}=top3ListItem;
  const {favoriteCount, commentCount, viewCount}=top3ListItem;
  const {writtenDateTime, writerNickname, writerProfileImage} = top3ListItem;

//        navigate func
  // const navigator = useNavigate();

//        event handler
  const onClickHander=()=>{
    // navigator(boardNumber);
  }

//      render: Top 3 List Item component rendering
  return (
    <div className="top-3-list-item" style={{backgroundImage:`url(${boardTitleImage})`}} onClick={onClickHander}>
      <div className="top-3-list-item-box">
        <div className="top-3-list-item-top">
          <div className='top-3-list-item-profile-box'>
            <div className='top-3-list-item-profile-image' style={{backgroundImage: `url(${writerProfileImage})`}}></div>
          </div>
          <div className='top-3-list-item-write-box'>
            <div className='top-3-list-item-nickname'>{writerNickname}</div>
            <div className='top-3-list-item-written-date'>{writtenDateTime}</div>
          </div>
        </div>
        <div className="top-3-list-item-middle">
          <div className='top-3-list-item-title'>{title}</div>
          <div className='top-3-list-item-content'>{content}</div>
        </div>
        <div className="top-3-list-item-bottom">
          <div className='top-3-list-item-counts'>{`덧글 ${commentCount}  좋아요 ${favoriteCount}  조회수 ${viewCount}`}</div>
        </div>
      </div>
    </div>
  );
}

