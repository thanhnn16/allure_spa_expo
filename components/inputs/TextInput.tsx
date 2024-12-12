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
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    onBlur?: () => void;
}

export const TextInput = ({
    title,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    maxLength,
    autoCapitalize,
    onBlur,
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
                autoCapitalize={autoCapitalize}
                placeholder={placeholder}
                placeholderTextColor={Colors.gray}
                onBlur={onBlur}
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
            />
        </View>
    );
}
