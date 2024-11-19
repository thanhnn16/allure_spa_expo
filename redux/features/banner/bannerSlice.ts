import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchBanners } from './bannerThunk';
import { Banner } from '@/types/banner.type';

interface BannerState {
    banners: Banner[];
    loading: boolean;
    error: string | null;
}

const initialState: BannerState = {
    banners: [],
    loading: false,
    error: null,
};

const bannerSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
                state.banners = action.payload;
                state.loading = false;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default bannerSlice.reducer;
