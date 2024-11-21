import React, { forwardRef } from "react";
import { Button, View } from "react-native-ui-lib";
import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export interface AppButtonProps {
  type: "text" | "primary" | "secondary" | "outline";
  title?: string;
  onPress?: () => void;
  buttonStyle?: any;
  titleStyle?: any;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const AppButton = forwardRef<unknown, AppButtonProps>((props, ref) => {
  const getButtonStyles = () => {
    if (props.disabled) {
      return {
        backgroundColor: Colors.grey50,
        labelStyle: {
          color: Colors.grey30,
          fontSize: 16,
          fontWeight: "bold",
          ...props.titleStyle,
        },
      };
    }
    switch (props.type) {
      case "primary":
        return {
          backgroundColor: Colors.primary,
          labelStyle: {
            color: Colors.background,
            fontSize: 16,
            fontWeight: "bold",
            ...props.titleStyle,
          },
        };
      case "secondary":
        return {
          backgroundColor: Colors.secondary,
          labelStyle: {
            color: Colors.primary,
            fontSize: 16,
            fontWeight: "bold",
            ...props.titleStyle,
          },
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          outlineColor: Colors.primary,
          outlineWidth: 1,
          labelStyle: {
            color: Colors.primary,
            fontSize: 16,
            fontWeight: "bold",
            ...props.titleStyle,
          },
        };
      case "text":
        return {
          backgroundColor: "transparent",
          labelStyle: {
            color: Colors.primary,
            fontSize: 16,
            fontWeight: "bold",
            ...props.titleStyle,
          },
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <View row centerV>
      <Button
        label={props.title}
        onPress={props.onPress}
        disabled={props.disabled}
        loading={props.loading}
        {...buttonStyles}
        style={[styles.button, buttonStyles, props.buttonStyle]}
      >
        {props.children}
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 10,
  },
});

export default AppButton;
