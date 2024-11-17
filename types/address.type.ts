export interface UserProfile {
    full_name: string;
    phone_number: string;
}

export interface Address {
    id?: string;
    user_id: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    address_type: 'home' | 'work' | 'others';
    is_default: boolean;
    is_temporary: boolean;
    note?: string;
}

export interface AddressState {
    addresses: Address[];
    selectedAddress: Address | null;
    loading: boolean;
    error: string | null;
}

export interface AddressProvince {
    id: string;
    name: string;
    type: number;
    typeText: string;
    slug: string;
}

export interface AddressDistrict {
    id: string;
    name: string;
    provinceId: string;
    type: number;
    typeText: string;
}

export interface AddressWard {
    id: string;
    name: string;
    districtId: string;
    type: number;
    typeText: string;
}

export interface AddressProvinceResponse {
    loading: boolean;
    total: number;
    data: AddressProvince[];
    error: string | null;
}

export interface AddressDistrictResponse {
    loading: boolean;
    total: number;
    data: AddressDistrict[];
    error: string | null;
}

export interface AddressWardResponse {
    loading: boolean;
    total: number;
    data: AddressWard[];
    error: string | null;
}