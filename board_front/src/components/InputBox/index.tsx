import {ChangeEvent, forwardRef, KeyboardEvent, SetStateAction} from 'react'
import './style.css'

interface Props{
  label: string;
  type: 'text'|'password'
  placeHolder: string;
  value:string;
  setValue:React.Dispatch<SetStateAction<string>>;
  error: boolean;

  icon?: string;
  onButtonClick? : ()=>void;
  message?:string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>)=>void;
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  
  const {setValue,onButtonClick, onKeyDown} = props;
  const {label, type,placeHolder, value, error,icon,message}=props;

//            keyboard event
  const onKeydownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{
    if (!onKeyDown) return;
    onKeyDown(event);
  }

  //  event handler input 값 변경 이밴트 처리함수
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
    const {value}= event.target;
    setValue(value);
  }

  //  렌더

  return (
    <div className="inputbox">
      <div className="inputbox-label">{label}</div>
      <div
        className={error ? "inputbox-container-error" : "inputbox-container"}
      >
        <input
          ref={ref}
          type={type}
          className="input"
          placeholder={placeHolder}
          value={value}
          onChange={onChangeHandler}
          onKeyDown={onKeyDown}
        />
        {onButtonClick !== undefined && (
          <div className="icon-button">
            {icon !== undefined && <div className={`icon${icon}`}></div>}
            <div className="icon eye-light-off-icon"></div>
          </div>
        )}
      </div>
      {message !== undefined && (
        <div className="inputbox-message">{message}</div>
      )}
    </div>
  );
});

export default InputBox