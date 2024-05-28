import {ChangeEvent, forwardRef, KeyboardEvent} from 'react'
import './style.css'

// interface: Input Box 컴포넌트 Properties
interface Props{
  label: string;
  type: 'text'|'password'
  placeHolder: string;
  value:string;
  onChange:(event: ChangeEvent<HTMLInputElement>) =>void;
  error: boolean;

  icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
  onButtonClick? : ()=>void;
  message?:string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>)=>void;
}

// component: Input Box 컴포넌트
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  
  // state: properties
  const {onChange, onButtonClick, onKeyDown} = props;
  const {label, type,placeHolder, value, error,icon,message}=props;

//            keyboard event
  const onKeydownHandler =(event: KeyboardEvent<HTMLInputElement>)=>{
    // if (!onKeyDown) return;
    // onKeyDown(event);
    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  //  render: Input Box 컴포넌트 

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
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {/* {onButtonClick !== undefined && (
          <div className="icon-button" onClick={onButtonClick}>
            {icon !== undefined && <div className={`icon${icon}`}></div>}
            <div className="icon eye-light-off-icon"></div>
          </div>
        )} */}
        {onButtonClick && icon && (
          <div className="icon-button" onClick={onButtonClick}>
            <div className={`icon ${icon}`}></div>
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