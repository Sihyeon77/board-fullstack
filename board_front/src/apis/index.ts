import axios, { AxiosError } from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import { PostBoardRequestDto, PostCommentRequestDto } from "./request/board";
import { DeleteBoardResponseDto, GetBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto, IncreaseViewCountResponseDto, PostCommentResponseDto, PutFavoriteResponseDto } from "./response/board";
import PostBoardResponseDto from "./response/board/post-board.reponse.dto";
import { GetSignInUserResponseDto } from "./response/user";

const DOMAIN = 'http://localhost:8081';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string)=>{
    return {headers: {Authorization: `Bearer ${accessToken}`}}
}


const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async(requestBody: SignInRequestDto) =>{ 
    console.log(requestBody);

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
        const response = await axios.post<SignUpResponseDto>(SIGN_UP_URL(), requestBody);
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

const POST_BOARD_URL = ()=>`${API_DOMAIN}/board`
const GET_BOARD_URL = (boardNumber : number|string) => `${API_DOMAIN}/board/${boardNumber}`;
const DELETE_BOARD_URL = (boardNumber : number|string) => `${API_DOMAIN}/board/${boardNumber}/delete`;
const INCREASE_VIEW_URL = ( boardNumber : number| string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber:number|string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const PUT_FAVORITE_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
const GET_COMMENT_LIST_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const POST_COMMENT_URL = (boardNumber: number|string) => `${API_DOMAIN}/board/${boardNumber}/comment`;

export const getBoardRequest = async ( boardNumber: number| string )=>{
    try {
        const resposne = await axios.get<GetBoardResponseDto>(GET_BOARD_URL(boardNumber));
        return resposne.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            const axiosError : AxiosError<ResponseDto> = error;
            if(axiosError.response){
                return axiosError.response.data;
            }else{
                console.error("Unexpected error: ", error);
            }
        }
        return null
    }
}

export const postBoardRequest = async(requestBody:PostBoardRequestDto, accessToken:string) =>{
    try {
        const response = await axios.post<PostBoardResponseDto>(POST_BOARD_URL(), requestBody, authorization(accessToken));
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            const axiosError : AxiosError<ResponseDto> = error;
            if(axiosError.response){
                return axiosError.response.data;
            }
        }else{
            console.error("Unexpected error:", error);
        }
        return null;
    }
}
export const deleteBoardRequest = async(boardNumber: number|string , accessToken: string) =>{
    try {
        const response = await axios.delete<DeleteBoardResponseDto>(DELETE_BOARD_URL(boardNumber), authorization(accessToken));
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            const axiosError : AxiosError<ResponseDto> = error;
            if(axiosError.response){
                return axiosError.response.data;
            }
        }else{
            console.error("Unexpected error:", error);
        }
        return null;
    }
}

export const increaseViewCountRequest = async(boardNumber:number|string) =>{
    try {
        const response  = await axios.get<IncreaseViewCountResponseDto>(INCREASE_VIEW_URL(boardNumber)) ;
        return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            const axiosError :AxiosError<ResponseDto> = error;
            if(axiosError.response){
                return axiosError.response.data;
            }
        }else{
            console.error('Unexpected error:', error);
        }
        return null;
    }
}

export const getFavoriteListRequest = async (boardNumber: number|string)=>{
    try {
        const response = await axios.get<GetFavoriteListResponseDto>(GET_FAVORITE_LIST_URL(boardNumber));
        
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

export const putFavoriteRequest = async (boardNumber: number | string, accessToken: string)=>{
    try {
        const response = await axios.put<PutFavoriteResponseDto>(PUT_FAVORITE_URL(boardNumber), {}, authorization(accessToken));
        console.log("putFavoriteRequest's response : " , response);
        
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

export const getCommentListRequest = async (boardNumber: number|string)=>{
    try {
        const response = await axios.get<GetCommentListResponseDto>(GET_COMMENT_LIST_URL(boardNumber));
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

export const postCommentRequest = async (boardNumber: number|string, requestBody:PostCommentRequestDto, accessToken:string)=>{
    try {
        const response = await axios.post<PostCommentResponseDto>(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken));
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
        const response = await axios.get<GetSignInUserResponseDto>(GET_SIGN_IN_USER_URL(), authorization(accessToken));
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


const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () =>`${FILE_DOMAIN}/upload`;
const multipartFormData = {headers:{'Content-Type':'multipart/form-data'}};

export const fileUploadRequest = async (data:FormData) =>{
    try {
        const response = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData);
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
