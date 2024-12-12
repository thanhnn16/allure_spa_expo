import { KeyboardTypeOptions, TextInput as RNTextInput } from 'react-native';
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
    style?: any;
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
                              style,
                          }: TextInputProps) => {
    return (
        <View width="100%">
            {title && <Text text70BO marginB-8 color={Colors.text}>{title}</Text>}
            <RNTextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                onBlur={onBlur}
                style={[
                    {
                        height: 48,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: Colors.gray,
                    },
                    style
                ]}
            />
        </View>
    );
}
