import { Colors, TouchableOpacity, View } from 'react-native-ui-lib'
import { Ionicons } from '@expo/vector-icons'

interface AddressIconButtonProps {
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
}

const AddressIconButton = ({ onPress, iconName, color }: AddressIconButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View
                center
                width={44} height={44}
                backgroundColor={Colors.primary_light}
                style={{
                    borderRadius: 24,
                }}
            >
                <Ionicons name={iconName} size={24} color={color} />
            </View>
        </TouchableOpacity>
    )
}

export default AddressIconButton