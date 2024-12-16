import { useEffect, useState } from "react";
import { View, Text } from "react-native-ui-lib";
import { useLocalSearchParams } from "expo-router";
import { getAccessToken } from "@/utils/services/zalo/zaloAuthService";
import { ActivityIndicator } from "react-native";
import { useZaloLogin } from "@/hooks/useZaloLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ZALO_CONSTANTS } from "@/utils/constants/zalo";

export default function OAuthCallback() {
  const params = useLocalSearchParams();
  const { handleZaloOAuthSuccess, handleZaloOAuthError, isLoading } = useZaloLogin();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log("=== DEBUG ZALO OAUTH CALLBACK ===");
      console.log("Received params:", params);
      
      const code = params.code as string;
      const state = params.state as string;

      if (!code || !state) {
        console.error("Missing code or state:", { code, state });
        handleZaloOAuthError("Thiếu thông tin xác thực");
        return;
      }

      try {
        console.log("Retrieving stored values from AsyncStorage...");
        
        const [storedCodeVerifier, storedState] = await Promise.all([
          AsyncStorage.getItem(ZALO_CONSTANTS.STORAGE_KEYS.CODE_VERIFIER),
          AsyncStorage.getItem(ZALO_CONSTANTS.STORAGE_KEYS.STATE)
        ]);

        console.log("Stored values:", {
          storedCodeVerifier,
          storedState,
          receivedState: state
        });

        if (!storedCodeVerifier || !storedState) {
          console.error("Missing stored values");
          throw new Error("Phiên đăng nhập không hợp lệ");
        }

        if (state !== storedState) {
          console.error("State mismatch:", {
            receivedState: state,
            storedState
          });
          throw new Error("Thông tin xác thực không khớp");
        }

        console.log("Getting access token...");
        const tokens = await getAccessToken(code, storedCodeVerifier);
        console.log("Access token response:", tokens);

        if (tokens) {
          console.log("Handling OAuth success...");
          await handleZaloOAuthSuccess(tokens);
        } else {
          throw new Error("Không thể lấy access token");
        }
      } catch (error: any) {
        console.error("Error handling OAuth callback:", error);
        console.error("Error stack:", error.stack);
        setError(error.message);
        handleZaloOAuthError(error.message);
      }
    };

    if (params.code && params.state) {
      console.log("Starting OAuth callback handler...");
      handleOAuthCallback();
    } else {
      console.log("No code/state params found:", params);
    }
  }, [params.code, params.state]);

  if (isLoading) {
    return (
      <View flex center>
        <ActivityIndicator />
        <Text>Đang xử lý đăng nhập...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View flex center>
        <Text red>Lỗi: {error}</Text>
      </View>
    );
  }

  return null;
}
