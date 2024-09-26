export interface LoginRequest {
    phone_number: string,
    password: string
}

export interface LoginResponse {
    message: string,
    status_code: number
    data: LoginResponseData,
    token: string,
    errors: string[] | null
}

export interface RegisterRequest {
    phone_number: string,
    password: string,
    password_confirmation: string
}

export interface RegisterResponse {
    message: string,
    status_code: number
    data: RegisterResponseData,
    errors: string[] | null
}

export interface UserLoginResponseParams extends Timestamps {
    id: string,
    phone_number: string,
    email: string | null,
    role: string,
    full_name: null,
    gender: string,
    address: null,
    date_of_birth: null,
    image_id: null,
    point: number,
    note: null,
    purchase_count: number,
}

export interface UserRegisterResponseParams extends Timestamps {
    id: string,
    phone_number: string,
}

export interface LoginResponseData {
    user: UserLoginResponseParams,
    token: string
}

export interface RegisterResponseData {
    user: UserRegisterResponseParams,
    token: string
}

export interface Timestamps {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}