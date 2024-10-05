import * as Location from 'expo-location';
import VietNamProvinces from './VNProvinces';
import { useEffect } from 'react';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
    }

    let userLocation = await Location.getCurrentPositionAsync({});
    return findNearestProvince(userLocation.coords.latitude, userLocation.coords.longitude);
};

const findNearestProvince = (lat: Double, lon: Double) => {
    return VietNamProvinces.reduce((nearest: any, province: any) => {
        const distance = calculateDistance(lat, lon, province.lat, province.lon);
        return distance < nearest.distance ? { ...province, distance } : nearest;
    }, { distance: Infinity });
};

const calculateDistance = (lat1: Double, lon1: Double, lat2: Double, lon2: Double) => {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Khoảng cách tính bằng km
    return d;
};

const deg2rad = (deg: Double) => {
    return deg * (Math.PI / 180);
};

export default getLocation;
