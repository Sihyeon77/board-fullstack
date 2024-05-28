import axios, { AxiosError } from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { SignInResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import { log } from "console";

const DOMAIN = 'http://localhost:8081';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string)=>{
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}


const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async(requestBody: SignInRequestDto) =>{ 
    console.log(requestBody);
    
    // const result = await axios.post(SIGN_IN_URL(), requestBody)
    //     .then(response => {
    //         const responseBody:SignInResponseDto = response.data;
    //         // console.log(responseBody);
    //         return responseBody;
    //     })
    //     .catch(e =>{
    //         if(e.respose){
    //             const responseBody: ResponseDto = e.response.data;
    //             // console.log(responseBody);
    //             return responseBody;
    //         }
    //         else{
    //             console.log("Network error:", e.message);
    //             return null;
    //         } 
    //     })
    // return result;

        // try {
        //     const response = await axios.post(SIGN_IN_URL(), requestBody);
        //     const responseBody: SignInResponseDto = response.data;
        //     // console.log(responseBody);
        //     return responseBody;
        // } catch (e) {
        //     const error: AxiosError = e;
    
        //     if (error.response) {
        //         const responseBody: ResponseDto = error.response.data;
        //         // console.log(responseBody);
        //         return responseBody;
        //     } else {
        //         console.error("Network error:", error.message);
        //         return null;
        //     }
        // }


        try {
            const response = await axios.post<SignInResponseDto>(SIGN_IN_URL(), requestBody);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ResponseDto> = error;
                if (axiosError.response) {
                    return axiosError.response.data;
                } else {
                    console.log("Network error:", axiosError.message);
                }
            } else {
                console.error("Unexpected error:", error);
            }
            return null;
        }
}

export const signUpRequest = async(requestBody: SignUpRequestDto)=>{
    try {
        const response = await axios.post(SIGN_UP_URL(),requestBody);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)){
            const axiosError : AxiosError<ResponseDto> = error;
            if (axiosError.response){
                return axiosError.response.data;
            }else{
                console.log("Network error:", axiosError.message);
            }
        } else{
            console.error("Unexpected error:", error);
        }
        return null;
    }
}

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

export const getSignInUserRequest = async(accessToken : string) =>{
    try {
        const response = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken));
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            const axiosError : AxiosError<ResponseDto> = error;
            if(axiosError.response){
                return axiosError.response.data;
            }else{
                console.log("Network error:", axiosError.message);
            }
        }else{
            console.error("Unexpected error:", error);
        }
        return null;
    }
}