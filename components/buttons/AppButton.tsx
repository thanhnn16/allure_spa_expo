import React, { forwardRef } from "react";
import { Button, View } from "react-native-ui-lib";
import Colors from "@/constants/Colors";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export interface AppButtonProps {
  title?: string;
  onPress?: () => void;
  type?: "primary" | "outline" | "text";
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  buttonStyle?: ViewStyle;
  titleStyle?: TextStyle;
  [key: string]: any;
}

const AppButton = forwardRef<unknown, AppButtonProps>((props, ref) => {
  const getButtonStyles = () => {
    if (props.disabled) {
      return {
        backgroundColor: Colors.grey50,
        labelStyle: {
          color: Colors.grey30,
          fontSize: 14,
          fontFamily: "SFProText-Bold",
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
            fontSize: 14,
            fontFamily: "SFProText-Bold",
            ...props.titleStyle,
          },
        };
      case "primary":
        return {
          backgroundColor: Colors.primary,
          labelStyle: {
            color: Colors.background,
            fontSize: 14,
            fontFamily: "SFProText-Bold",
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
            fontSize: 14,
            fontFamily: "SFProText-Bold",
            ...props.titleStyle,
          },
        };
      case "text":
        return {
          backgroundColor: "transparent",
          labelStyle: {
            color: Colors.primary,
            fontSize: 14,
            fontFamily: "SFProText-Bold",
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
    width: "100%",
  },
});

export default AppButton;
