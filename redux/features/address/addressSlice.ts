import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from './addressThunk';
import { AddressDistrictResponse, AddressProvince, AddressProvinceResponse, AddressState, AddressWardResponse } from '@/types/address.type';
import { getAddressDistrictThunk, getAddressProvinceThunk, getAddressWardThunk } from './getAddressThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../../../types/address.type';

// Initial state
const initialState: AddressState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};


// Slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress: (state: any, action: any) => {
      state.selectedAddress = action.payload;
      if (action.payload) {
        AsyncStorage.setItem('selectedAddress', JSON.stringify(action.payload));
      }
    },
    clearAddressError: (state: any) => {
      state.error = null;
    },
    updateAddress: (state: any, action: any) => {
      const index = state.addresses.findIndex((addr: any) => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.addresses = action.payload;

        if (!state.selectedAddress) {
          const defaultAddress = action.payload.find((addr: Address) => addr.is_default) || action.payload[0];
          if (defaultAddress) {
            state.selectedAddress = defaultAddress;
          }
        }
      })
      .addCase(fetchAddresses.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add address
      .addCase(addAddress.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update address
      .addCase(updateAddress.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state: any, action: any) => {
        state.loading = false;
        const index = state.addresses.findIndex((addr: any) => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete address
      .addCase(deleteAddress.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.addresses = state.addresses.filter((addr: any) => addr.id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAddressProvinceThunk.pending, (state: AddressProvinceResponse) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressProvinceThunk.fulfilled, (state: AddressProvinceResponse, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAddressProvinceThunk.rejected, (state: AddressDistrictResponse, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAddressDistrictThunk.pending, (state: AddressDistrictResponse) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressDistrictThunk.fulfilled, (state: AddressDistrictResponse, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAddressDistrictThunk.rejected, (state: AddressWardResponse, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAddressWardThunk.pending, (state: AddressWardResponse) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressWardThunk.fulfilled, (state: AddressWardResponse, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAddressWardThunk.rejected, (state: AddressWardResponse, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAddress, clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;