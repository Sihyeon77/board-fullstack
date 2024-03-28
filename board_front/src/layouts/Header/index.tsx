import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { MAIN_PATH, SEARCH_PATH } from 'constant';


//  component: 헤더 레이아웃
export default function Header() {

// function: 네비게이트 함수
const navigator = useNavigate();
// event handler: 로고 클릭 이벤트 핸들러
const onLogoClickHander=()=>{
  navigator(MAIN_PATH());
}


// component: 검색버튼 컴포넌트
const SearchButton=()=>{
  // state: 검색 버튼 요소 참조 상태
  const searchButtonRef = useRef<HTMLDivElement|null>(null);

  // state: 검색 버튼 상태
  const[status, setStatus] = useState<boolean>(true);

  // state: 검색어 상태
  const[word, setWord] = useState<string>('');

  // state: 검색어 path valiable 상태
  const {searchWord} = useParams();

// event handler:  검색어 변경 이벤트 처리 함수
  const onSearchWordChangeHandler=(event: ChangeEvent<HTMLInputElement>)=>{
    const value = event.target.value;
    setWord(value);
  };

// event handler:  검색어 변경 이벤트 처리 함수
  const onSearchWordKeyDownHandler=(event:KeyboardEvent<HTMLInputElement>)=>{
    if (event.key!== 'Enter')  return;
    
    if (!searchButtonRef.current)  return;
    searchButtonRef.current?.click();
  };

// event handler:  검색아이콘 클릭 이벤트 처리 함수
  const onSearchButtonClickHandler=()=>{
    if (!status) {
      setStatus(!status);
      return;
    }
    navigator(SEARCH_PATH(word));
  };

// effect: 검색어 path valiable이 변경될 때 마다 실행될 함수
  useEffect(() => {
    if(searchWord){
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
  };
  
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
}

    // render: 헤더 렌더
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHander}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>{"Board Page"}</div>
        </div>
        <div className='header-right-box'>
          <SearchButton/>
        </div>
      </div>
    </div>
  )
}
