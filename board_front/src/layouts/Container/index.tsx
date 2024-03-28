import React from 'react'
import './style.css'
import Header from 'layouts/Header'
import Footer from 'layouts/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { AUTH_PATH } from 'constant'


// component: 컨테이너 레이아웃
export default function Container() {

//  state: 현재 페이지 path anem 상태
const {pathname} = useLocation();

    // render: 컨테이너 렌더
  return (
    <>
      <Header />
      <Outlet />
      {pathname !== AUTH_PATH() && <Footer/>}
      {/* <Footer /> */}
    </>
  );
}
