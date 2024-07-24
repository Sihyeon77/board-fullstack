import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage: number, initialData: T[] = []) => {
  // state: 전체 객체 리스트 상태
  const [totalList, setTotalList] = useState<T[]>(initialData || []);
  // state: 보여줄 객체 리스트 상태
  const [viewList, setViewList] = useState<T[]>([]);
  // state: 현재 페이지 번호 상태
  const [currentPage, setCurrentPage] = useState<number>(1);

  // state: 전체 페이지 번호 리스트 상태
  const [totalPageList, setTotalPageList] = useState<number[]>([1]);
  // state: 보여줄 페이지 번호 리스트 상태
  const [viewPageList, setViewPageList] = useState<number[]>([1]);
  // state: 현재 섹션 상태
  const [currentSection, setCurrentSection] = useState<number>(1);
  // state: 전체 섹션 상태
  const [totalSection, setTotalSection] = useState<number>(1);

  console.log("totalList in pagination.hook.ts : " + totalList);

  // function: 보여줄 객체 리스트 추출 함수
  const setView = () =>{
      if(totalList.length > 0){
          const FIRST_INDEX = countPerPage * (currentPage -1);
          const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length;
          const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);

          console.log(FIRST_INDEX);
          console.log(LAST_INDEX);

          console.log("viewList in pagination.hook.ts : "+viewList);

          setViewList(viewList);
      }else{

      }
  };
  // function: 보여줄 페이지 리스트 추출 함수
  const setViewPage = () =>{

      if(totalPageList.length > 0 ){
          const FIRST_INDEX = 10 * (currentSection -1);
          const LAST_INDEX = totalPageList.length > 10 * currentSection ? 10 * currentSection : totalPageList.length;
          const viewPageList = totalPageList.slice(FIRST_INDEX, LAST_INDEX);

          setViewPageList(viewPageList)
      }else{

      }
  }

  // effect: current page가 변경될 때마다 실행할 작업
  useEffect(setView, [currentPage, totalList]);
  // effect: current section 변경될 때마다 실행할 작업
  useEffect(setViewPage, [currentSection, totalPageList]);

  // effect: total list가 변경될 때마다 실행할 작업
  useEffect(() => {
    if (totalList.length > 0) {
      const totalPageList: number[] = [];
      const totalPage = Math.ceil(totalList.length / countPerPage);
      setTotalPageList(totalPageList);

      for (let index = 1; index < totalPage; index++) {
        totalPageList.push(index);
      }

      const totalSection = Math.ceil(totalList.length / (countPerPage * 10));
      setTotalSection(totalSection);
    }

    setCurrentPage(1);
    setCurrentSection(1);

    setView();
    setViewPage();
  }, [totalList]);

  return {
    currentPage,
    setCurrentPage,
    currentSection,
    setCurrentSection,
    viewList,
    totalList,
    setTotalList,
    totalSection,
    totalPageList,
    viewPageList,
  };
};

export default usePagination;
