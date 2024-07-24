import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./style.css";
import FavoriteItem from "components/FavoriteItem";
import { Board, CommentListItem, FavoriteListItem } from "types/interface";
import CommentItem from "components/CommentItem";
import Pagination from "components/Pagination";
import { useLoginUserStore } from "stores";
import { useNavigate, useParams } from "react-router-dom";
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from "constant";
import defaultProfileImage from "assets/image/default_profile_image.jpg";
import {
  deleteBoardRequest,
  getBoardRequest,
  getCommentListRequest,
  getFavoriteListRequest,
  increaseViewCountRequest,
  postCommentRequest,
  putFavoriteRequest,
} from "apis";
import {
  DeleteBoardResponseDto,
  GetBoardResponseDto,
  GetCommentListResponseDto,
  IncreaseViewCountResponseDto,
  PostCommentResponseDto,
} from "apis/response/board";
import { ResponseDto } from "apis/response";
import dayjs from "dayjs";
import GetFavoriteListResponseDto from "../../../apis/response/board/get-favorite-list.response.dto";
import { useCookies } from "react-cookie";
import PutFavoriteResponseDto from "../../../apis/response/board/put-favorite.response.dto";
import { PostCommentRequestDto } from "apis/request/board";
import usePagination from "hooks/pagination.hook";

//  component: 게시물 상세화면 컴포넌트
export default function DetailBoard() {
  // function: 네비게이트 함수
  const navigator = useNavigate();
  // function: increaseViewCountResponse 처리함수
  const increaseViewCountResponse = (
    responseBody: IncreaseViewCountResponseDto | ResponseDto | null
  ) => {
    if (!responseBody) return;

    if ("code" in responseBody) {
      const { code } = responseBody as ResponseDto;
      if (code === "NB") alert("게시물이 존재하지 않습니다.");
      if (code === "DBE") alert("데이터베이스 오류입니다.");
    }
  };

  // state: 게시물 번호 path variable 상태
  const { boardNumber } = useParams();
  // state: 로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  // state: 쿠키상태
  const [cookies, setCookies] = useCookies();

  

  //  component: 게시물 상단 상세화면 컴포넌트
  const BoardDetailTop = () => {
    // state: 작성자 여부 상태
    const [isWriter, setWriter] = useState<boolean>(false);
    // state: board 상태
    const [board, setBoard] = useState<Board | null>(null);
    // state: more 버튼 상태
    const [showMore, setShowMore] = useState<boolean>(false);
    // state: 게시물 존재 여부 flag
    const [boardExists, setBoardExists] = useState<boolean>(false);
    

    

    // function: 작성일 포멧 변경함수
    const getWrittenDateTimeFormat = () => {
      if (!board) return "";
      const date = dayjs(board.writtenDateTime);
      return date.format("YYYY. MM. DD");
    };

    // function: get board response 처리 함수
    const getBoardResponse = (
      responseBody: GetBoardResponseDto | ResponseDto | null
    ) => {
      if (!responseBody) return;

      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "NB"){
          alert("게시물이 존재하지 않습니다.");
          setBoardExists(false);
          return;
        } 
        if (code === "DBE"){
          alert("데이터베이스 오류입니다.");
          setBoardExists(false);
          return;
        } 
      }
      const board: Board = { ...(responseBody as GetBoardResponseDto) };
      setBoard(board);
      setBoardExists(true);

      if (!loginUser) {
        setWriter(false);
        return;
      }
      const isWriter = loginUser.email === board.writerEmail;
      setWriter(isWriter);
    };

    // function: delete board response 처리 함수
    const deleteBoardResposne = (responseBody : DeleteBoardResponseDto | ResponseDto | null) =>{
      if (!responseBody) return;
 
      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "VF"){
          alert("잘못된 접근입니다.");
          return;
        } 
        if (code === "NU"){
          alert("존재하지 않는 유저입니다.");
          return;
        } 
        if (code === "NB"){
          alert("게시물이 존재하지 않습니다.");
          return;
        } 
        if (code === "AF"){
          alert("인증에 실패했습니다.");
          return;
        } 
        if (code === "NP"){
          alert("권한이 없습니다.");
          return;
        } 
        if (code === "DBE"){
          alert("데이터베이스 오류입니다.");
          return;
        } 
        if (code !== "SU") return;
      }

      navigator(MAIN_PATH());
    }


    // event handler: more 버튼 클릭 이벤트 처리
    const onMoreButtonClickHandler = () => {
      setShowMore(!showMore);
    };
    // event handler: nickname 버튼 클릭 이벤트 처리
    const onNicknameClickHandler = () => {
      if (!board) return;
      navigator(USER_PATH(board.writerEmail));
    };
    // event handler: 수정 버튼 클릭 이벤트 처리
    const onUpdateButtonClickHandler = () => {
      if (!board || !loginUser) {
        // alert('페이지가 존재하지 않습니다.');
        return;
      }
      if (loginUser.email !== board.writerEmail) {
        // alert('사용자 정보가 올바르지 않습니다.');
        return;
      }

      navigator(BOARD_PATH() + "/" + BOARD_UPDATE_PATH(board.id));
    };
    // event handler: 삭제 버튼 클릭 이벤트 처리
    const onDeleteButtonClickHandler = () => {
      if (!board ||!loginUser  || !boardNumber || !cookies.accessToken) {
        return;
      }
      if (loginUser.email !== board.writerEmail) {
        // alert('사용자 정보가 올바르지 않습니다.');
        return;
      }

      deleteBoardRequest(boardNumber, cookies.accessToken).then(deleteBoardResposne);
    };

    // effect: 게시물 번호 path variable이 바뀔 때마다 게시물 불러오기
    useEffect(() => {
      if (!boardNumber) return;
      
      getBoardRequest(boardNumber).then(getBoardResponse);
      increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
    }, [boardNumber]); // boardNumber

    //  render: 게시물 상단 상세화면 render
    if (!board){
      // alert('게시물이 존재하지 않습니다.');
      // navigator(MAIN_PATH());
      return <></>;
    } 
    return (
      <div id="board-detail-top">
        <div className="board-detail-top-header">
          <div className="board-detail-title">{board.title}</div>
          <div className="board-detail-top-sub-box">
            <div className="board-detail-write-info-box">
              <div
                className="board-detail-writer-proflie-image"
                style={{
                  backgroundImage: `url(${
                    board.writerProflieImage
                      ? board.writerProflieImage
                      : defaultProfileImage
                  })`,
                }}
              ></div>
              <div
                className="board-detail-writer-nickname"
                onClick={onNicknameClickHandler}
              >
                {board.writerNickname}
              </div>
              <div className="board-detail-info-divider">{"|"}</div>
              <div className="board-detail-write-date">
                {getWrittenDateTimeFormat()}
              </div>
            </div>
            {isWriter && (
              <div className="icon-button" onClick={onMoreButtonClickHandler}>
                <div className="icon more-icon"></div>
              </div>
            )}
            {showMore && (
              <div className="board-detail-more-box">
                <div
                  className="board-detail-update-button"
                  onClick={onUpdateButtonClickHandler}
                >
                  {"수정"}
                </div>
                <div className="divider"></div>
                <div
                  className="board-detail-delete-button"
                  onClick={onDeleteButtonClickHandler}
                >
                  {"삭제"}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="divider"></div>
        <div className="board-detail-top-main">
          <div className="board-detail-main-text">{board.content}</div>
          {board.boardImageList ? (
            board.boardImageList.map((image, index) => (
              <img key={index} className="board-detail-image" src={image} />
            ))
          ) : (
            <></>
          )}
          {/* {board.boardImageList.map(image => <img className="board-detail-image" src={image}/>)} */}
          {/* <img className="board-detail-image"></img> */}
        </div>
      </div>
    );
  };
  //  component: 게시물 하단 상세화면 컴포넌트
  const BoardDetailBottom = () => {
    // state: 댓글 textarea 참조 상태
    const commentRef = useRef<HTMLTextAreaElement | null>(null);
    // state: 좋아요 리스트 상태
    const [isFavorite, setFavorite] = useState<boolean>(false);
    // state: 좋아요 상자 보기 상태
    const [showFavorite, setShowFavorite] = useState<boolean>(false);
    // state: 댓글 상자 보기 상태
    const [showComment, setShowComment] = useState<boolean>(false);
    // state: 좋아요 리스트 상태
    const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
    // state: 댓글 상태
    const [comment, setComment] = useState<string>("");
    // state: 전체 댓글 개수 상태
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0);
    // state: 페이지네이션 관련 상태
    const {currentPage, setCurrentPage,
      currentSection, setCurrentSection,
      viewList,
      totalList,  setTotalList,
      totalSection,
      totalPageList,
      viewPageList,
    } =usePagination<CommentListItem>(3);

    // function: get favorite list Response 처리 함수
    const getFavoriteListResponse = (
      responseBody: ResponseDto | GetFavoriteListResponseDto | null
    ) => {
      if (!responseBody) return;
      
      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "NB") alert("게시물이 존재하지 않습니다.");
        if (code === "DBE") alert("데이터베이스 오류입니다.");
        if (code !== "SU") {
          navigator(MAIN_PATH());
          return;
        }
      }
      const { favoriteList } = responseBody as GetFavoriteListResponseDto;
      setFavoriteList(favoriteList);
      if (!loginUser) {
        setFavorite(false);
        return;
      }
      
      const isFavorite =
        favoriteList.findIndex(
          (favorite) => favorite.email === loginUser.email
        ) !== -1;
      setFavorite(isFavorite);
    };
    
    // function: put Favorite Response 처리 함수
    const putFavoriteResponse = (
      responseBody: ResponseDto | PutFavoriteResponseDto | null
    ) => {
      
      if (!responseBody) return;
 
      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "VF"){
          alert("잘못된 접근입니다.");
          return;
        } 
        if (code === "NU"){
          alert("존재하지 않는 유저입니다.");
          return;
        } 
        if (code === "NB"){
          alert("게시물이 존재하지 않습니다.");
          return;
        } 
        if (code === "AF"){
          alert("인증에 실패했습니다.");
          return;
        } 
        if (code === "DBE"){
          alert("데이터베이스 오류입니다.");
          return;
        } 
        if (code !== "SU") return;
      }
      if (!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
    };

    // function: get comment list Response 처리 함수
    const getCommentListResponse = (
      responseBody: ResponseDto | GetCommentListResponseDto | null
    ) => {
      if (!responseBody){
        // console.log("responseBody가 null입니다.");
        return;
      } 

      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "NB"){
          alert("게시물이 존재하지 않습니다.");
          return;
        } 
        if (code === "DBE"){
          alert("데이터베이스 오류입니다.");
          return;
        } 
        if (code !== "SU") return;
      }

      console.log("get comment list response's resposneBody : " , responseBody);
      
      const { commentList } = responseBody as GetCommentListResponseDto;
      console.log("comment list : ", commentList);
      if(!commentList) return;
      setTotalList(commentList);
      setTotalCommentCount(commentList ? commentList.length : 0);
    };


    const postCommentResponse = (responseBody: ResponseDto | PostCommentResponseDto | null) =>{
      if (!responseBody) return;
 
      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "VF"){
          alert("잘못된 접근입니다.");
          return;
        } 
        if (code === "NU"){
          alert("존재하지 않는 유저입니다.");
          return;
        } 
        if (code === "NB"){
          alert("게시물이 존재하지 않습니다.");
          return;
        } 
        if (code === "AF"){
          alert("인증에 실패했습니다.");
          return;
        } 
        if (code === "DBE"){
          alert("데이터베이스 오류입니다.");
          return;
        } 
        if (code !== "SU") return;
      }

      setComment('');
      if(!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }


    // event handler: 좋아요 클릭 이벤트 처리
    const onFavoriteButtonClickHandler = () => {
      if (!loginUser || !cookies.accessToken || !boardNumber) return;
      putFavoriteRequest(boardNumber, cookies.accessToken).then(
        putFavoriteResponse
      );
    };
    // event handler: 좋아요 클릭 이벤트 처리
    const onShowFavoriteButtonClickHandler = () => {
      setShowFavorite(!showFavorite);
    };

    // event handler: 댓글 상자 더보기 버튼 클릭 이벤트 처리
    const onShowCommentButtonClickHandler = () => {
      setShowComment(!showComment);
    };
    // event handler: 댓글 작성 버튼 클릭 이벤트 처리
    const onCommentSubmitButtonClickHandler = () => {
      if (!comment || !boardNumber || !loginUser || !cookies.accessToken) return;

      const requestBody : PostCommentRequestDto = {content: comment};
      postCommentRequest(boardNumber, requestBody, cookies.accessToken).then(postCommentResponse);
    };

    // event handler: 댓글 변경 이벤트 처리
    const onCommentChangeHandler = (
      event: ChangeEvent<HTMLTextAreaElement>
    ) => {
      const { value } = event.target;
      setComment(value);
      if (!commentRef.current) return;
      commentRef.current.style.height = "auto";
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    };

    // effect: 게시물 번호 path variable이 바뀔 때마다 좋아요 및 댓글 리스트 불러오기
    useEffect(() => {
      if (!boardNumber) return;

      getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }, [boardNumber]); //boardNumber

    //  render: 게시물 하단 상세화면 render
    return (
      <div id="board-detail-bottom">
        <div className="board-detail-bottom-button-box">
          <div className="board-detail-bottom-button-group">
            <div className="icon-button" onClick={onFavoriteButtonClickHandler}>
              {isFavorite ? (
                <div className="icon favorite-fill-icon"></div>
              ) : (
                <div className="icon favorite-light-icon"></div>
              )}
            </div>
            <div className="board-detail-botton-button-text">{`좋아요 ${
              favoriteList ? favoriteList.length : 0
            }`}</div>
            <div
              className="icon-button"
              onClick={onShowFavoriteButtonClickHandler}
            >
              {showFavorite ? (
                <div className="icon up-light-icon"></div>
              ) : (
                <div className="icon down-light-icon"></div>
              )}
            </div>
          </div>
          <div className="board-detail-bottom-button-group">
            <div
              className="icon-button"
              onClick={onShowCommentButtonClickHandler}
            >
              <div className="icon comment-icon"></div>
            </div>
            <div className="board-detail-botton-button-text">{`댓글 ${
              totalCommentCount
            }`}</div>
            <div
              className="icon-button"
              onClick={onShowCommentButtonClickHandler}
            >
              {showComment ? (
                <div className="icon up-light-icon"></div>
              ) : (
                <div className="icon down-light-icon"></div>
              )}
              {/* <div className="icon up-light-icon"></div> */}
            </div>
          </div>
        </div>
        {showFavorite && (
          <div className="board-detail-bottom-favorite-box">
            <div className="board-detail-bottom-favorite-container">
              <div className="board-detail-bottom-favorite-title">
                {"좋아요 "}
                <span className="emphasis">
                  {favoriteList ? favoriteList.length : 0}
                </span>
              </div>
              <div className="board-detail-bottom-favorite-content">
                {favoriteList ? (
                  favoriteList.map((item, index) => (
                    <FavoriteItem key={index} favoriteListItem={item} />
                  ))
                ) : (
                  <></>
                )}
                {/* <FavoriteItem favoriteListItem={} key={}/> */}
              </div>
            </div>
          </div>
        )}
        {showComment && (
          <div className="board-detail-bottom-comment-box">
            <div className="board-detail-bottom-comment-container">
              <div className="board-detail-bottom-comment-title">
                {"댓글 "}
                <span className="emphasis">
                  {totalCommentCount}
                </span>
              </div>
              <div className="board-detail-bottom-comment-content-list-container">
                {viewList ? (
                  viewList.map((item, index) => (
                    <CommentItem key={index} commentListItem={item} />
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="divider"></div>
            <div className="board-detail-bottom-comment-pagination-box">
              <Pagination 
                currentPage={currentPage}
                currentSection={currentSection}
                setCurrentPage={setCurrentPage}
                setCurrentSection={setCurrentSection}
                viewPageList={viewPageList}
                totalSection={totalSection}
              />
            </div>
            {loginUser !== null && (
              <div className="board-detail-bottom-comment-input-box">
                <div className="board-detail-bottom-comment-input-container">
                  <textarea
                    ref={commentRef}
                    className="board-detail-bottom-comment-textarea"
                    placeholder="댓글을 작성해주세요."
                    name=""
                    id=""
                    value={comment}
                    onChange={onCommentChangeHandler}
                  />
                  <div className="board-detail-bottom-comment-button-box">
                    <div
                      className={
                        comment === "" ? "disable-button" : "black-button"
                      }
                      onClick={onCommentSubmitButtonClickHandler}
                    >
                      {"댓글달기"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // effect: 게시물 번호 path variable이 바뀔 때마다 게시물 조회수 증가
  // let effctFlag = true;
  // useEffect(() => {
  //   if (!boardNumber) return;
  //   if (effctFlag) {
  //     effctFlag = false;
  //     return;
  //   }
  //   increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
  // }, [boardNumber]);

  
  //  render: 게시물 상세화면 render
  return (
    <div id="board-detail-wrapper">
      <div className="board-detail-container">
        <BoardDetailTop />
        <BoardDetailBottom />
      </div>
    </div>
  );
}
