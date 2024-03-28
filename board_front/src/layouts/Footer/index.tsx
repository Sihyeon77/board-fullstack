import React from 'react'
import './style.css'


//              component: Footer Layout
export default function Footer() {


//      event handler:  인스타 아이콘 클릭 이벤트
    const onInstaButtonClickHander = ()=>{
        window.open('https://www.instagram.com');
    };

//      event handler:  네이버 블로그 아이콘 버튼 클릭 이벤트 처리
    const onNaverBlogButtonClickHander=()=>{
        window.open('https://blog.naver.com');
    };

//            render: Footer Layout Render
  return (
    <div id='footer'>
        <div className='footer-container'>
            <div className='footer-top'>
                <div className='footer-logo-box'>
                    <div className='icon-box'>
                        <div className='icon logo-light-icon'></div>
                    </div>
                    <div className='footer-logo-text'>{'Board Page'}</div>
                </div>

                <div className='footer-link-box'>
                    <div className='footer-email-link'>{"jy6026@gmail.com"}</div>
                    <div className='icon-button'>
                        <div className='icon insta-icon' onClick={onInstaButtonClickHander}></div>
                    </div>
                    <div className='icon-button'>
                        <div className='icon naver-blog-icon' onClick={onNaverBlogButtonClickHander}></div>
                    </div>
                </div>
            </div>
            <div className='footer-bottom'>
                <div className='footer-copyright'>{'Copyright'}</div>
            </div>
        </div>
    </div>
  )
}
