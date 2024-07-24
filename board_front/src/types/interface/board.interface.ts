export default interface Board{
    id:number;
    title:string;
    content:string;
    boardImageList:string[]|null;
    writtenDateTime:string;
    writerEmail:string;
    writerNickname:string;
    writerProflieImage:string|null;
}