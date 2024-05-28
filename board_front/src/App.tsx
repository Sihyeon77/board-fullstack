import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import DetailBoard from 'views/Board/Detail';
import UpdateBoard from 'views/Board/Update';
import WriteBoard from 'views/Board/Write';
import Search from 'views/Search';
import UserPage from 'views/User';
import Container from 'layouts/Container';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';



//    component: Application 컴포넌트 



function App() {
  // state: 로그인 유저 전역 상태
  const {setLoginUser, resetLoginUser} = useLoginUserStore();
  // state: cookie 상태
  const [cookies, setCookies] = useCookies();
  //  function: get sign in user response 처리 함수 
  const getSignInUserResponse = (responseBody:GetSignInUserResponseDto|ResponseDto| null) =>{
    if(!responseBody)return;
    const {code}=responseBody;
    if(code==='AF'||code==='NU'||code==='DBE'){
      resetLoginUser();
      return;
    }
    const loginUser : User = {...responseBody as GetSignInUserResponseDto};
    setLoginUser(loginUser);
  }
  //  effect: accessToken cookie 값이 변경될 때 마다 실행될 함수
  useEffect(()=>{
    if(!cookies.accessToken){
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  },[cookies.accessToken])
  //  description: 메인화면 : '/' - ㅡMain
  //   description: 로그인 _ 회원가입 : '/auth' -Autherntication
  //  description: 검색화면 : '/search/:searchWord' -search
  //  description: 게시물 상태보기 :  'board/detail/:boardNumber' boardDetail
  //  description: 게시물 작성하기 : 'board/write' - boardWrite
  //  description: 게시물 수정하기 : 'board/update/:boardNumber' -boardUpdate
  //  description: 유저 페이지: '/user/:userEmail' -User

  //      render: application render
   return (
     <Routes>
       <Route element={<Container />}>
         <Route path={MAIN_PATH()} element={<Main></Main>}></Route>
         <Route
           path={AUTH_PATH()}
           element={<Authentication></Authentication>}
         ></Route>
         <Route
           path={SEARCH_PATH(":searchWord")}
           element={<Search></Search>}
         ></Route>
         <Route path={USER_PATH(':userEmail')} element={<UserPage></UserPage>}></Route>
         <Route path={BOARD_PATH()}>
           <Route
             path={BOARD_WRITE_PATH()}
             element={<WriteBoard></WriteBoard>}
           ></Route>
           <Route
             path={BOARD_UPDATE_PATH(":boardNumber")}
             element={<UpdateBoard></UpdateBoard>}
           ></Route>
           <Route
             path={BOARD_DETAIL_PATH(":boardNumber")}
             element={<DetailBoard></DetailBoard>}
           ></Route>
         </Route>
         <Route path="*" element={<h1>404 Not Found</h1>}></Route>
       </Route>
     </Routes>
   );
}

export default App;
