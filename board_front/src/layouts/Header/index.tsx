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
  const isAuthPage = pathname.startsWith(AUTH_PATH());
  const isMainPage = pathname===MAIN_PATH();
  const isSearchPage = pathname.startsWith(SEARCH_PATH(""));
  const isBoardDetailPage = pathname.startsWith(BOARD_DETAIL_PATH(""));
  const isBoardWritePage = pathname.startsWith(BOARD_WRITE_PATH());
  const isBoardUpdatePage = pathname.startsWith(BOARD_UPDATE_PATH(""));
  const isUserPage = pathname.startsWith(USER_PATH(""));
  // // state: 인증 페이지 상태
  // const [isAuthPage, setAuthPage] = useState<boolean>(false);
  // // state: 메인 페이지 상태
  // const [isMainPage, setMainPaget] = useState<boolean>(false);
  // // state: 검색 페이지 상태
  // const [isSearchPage, setSearchPage] = useState<boolean>(false);
  // // state: 게시물 상세 페이지 상태
  // const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  // // state: 게시물 작성 페이지 상태
  // const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  // // state: 게시물 수정 페이지 상태
  // const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  // // state: 유저 페이지 상태
  // const [isUserPage, setUserPage] = useState<boolean>(false);

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

    // event handler: 업로드 버튼 클릭 이벤트 처리 함수
    const onUploadButtonClickHandler = () => {};

    // render: 업로드 버튼 컴포넌트 렌더
    if (title && content) {
      return <div className="black-button">{"업로드"}</div>;
    }
    // render: 업로드 불가 버튼 컴포넌트 렌더
    return <div className="disable-button">{"업로드"}</div>;
  };

  // effect: path가 변경될 때 마다 실행될 함수
  // useEffect(() => {
  //   const isAuthPage = pathname.startsWith(AUTH_PATH());
  //   const isMainPage = pathname===MAIN_PATH();
  //   const isSearchPage = pathname.startsWith(SEARCH_PATH(""));
  //   const isBoardDetailPage = pathname.startsWith(BOARD_DETAIL_PATH(""));
  //   const isBoardWritePage = pathname.startsWith(BOARD_WRITE_PATH());
  //   const isBoardUpdatePage = pathname.startsWith(BOARD_UPDATE_PATH(""));
  //   const isUserPage = pathname.startsWith(USER_PATH(""));
  //   setAuthPage(isAuthPage)
  //   setMainPaget(isMainPage)
  //   setSearchPage(isSearchPage)
  //   setBoardDetailPage(isBoardDetailPage)
  //   setBoardWritePage(isBoardWritePage)
  //   setBoardUpdatePage(isBoardUpdatePage)
  //   setUserPage(isUserPage)
  //   console.log(BOARD_WRITE_PATH());

  // }, [pathname]);

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
