import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import InputBox from '../../components/InputBox/index';
import { SignInRequestDto, SignUpRequestDto } from 'apis/request/auth';
import { signInRequest, signUpRequest } from 'apis';
import { SignInResponseDto, SignUpResponseDto } from 'apis/response/auth';
import { ResponseDto } from 'apis/response';
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant';
import { useNavigate } from 'react-router-dom';
import { log } from 'console';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';


//  component: 인증화면 컴ㅍ넌트
export default function Authentication() {

  // state: 화면 상태
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
  // state: 쿠키 상태
  const [cookies, setCookies] = useCookies();

  // function: 네비게이트 함수
  const navigator = useNavigate();

//  component: sign in card 컴포넌트 
  const SignInCard = () =>{
    // state: 이메일 요소 참조 상태
    const emailRef = useRef<HTMLInputElement | null>(null); 
    // state: 패스워드 요소 참조 상태
    const passwordRef = useRef<HTMLInputElement | null>(null); 
    // state: 이메일 상태
    const [email, setEmail] =useState<string>("");
    // state: 패스워드 상태
    const [password, setPassword]=useState<string>("");
    // state: 패스워드 타입 상태
    const [passwordType, setPasswordType]=useState<'text'|'password'>('password');
    // state: 패스워드 버튼 아이콘 상태
    const [passwordButtonIcon, setPasswordButtonIcon]=useState<'eye-light-off-icon'|'eye-light-on-icon'>('eye-light-off-icon');
    // state: 에러 상태
    const [error, setError]=useState<boolean>(false);

    // function: sign in response 처리함수
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null ) =>{
      console.log(responseBody);

      if (!responseBody) {
        alert("네트워크 이상입니다.");
        return;
      }
      if ("code" in responseBody) {
        const { code } = responseBody as ResponseDto;
        if (code === "DBE") alert("데이터베이스 오류입니다.");
        if (code === "SF" || code === "VF") setError(true);
        if (code !== "SU") return;
      }

      const { token, expirationTime } = responseBody as SignInResponseDto;
      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);
      setCookies("accessToken", token, { expires, path: MAIN_PATH() });
      console.log(cookies);

      navigator(MAIN_PATH());

      // const {code} = responseBody;
      // if(code === 'DBE') alert('데이터베이스 오류입니다.');
      // if(code === 'SF' || code === 'VF') setError(true);
      // if(code !== 'SU') return;
      // const {token, expirationTime} = responseBody as SignInResponseDto;
      // const now = new Date().getTime();
      // const expires = new Date(now + expirationTime*1000);
      // setCookies('accessToken', token, {expires, path:MAIN_PATH()});
      // navigator(MAIN_PATH());
    }
    // event handler: 이메일 변경 이벤트 처리
    const onEmailChangeHandler=(event: ChangeEvent<HTMLInputElement>) =>{
      setError(false);
      const {value} = event.target;
      setEmail(value);
    }
    // event handler: 패스워드 변경 이벤트 처리
    const onPasswordChangeHandler=(event: ChangeEvent<HTMLInputElement>) =>{
      setError(false);
      const {value} = event.target;
      setPassword(value);
    }
    // event handler: 로그인 버튼 클릭 이벤트 처리 함수 
    const onSignInButtonClickHandler = ()=>{
      const requestBody: SignInRequestDto = {email, password};
      signInRequest(requestBody).then(signInResponse);
    }
    // event handler: 회원가입 링크 클릭 이벤트 처리 함수 
    const onSignUpLickClickHandler = () =>{
      setView('sign-up');
    }
    // event handler: 패스워드 버튼 클릭 이벤트 처리 함수 
    const onPasswordButtonClickHandler = () =>{
      if (passwordType === 'text'){
        setPasswordType('password');
        setPasswordButtonIcon('eye-light-off-icon');
      }
      else{
        setPasswordType('text');
        setPasswordButtonIcon('eye-light-on-icon');
      }
    }
    // event handler: 이메일 Input Key Down 이벤트 처리 함수 
    const onEmailKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
      if (event.key !== 'Enter')return;
      if (!passwordRef.current)return;
      passwordRef.current.focus();
    }
    // event handler: 패스워드 Input Key Down 이벤트 처리 함수 
    const onPasswordKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
      if (event.key !== 'Enter')return;
      onSignInButtonClickHandler();
      // const requestBody: SignInRequestDto = { email, password };
      // signInRequest(requestBody).then(signInResponse);
    }

    // render: sign in card 컴포넌트 render
    return (
      <div className="auth-card">
        <div className="auth-card-box">
          <div className="auth-card-top">
            <div className="auth-card-title-box">
              <div className="auth-card-title">{"로그인"}</div>
            </div>
            <InputBox
              ref={emailRef}
              label="이메일 주소"
              type="text"
              placeHolder="이메일 주소를 입력해주세요."
              error={error}
              value={email}
              onChange={onEmailChangeHandler}
              onKeyDown={onEmailKeyDownHander}
            />
            <InputBox
              ref={passwordRef}
              label="비밀번호"
              type={passwordType}
              placeHolder="비밀번호를 입력해주세요."
              error={error}
              value={password}
              onChange={onPasswordChangeHandler}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
              onKeyDown={onPasswordKeyDownHander}
            />
          </div>
          <div className="auth-card-bottom">
            {error && (
              <div className="auth-sign-in-error-box">
                <div className="auth-sign-in-error-message">
                  {
                    "이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요."
                  }
                </div>
              </div>
            )}

            <div
              className="black-large-full-button"
              onClick={onSignInButtonClickHandler}
            >
              {"로그인"}
            </div>
            <div className="auth-description-box">
              <div className="auth-description">
                {"신규 사용자이신가요?  "}
                <span
                  className="auth-description-link"
                  onClick={onSignUpLickClickHandler}
                >
                  {"회원가입"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
//  component: sign up card 컴포넌트 
const SignUpCard = () =>{
  // state: 페이지 번호 상태
  const [page, setPage] = useState<1 | 2>(1);

  // state: 이메일 요소 참조 상태
  const emailRef = useRef<HTMLInputElement | null>(null);
  // state: 패스워드 요소 참조 상태
  const passwordRef = useRef<HTMLInputElement | null>(null);
  // state: 패스워드 확인 요소 참조 상태
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  // state: 닉네임 요소 참조 상태
  const nicknameRef = useRef<HTMLInputElement | null> (null);
  // state: 휴대 전화번호 요소 참조 상태
  const telNumberRef = useRef<HTMLInputElement | null> (null);
  // state: 주소 요소 참조 상태
  const addressRef = useRef<HTMLInputElement | null> (null);
  // state: 상세주소 요소 참조 상태
  const addressDetailRef = useRef<HTMLInputElement | null> (null);
  
  // state: 이메일 상태
  const [email, setEmail] = useState<string>("");
  // state: 패스워드 상태
  const [password, setPassword] = useState<string>("");
  // state: 패스워드 확인 상태
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  // state: 닉네임 상태
  const [nickname, setNickname] = useState<string>("");
  // state: 휴대 전화번호 상태
  const [telNumber, setTelNumber] = useState<string>("");
  // state: 주소 상태
  const [address, setAddress] = useState<string>("");
  // state: 상세 주소 상태
  const [addressDetail, setAddressDetail] = useState<string>("");
  // state: 개인정보 동의 상태
  const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);

  // state: 패스워드 타입 상태
  const [passwordType, setPasswordType] = useState<"text" | "password">("password");
  // state: 패스워드 확인 타입 상태
  const [passwordCheckType, setPasswordCheckType] = useState<"text" | "password">("password");

  // state: 이메일 에러 상태
  const [isEmailError, setEmailError] = useState<boolean>(false);
  // state: 패스워드 상태
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  // state: 패스워드 확인 상태
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
  // state: 닉네임 에러 상태
  const [isNicknameError, setNicknameError] = useState<boolean>(false);
  // state: 휴대폰 에러 상태
  const [isTelNumberError, setTelNumberError] = useState<boolean>(false);
  // state: 주소 에러 상태
  const [isAddressError, setAddressError] = useState<boolean>(false);
  // state: 개인정보동의 에러 상태
  const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);

  // state: 이메일 에러 메세지 상태
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  // state: 패스워드 메세지 상태
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
  // state: 패스워드 확인 메세지 상태
  const [passwordCheckErrorMessage, setPasswordCheckErrorMessage] = useState<string>('');
  // state: 닉네임 에러 메세지 상태
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string>('');
  // state: 휴대폰 번호 에러 메세지 상태
  const [telNumberErrorMessage, setTelNumberErrorMessage] = useState<string>('');
  // state: 주소 에러 메세지 상태
  const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');
  // state: 주소 에러 메세지 상태
  // const [agreedPersonalErrorMessage, setAgreedPersonalErrorMessage] = useState<string>('');
  
  // state: 패스워드 버튼 아이콘 상태
  const [passwordButtonIcon, setPasswordButtonIcon]=useState<'eye-light-off-icon'|'eye-light-on-icon'>('eye-light-off-icon');
  // state: 패스워드 확인 버튼 아이콘 상태
  const [passwordCheckButtonIcon, setPasswordCheckButtonIcon]=useState<'eye-light-off-icon'|'eye-light-on-icon'>('eye-light-off-icon');

  // function: 다음 주소 검색 팝업 오픈 함수
  const open = useDaumPostcodePopup();
  // function: sign up response 처리 함수
  const signUpResponse = (responseBody: SignUpResponseDto| ResponseDto |null) =>{
    if(!responseBody){
      alert('네트워크 이상입니다.');
       return;
    }
    const {code} = responseBody;
    // vf, de, 
    if (code === 'DE'){
      setEmailError(true);
      setEmailErrorMessage('중복되는 이메일 주소입니다.');
    }
    if (code === 'DN'){
      setNicknameError(true);
      setNicknameErrorMessage('중복되는 닉네임입니다.');
    }
    if (code === 'DT'){
      setTelNumberError(true);
      setTelNumberErrorMessage('중복되는 휴대폰 번호입니다.');
    }
    if(code==='VF')alert('모든값을 입력해주세요.');
    if(code==='DBE')alert('데이터베이스 오류입니다.');
    if(code !=='SU')return;
    alert('회원가입이 정상적으로 이루어졌습니다.');
    setView('sign-in');
  }

  // event handler: 이메일 변경 이벤트 처리
  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(false);
    setEmailErrorMessage('');
  };
  // event handler: 패스워드 변경 이벤트 처리
  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(false);
    setPasswordErrorMessage('');
  };
  // event handler: 패스워드 확인 변경 이벤트 처리
  const onPasswordCheckChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setPasswordCheckError(false);
    setPasswordCheckErrorMessage('');
  };
  // event handler: 닉네임 변경 이벤트 처리
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNickname(value);
    setNicknameError(false);
    setNicknameErrorMessage('');
  };
  // event handler: 휴대폰 번호 변경 이벤트 처리
  const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTelNumber(value);
    setTelNumberError(false);
    setTelNumberErrorMessage('');
  };
  // event handler: 주소 변경 이벤트 처리
  const onAddressChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setAddress(value);
    setAddressError(false);
    setAddressErrorMessage('');
  };
  // event handler: 상세 주소 변경 이벤트 처리
  const onAddressDetailChangeHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setAddressDetail(value);
  };

  // event handler: 개인정보 동의 체크박스 클릭 이벤트 처리
  const onAgreedPersonalClickHandler = () =>{
    setAgreedPersonal(!agreedPersonal);
    setAgreedPersonalError(false);
  }
  // event handler: 패스워드 버튼 클릭 이벤트 처리 함수 
  const onPasswordButtonClickHandler = () =>{
    if (passwordType === 'text'){
      setPasswordType('password');
      setPasswordButtonIcon('eye-light-off-icon');
    }
    else{
      setPasswordType('text');
      setPasswordButtonIcon('eye-light-on-icon');
    }
  }
  // event handler: 패스워드 확인 버튼 클릭 이벤트 처리 함수 
  const onPasswordCheckButtonClickHandler = () =>{
    if (passwordCheckType === 'text'){
      setPasswordCheckType('password');
      setPasswordCheckButtonIcon('eye-light-off-icon');
    }
    else{
      setPasswordCheckType('text');
      setPasswordCheckButtonIcon('eye-light-on-icon');
    }
  }
  // event handler: 주소 버튼 클릭 이벤트 처리
  const onAddressButtonClickHandler = () =>{
    open({onComplete});
  }
  // event handler: 다음 단계 버튼 클릭 이벤트 처리 함수 
  const onNextButtonClickHandler = ( ) =>{
    const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9]*\.[a-zA-Z]{2,4})$/;
    const isEmailPattern = emailPattern.test(email);
    if(!isEmailPattern){
      setEmailError(true);
      setEmailErrorMessage('이메일 주소 포멧이 올바른 형태가 아닙니다.');
      
    }
    const isCheckedPassword = password.trim().length >=8;
    if (!isCheckedPassword){
      setPasswordError(true);
      setPasswordErrorMessage('비밀번호는 최소 8자 이상이여야 합니다.');
    }
    const isEqualPassword = password === passwordCheck;
    if(!isEqualPassword){
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage('비밀번호가 일치하지 않습니다.');
    }
    if(!isEmailPattern || !isCheckedPassword|| !isEqualPassword)return;
    setPage(2);
  }
  // event handler: 회원가입 버튼 클릭 이벤트 처리
  const onSignUpButtonClickHandler = () =>{
    const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9]*\.[a-zA-Z]{2,4})$/;
    const isEmailPattern = emailPattern.test(email);
    if (!isEmailPattern) {
      setEmailError(true);
      setEmailErrorMessage("이메일 주소 포멧이 올바른 형태가 아닙니다.");
    }
    const isCheckedPassword = password.trim().length >= 8;
    if (!isCheckedPassword) {
      setPasswordError(true);
      setPasswordErrorMessage("비밀번호는 최소 8자 이상이여야 합니다.");
    }
    const isEqualPassword = password === passwordCheck;
    if (!isEqualPassword) {
      setPasswordCheckError(true);
      setPasswordCheckErrorMessage("비밀번호가 일치하지 않습니다.");
    }
    if (!isEmailPattern || !isCheckedPassword || !isEqualPassword) {
      setPage(1);
      return;
    }

    const hasNickname = nickname.trim().length !== 0;
    if (!hasNickname) {
      setNicknameError(true);
      setNicknameErrorMessage("닉네임을 입력해주세요.");
    }

    const telNumberPattern = /^[0-9]{11,13}$/;
    const isTelNumberPattern = telNumberPattern.test(telNumber);
    if (!isTelNumberPattern) {
      setTelNumberError(true);
      setTelNumberErrorMessage("숫자만 입력해주세요");
    }

    const hasAddress = address.trim().length > 0;
    if (!hasAddress) {
      setAddressError(true);
      setAddressErrorMessage("주소를 확인해주세요.");
    }

    if (!agreedPersonal) {
      setAgreedPersonalError(true);
      alert('개인정보 동의사항을 확인해주세요.')
    }
    if (!hasNickname || !isTelNumberPattern || !agreedPersonal) return;

    const requestBody: SignUpRequestDto = {
      email,
      password,
      nickname,
      telNumber,
      address,
      addressDetail,
      agreedPersonal,
    };

    signUpRequest(requestBody).then(signUpResponse);
  }

  // event handler: 로그인 링크 클릭 이벤트 처리 함수 
  const onSignInLinkClickHandler = () =>{
    setView('sign-in');
  }
  // event handler: 이메일 Input Key Down 이벤트 처리 함수 
  const onEmailKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== 'Enter')return;
    if (!passwordRef.current)return;
    passwordRef.current.focus();
  }
  // event handler: 패스워드 Input Key Down 이벤트 처리 함수 
  const onPasswordKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== 'Enter')return;
    if (!passwordCheckRef.current)return;
    passwordCheckRef.current.focus();
  }
  // event handler: 패스워드 확인 Input Key Down 이벤트 처리 함수 
  const onPasswordCheckKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== "Enter") return;
    onNextButtonClickHandler();
  }
  // event handler: 닉네임 Input Key Down 이벤트 처리 함수
  const onNicknameKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== 'Enter')return;
    if (!telNumberRef.current)return;
    telNumberRef.current.focus();
  }
  // event handler: 휴대폰 Input Key Down 이벤트 처리 함수
  const onTelNumberKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== 'Enter')return;
    onAddressButtonClickHandler();
    // if (!addressRef.current)return;
    // addressRef.current.focus();
  }
  // event handler: 주소 Input Key Down 이벤트 처리 함수
  const onAddressKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== 'Enter')return;
    if (!addressDetailRef.current)return;
    addressDetailRef.current.focus();
  }
  // event handler: 상세 주소 Input Key Down 이벤트 처리 함수
  const onAddressDetailKeyDownHander = (event: KeyboardEvent<HTMLInputElement>) =>{
    if (event.key !== 'Enter')return;
    onSignUpButtonClickHandler(); 
  }

  // event handler: 다음 주소 이벤트 처리 함수
  const onComplete = (data: Address) =>{
    const {address} = data;
    setAddress(address);
    setAddressError(false);
    setAddressErrorMessage('');
    if(!addressDetailRef.current) return;
    addressDetailRef.current.focus();
  }

  // effect: 페이지가 변경될 때 마다 실행될 함수
  useEffect(()=>{
    if(page === 2){
      if (!nicknameRef.current) return;
      nicknameRef.current.focus();
    }
  }, [page])

  return (
    // render: sign up card 컴포넌트 렌더
    <div className="auth-card">
      <div className="auth-card-box">
        <div className="auth-card-top">
          <div className="auth-card-title-box">
            <div className="auth-card-title">{"회원가입"}</div>
            <div className="auth-card-page">{`${page}/2`}</div>
          </div>
          {/* page 1 */}
          {page === 1 && (
            <>
              <InputBox
                ref={emailRef}
                label="이메일 주소*"
                type="text"
                placeHolder="이메일 주소를 입력해주세요."
                value={email}
                onChange={onEmailChangeHandler}
                error={isEmailError}
                message={emailErrorMessage}
                onKeyDown={onEmailKeyDownHander}
              />
              <InputBox
                ref={passwordRef}
                label="비밀번호*"
                type={passwordType}
                placeHolder="비밀번호를 입력해주세요."
                value={password}
                onChange={onPasswordChangeHandler}
                error={isPasswordError}
                icon={passwordButtonIcon}
                onButtonClick={onPasswordButtonClickHandler}
                message={passwordErrorMessage}
                onKeyDown={onPasswordKeyDownHander}
              />
              <InputBox
                ref={passwordCheckRef}
                label="비밀번호 확인*"
                type={passwordCheckType}
                placeHolder="비밀번호를 다시 입력해주세요."
                value={passwordCheck}
                onChange={onPasswordCheckChangeHandler}
                error={isPasswordCheckError}
                icon={passwordCheckButtonIcon}
                onButtonClick={onPasswordCheckButtonClickHandler}
                message={passwordCheckErrorMessage}
                onKeyDown={onPasswordCheckKeyDownHander}
              />
            </>
          )}
          {/* page 2 */}
          {page === 2 && (
            <>
              <InputBox
                ref={nicknameRef}
                label="닉네임*"
                type="text"
                placeHolder="닉네임을 입력해주세요."
                value={nickname}
                onChange={onNicknameChangeHandler}
                error={isNicknameError}
                message={nicknameErrorMessage}
                onKeyDown={onNicknameKeyDownHander}
              />
              <InputBox
                ref={telNumberRef}
                label="휴대폰 번호*"
                type="text"
                placeHolder="휴대폰 번호를 입력해주세요."
                value={telNumber}
                onChange={onTelNumberChangeHandler}
                error={isTelNumberError}
                message={telNumberErrorMessage}
                onKeyDown={onTelNumberKeyDownHander}
              />
              <InputBox
                ref={addressRef}
                label="주소*"
                type="text"
                placeHolder="우편번호 찾기"
                value={address}
                onChange={onAddressChangeHandler}
                error={isAddressError}
                message={addressErrorMessage}
                icon="expand-right-light-icon"
                onButtonClick={onAddressButtonClickHandler}
                onKeyDown={onAddressKeyDownHander}
              />
              <InputBox
                ref={addressDetailRef}
                label="상세 주소"
                type="text"
                placeHolder="상세주소를 입력해주세요."
                value={addressDetail}
                onChange={onAddressDetailChangeHandler}
                error={false}
                onKeyDown={onAddressDetailKeyDownHander}
              />
            </>
          )}
        </div>
        <div className="auth-card-bottom">
          {page === 1 && (
            <div
              className="black-large-full-button"
              onClick={onNextButtonClickHandler}
            >
              {"다음단계"}
            </div>
          )}
          {page === 2 && (
            <>
              <div className="auth-consent-box">
                <div className="auth-check-box" onClick={onAgreedPersonalClickHandler}>
                  <div
                    className={`icon ${
                      agreedPersonal
                        ? "check-round-fill-icon"
                        : "check-ring-light-icon"
                    }`}
                  ></div>
                </div>
                <div
                  className={
                    isAddressError
                      ? "auth-consent-title-error"
                      : "auth-consent-title"
                  }
                >
                  {"개인정보동의"}
                </div>
                <div className="auth-consent-link">{"더보기 "}</div>
              </div>
              <div
                className="black-large-full-button"
                onClick={onSignUpButtonClickHandler}
              >
                {"회원가입"}
              </div>
            </>
          )}
          <div className="auth-description-box">
            <div className="auth-description">
              {"이미 계정이 있으신가요? "}{" "}
              <span
                className="auth-description-link"
                onClick={onSignInLinkClickHandler}
              >
                {"로그인"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//  render: 인증화면 컴포넌트 render
  return (
    <div id='auth-wrapper'>
      <div className='auth-container'>
        <div className='auth-jumbotron-box'>
          <div className='auth-jumbotron-contents'>
            <div className='auth-logo-icon'></div>
            <div className='auth-jumbotron-text-box'>
              <div className='auth-jumbotron-text'>{"welcome"}</div>
              <div className='auth-jumbotron-text'>{"this is front board "}</div>
            </div>
          </div>
        </div>
        {view === 'sign-in'&& <SignInCard/>}
        {view === 'sign-up'&& <SignUpCard/>}
      </div>
    </div>
  )
}
