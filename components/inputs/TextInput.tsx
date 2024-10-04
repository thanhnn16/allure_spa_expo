import { KeyboardTypeOptions } from 'react-native';
import { View, Text, TextField } from 'react-native-ui-lib';
import Colors from '../../constants/Colors'; // Thêm import này

export type TextInputProps = {
  title?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;
  label?: string; // Thêm prop label
}

export const TextInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  maxLength,
  label, // Thêm label vào props
}: TextInputProps) => {
  return (
    <View width="100%" paddingH-24>
      {title && <Text text70BO marginB-8 color={Colors.text}>{title}</Text>}
      <TextField
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        floatingPlaceholder={false} // Tắt floatingPlaceholder
        label={label} // Sử dụng label
        labelStyle={{ color: Colors.text, marginBottom: 4, fontWeight: 'bold' }} // Tùy chỉnh kiểu label
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        containerStyle={{
          width: '100%',
          borderWidth: 1,
          borderColor: Colors.gray,
          borderRadius: 8,
          paddingHorizontal: 16,
          height: 48,
        }}
        style={{ 
          height: 48,
          color: Colors.text,
        }}
        enableErrors={false}
      />
    </View>
  );
}

