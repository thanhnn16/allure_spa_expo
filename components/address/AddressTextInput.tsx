import { TextField, Typography, View } from "react-native-ui-lib";

interface AddressTextInputProps {
    value: string;
    placeholder: string;
    onChangeText: (value: string) => void;
    editable?: boolean;
    maxLength?: number;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const AddressTextInput = ({ value, placeholder, maxLength, onChangeText, keyboardType } : AddressTextInputProps) => (
    <View marginB-10>
        <TextField
            value={value}
            placeholder={placeholder}
            floatingPlaceholder
            onChangeText={onChangeText}
            enableErrors
            validateOnChange
            floatingPlaceholderStyle={Typography.h3}
            labelStyle={Typography.h3}
            h3
            // validate={['required', (value) => value.length == 10]}
            // validationMessage={['Field is required', 'Password is too short']}
            maxLength={maxLength}
            keyboardType={keyboardType}
        />
    </View>
);

export default AddressTextInput;