import { KeyboardTypeOptions } from 'react-native';
import { View, Text, TextField } from 'react-native-ui-lib';
import Colors from '@/constants/Colors';

export type TextInputProps = {
    title?: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    secureTextEntry?: boolean;
    label?: string; // Thêm prop label
    onBlur?: () => void; // Add onBlur prop
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
                              onBlur, // Add onBlur to destructuring
                          }: TextInputProps) => {
    return (
        <View width="100%">
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
                    marginBottom: 5,
                }}
                style={{
                    height: 48,
                    color: Colors.text,
                }}
                enableErrors={false}
                onBlur={onBlur} // Add onBlur to TextField
            />
        </View>
    );
}
