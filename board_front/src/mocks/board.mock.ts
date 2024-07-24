import { url } from "inspector";
import { Board } from "types/interface";

const boardMock:Board = {
    id: 1,
    title: '제목제몫메목제목',
    content: '내용ㅌㅊ;ㅏㅣㅍ커ㅣ내용ㅌㅊ;ㅏㅣㅍ커ㅣ내용ㅌㅊ;ㅏㅣㅍ커ㅣ',
    boardImageList: ['data:image/jpeg;base64,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','https://flexible.img.hani.co.kr/flexible/normal/460/301/imgdb/resize/2019/0723/00500665_20190723.JPG'],
    writtenDateTime: "2022. 05. 12",
    writerEmail: "email@email.com",
    writerNickname: "닉네임 별명 입니받",
    writerProflieImage: ''
}

export default boardMock;