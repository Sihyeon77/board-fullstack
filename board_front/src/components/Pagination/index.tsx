import React, { Dispatch, SetStateAction } from 'react'
import './style.css'



//  interface: 페이지네이션 컴포넌트 Properties
interface Props{
  currentPage: number;
  currentSection: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCurrentSection: Dispatch<SetStateAction<number>>;

  viewPageList: number[];
  totalSection: number;
}

//  component: 게시물 상세화면 컴포넌트
export default function Pagination(props:Props) {
// state: Properties
const { currentPage, currentSection, viewPageList, totalSection} = props;
const { setCurrentPage, setCurrentSection} = props;

// event handler: 페이지 번호 클릭 이벤트 처리
const onPageClickHandler = (page:number)=>{
  setCurrentPage(page);
}

// event handler: 이전 번호 클릭 이벤트 처리
const onPreviousButtonClickHandler = ()=>{
  if(currentSection === 1) return;
  setCurrentPage((currentSection-1) *10);
  setCurrentSection(currentSection -1);
}
// event handler: 이전 번호 클릭 이벤트 처리
const onNextButtonClickHandler = ()=>{
  if(currentSection === totalSection) return;
  setCurrentPage(currentSection * 10 +1);
  setCurrentSection(currentSection + 1);
}

//  render: 페이지네이션 상세화면 render
  return (
    <div id="pagination-wrapper">
      <div className="pagination-change-link-box">
        <div className="icon-box-small" id="left">
          <div className="icon expand-left-icon"></div>
        </div>
        <div className="pagination-change-link-text" onClick={onPreviousButtonClickHandler}>{"이전"}</div>
      </div>
      <div className="pagination-divider">{"|"}</div>
      {viewPageList.map((page, index) =>
        page === currentPage ? (
          <div key={index} className="pagination-text-active">{page}</div>
        ) : (
          <div key={index} className="pagination-text" onClick={() => onPageClickHandler(page)}>{page}</div>
        )
      )}
      <div className="pagination-divider">{"|"}</div>
      <div className="pagination-change-link-box">
        <div className="pagination-change-link-text" onClick={onNextButtonClickHandler}>{"다음"}</div>
        <div className="icon-box-small" id="right">
          <div className="icon expand-right-icon"></div>
        </div>
      </div>
    </div>
  );
}
