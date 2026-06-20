export interface IProfileUpdate {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageFile?: {
        uri: string;
        name: string;
        type: string;
    };
}