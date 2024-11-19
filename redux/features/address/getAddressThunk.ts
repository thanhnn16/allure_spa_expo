import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductResponseParams } from "@/types/product.type";
import axios from "axios";

interface ProvinceRequest {
  query?: number;
}

interface DistrictRequest {
  query: number;
}

interface WardRequest {
  query: number;
}

export const getAddressProvinceThunk = createAsyncThunk(
  'address/getProvince',
  async (_ : any, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await axios.get(`https://open.oapi.vn/location/provinces/?page=0&size=63`);
      return res.data;
      
    } catch (error: any) {
      console.error('Get product error:', error);
      return rejectWithValue(error || "Get product failed");
    }
  }
);

export const getAddressDistrictThunk = createAsyncThunk(
  'address/getDistrict',
  async ({query} : DistrictRequest, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await axios.get(`https://open.oapi.vn/location/districts/${query}?page=0&size=63`);
      return res.data;
      
    } catch (error: any) {
      console.error('Get product error:', error);
      return rejectWithValue(error || "Get product failed");
    }
  }
);

export const getAddressWardThunk = createAsyncThunk(
  'address/getWard',
  async ({query} : WardRequest, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await axios.get(`https://open.oapi.vn/location/wards/${query}?page=0&size=63`);
      return res.data;
      
    } catch (error: any) {
      console.error('Get product error:', error);
      return rejectWithValue(error || "Get product failed");
    }
  }
);