import {IImageFile} from "@/models/common/IImageFile";

export default interface IRegisterModel {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    imageFile?: IImageFile;
}