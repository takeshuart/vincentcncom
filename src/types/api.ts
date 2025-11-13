
//与后端一样的类型定义
export interface SuccessResponse<T> {
    data: T;
    message?: string;
    meta?: any; 
}


export interface ErrorResponse {
    errorCode: string;
    message: string;
    errors?: Array<{ field: string; reason: string }>;
}