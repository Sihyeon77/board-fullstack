import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import DetailBoard from 'views/Board/Detail';
import UpdateBoard from 'views/Board/Update';
import WriteBoard from 'views/Board/Write';
import Search from 'views/Search';
import User from 'views/User';
import Container from 'layouts/Container';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';



//    component: Application 컴포넌트 



function App() {
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
         <Route path={USER_PATH(":userEmail")} element={<User></User>}></Route>
         <Route path={BOARD_PATH()}>

           <Route
             path={BOARD_WRITE_PATH()}
             element={<WriteBoard></WriteBoard>}
           ></Route>
           <Route
             path={BOARD_UPDATE_PATH(':boardNumber')}
             element={<UpdateBoard></UpdateBoard>}
           ></Route>
           <Route
             path={BOARD_DETAIL_PATH(':boardNumber')}

             element={<DetailBoard></DetailBoard>}
           ></Route>
         </Route>
       </Route>
       <Route path='*' element={<h1>404 Not Found</h1>}></Route>
     </Routes>
   );
}

export default App;
