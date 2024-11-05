import React from "react";
import { StyleSheet, ActivityIndicator, Modal } from "react-native";
import { View, Text, Colors } from "react-native-ui-lib";

interface LoadingOverlayProps {
  visible?: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible = false,
  message = "Đang xử lý...",
}) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textColor,
    textAlign: "center",
  },
});

export default LoadingOverlay;
