import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from "constant";
import { useCookies } from "react-cookie";
import { useBoardStore, useLoginUserStore } from "stores";
import { log } from "console";
import { BOARD_PATH } from '../../constant/index';
import { fileUploadRequest, postBoardRequest } from "apis";
import { PostBoardRequestDto } from "apis/request/board";
import PostBoardResponseDto from "apis/response/board/post-board.reponse.dto";
import { ResponseDto } from "apis/response";

//  component: 헤더 레이아웃
export default function Header() {
  // state: 유저 로그인 상태
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  // state: cookie 상태
  const [cookies, setCookies] = useCookies();
  // state: pathname 상태
  const { pathname } = useLocation();
  // state: 로그인 상태
  const [isLogin, setLogin] = useState<boolean>(false);
  // state: 인증 페이지 상태
  const isAuthPage = pathname.startsWith(AUTH_PATH());
  // state: 메인페이지 상태
  const isMainPage = pathname===MAIN_PATH();
  // state: 검색 페이지 상태
  const isSearchPage = pathname.startsWith(SEARCH_PATH(""));
  // state: 게시물 상세 페이지 상태
  const isBoardDetailPage = pathname.startsWith(BOARD_PATH()+'/'+ BOARD_DETAIL_PATH(""));
  // state: 게시물 작성 페이지 상태
  const isBoardWritePage = pathname.startsWith(BOARD_PATH()+'/'+ BOARD_WRITE_PATH());
  // state: 게시물 업로드 페이지 상태
  const isBoardUpdatePage = pathname.startsWith(BOARD_PATH()+'/'+ BOARD_UPDATE_PATH(""));
  // state: 유저 페이지 상태
  const isUserPage = pathname.startsWith(USER_PATH(""));

  // function: 네비게이트 함수
  const navigator = useNavigate();
  // event handler: 로고 클릭 이벤트 핸들러
  const onLogoClickHander = () => {
    navigator(MAIN_PATH());
  };

  // component: 검색버튼 컴포넌트
  const SearchButton = () => {
    // state: 검색 버튼 요소 참조 상태
    const searchButtonRef = useRef<HTMLDivElement | null>(null);

    // state: 검색 버튼 상태
    const [status, setStatus] = useState<boolean>(false);

    // state: 검색어 상태
    const [word, setWord] = useState<string>("");

    // state: 검색어 path valiable 상태
    const { searchWord } = useParams();

    // event handler:  검색어 변경 이벤트 처리 함수
    const onSearchWordChangeHandler = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value;
      setWord(value);
    };

    // event handler:  검색어 변경 이벤트 처리 함수
    const onSearchWordKeyDownHandler = (
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key !== "Enter") return;

      if (!searchButtonRef.current) return;
      searchButtonRef.current?.click();
    };

    // event handler:  검색아이콘 클릭 이벤트 처리 함수
    const onSearchButtonClickHandler = () => {
      if (!status) {
        setStatus(!status);
        return;
      }
      navigator(SEARCH_PATH(word));
    };

    // effect: 검색어 path valiable이 변경될 때 마다 실행될 함수
    useEffect(() => {
      if (searchWord) {
        setWord(searchWord);
        setStatus(true);
        return;
      }
    }, [searchWord]);
    // effect: login user가 변경될 때 마다 실행될 함수
    useEffect(()=>{
      setLogin(loginUser!==null);
    },[loginUser])

    if (!status) {
      // render: 검색렌더 (클릭 false상태)
      return (
        <div className="icon-button" onClick={onSearchButtonClickHandler}>
          <div className="icon search-light-icon"></div>
        </div>
      );
    }

    // render: 검색 렌더 (클릭 true 상태)
    return (
      <div className="header-search-input-box">
        <input
          type="text"
          className="header-search-input"
          placeholder="검색어를 입력해주세요."
          value={word}
          onChange={onSearchWordChangeHandler}
          onKeyDown={onSearchWordKeyDownHandler}
        />
        <div
          ref={searchButtonRef}
          className="icon-button"
          onClick={onSearchButtonClickHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    );
  };

  // component: 로그인 또는 마이페이지 버튼 컴포넌트
  const LoginMyPageButton = () => {
    // state: userEmail path variable 상태
    const { userEmail } = useParams();

    // event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
    const onMypageButtonClickHandler = () => {
      if (!loginUser) return;

      const { email } = loginUser;
      navigator(USER_PATH(email));
    };
    // event handler: 로그인 버튼 클릭 이벤트 처리 함수
    const onSigninButtonClickHandler = () => {
      navigator(AUTH_PATH());
    };
    // event handler: 로그아웃 버튼 클릭 이벤트 처리 함수
    const onSignoutButtonClickHandler = () => {
      resetLoginUser();
      setCookies('accessToken', '', {path:MAIN_PATH(), expires:new Date()});
      navigator(MAIN_PATH());
    };

    // render: 로그아웃 버튼 컴포넌트 렌더
    if (userEmail === loginUser?.email && isLogin) {
      return (
        <div className="black-button" onClick={onSignoutButtonClickHandler}>
          {"sign out"}
        </div>
      );
    }
    if (isLogin) {
      // render: 마이페이지 버튼 컴포넌트 렌더
      return (
        <div className="white-button" onClick={onMypageButtonClickHandler}>
          {"my page"}
        </div>
      );
    }
    // render: 로그인 버튼 컴포넌트 렌더
    return (
      <div className="black-button" onClick={onSigninButtonClickHandler}>
        {"sign in"}
      </div>
    );
  };
  // component: 업로드 버튼 컴포넌트
  const UploadButton = () => {
    // state: 게시물 상태
    const { title, content, boardImageFileList, resetBoard } = useBoardStore();

    // function: post board response 처리 함수
    const postBoardResponse = (responseBody: PostBoardResponseDto|ResponseDto|null)=>{
      if(!responseBody) return;
      
      const {code} = responseBody;

      if( "code" in responseBody){
        const {code} = responseBody  as ResponseDto;

        if(code === 'DBE')alert('데이터베이스 오류입니다.');
        if(code === 'AF' || code === 'NU'){
          alert('권한이 없습니다.');
          navigator(AUTH_PATH());
          return;
        }
        if(code ==='VF'){
          alert('제목과 내용은 필수입니다.');
        }
        if(code!=='SU')return;
      }

      resetBoard();
      if(!loginUser)return;
      const {email} = loginUser;
      navigator(USER_PATH(email));
    }
    // event handler: 업로드 버튼 클릭 이벤트 처리 함수
    const onUploadButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if(!accessToken) return;

      const boardImageList: string[] = [];
      
      for(const file of boardImageFileList ? boardImageFileList: []){
        const data = new FormData();
        data.append('file',file);
        const url = await fileUploadRequest(data);
        if(url) boardImageList.push(url);
      }

      const requestBody : PostBoardRequestDto = {
        title, content, boardImageList
      }
      postBoardRequest(requestBody, accessToken).then(postBoardResponse);
    };

    // render: 업로드 버튼 컴포넌트 렌더
    if (title && content) {
      return <div className="black-button" onClick={onUploadButtonClickHandler}>{"업로드"}</div>;
    }
    // render: 업로드 불가 버튼 컴포넌트 렌더
    return <div className="disable-button">{"업로드"}</div>;
  };

  // render: 헤더 레이아웃 렌더
  return (
    <div id="header">
      <div className="header-container">
        <div className="header-left-box" onClick={onLogoClickHander}>
          <div className="icon-box">
            <div className="icon logo-dark-icon"></div>
          </div>
          <div className="header-logo">{"Board Page"}</div>
        </div>
        <div className="header-right-box">
          {(isAuthPage || isMainPage || isSearchPage || isBoardDetailPage) && (
            <SearchButton />
          )}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && (
            <LoginMyPageButton />
          )}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  );
}
