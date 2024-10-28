import { useEffect } from "react";
import { View, Text } from "react-native-ui-lib";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAccessToken } from "@/utils/services/zalo/zaloAuthService";
import { useDispatch } from "react-redux";
import { setZaloTokens, setZaloError } from "@/redux/features/zalo/zaloSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OAuthCallback() {
  const { code, state } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!code || !state) {
        dispatch(setZaloError("Thiếu thông tin xác thực"));
        router.replace("/(auth)");
        return;
      }

      try {
        const [storedCodeVerifier, storedState] = await Promise.all([
          AsyncStorage.getItem("zalo_code_verifier"),
          AsyncStorage.getItem("zalo_state")
        ]);

        if (!storedCodeVerifier || !storedState) {
          throw new Error("Phiên đăng nhập không hợp lệ");
        }

        if (state !== storedState) {
          throw new Error("Thông tin xác thực không khớp");
        }

        const accessTokenResponse = await getAccessToken(
          code as string,
          storedCodeVerifier
        );

        if (accessTokenResponse) {
          dispatch(setZaloTokens(accessTokenResponse));
          
          // Xóa thông tin xác thực tạm thời
          await Promise.all([
            AsyncStorage.removeItem("zalo_code_verifier"),
            AsyncStorage.removeItem("zalo_state")
          ]);
          
          router.replace("/(tabs)");
        } else {
          throw new Error("Không thể lấy access token");
        }
      } catch (error: any) {
        console.error("Error handling OAuth callback:", error);
        dispatch(setZaloError(error.message));
        router.replace("/(auth)");
      }
    };

    handleOAuthCallback();
  }, [code, state, router, dispatch]);

  return (
    <View flex center>
      <Text>Đang xử lý đăng nhập...</Text>
    </View>
  );
}
