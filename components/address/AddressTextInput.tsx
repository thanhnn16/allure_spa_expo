import { TextField, Typography, View } from "react-native-ui-lib";
import { Colors } from "react-native-ui-lib";

interface AddressTextInputProps {
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  editable?: boolean;
  maxLength?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: boolean;
  errorMessage?: string;
}

const AddressTextInput = ({
  value,
  placeholder,
  maxLength,
  onChangeText,
  keyboardType,
  error = false,
  errorMessage = "",
  editable = true,
}: AddressTextInputProps) => (
  <View marginB-10>
    <TextField
      value={value}
      placeholder={placeholder}
      floatingPlaceholder
      onChangeText={onChangeText}
      enableErrors={!!error}
      validateOnChange
      floatingPlaceholderStyle={Typography.h3}
      labelStyle={Typography.h3}
      h3
      validationMessage={error ? errorMessage : undefined}
      error={!!error}
      maxLength={maxLength}
      keyboardType={keyboardType}
      editable={editable}
      style={[
        error && {
          borderColor: Colors.red30,
          borderWidth: 1,
        },
      ]}
    />
  </View>
);

export default AddressTextInput;
