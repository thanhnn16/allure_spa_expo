import { Colors, TextField, View } from 'react-native-ui-lib'
import AntDesign from '@expo/vector-icons/AntDesign';
import { AppStyles } from '@/constants/AppStyles';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type AppSearchProps = {
    value?: string;
    onChangeText?: (text: string) => void;

}

const AppSearch = ({ value, onChangeText }: AppSearchProps) => {
    return (
        <View row width={345} height={40} paddingH-5 center marginV-15 style={[AppStyles.shadowItem, { borderRadius: 8 }]}>

            <AntDesign name="search1" size={24} color="rgba(113, 118, 88, 0.5)" />
            <TextField
                value={value}
                onChangeText={onChangeText}
                placeholder='Tìm kiếm mỹ phẩm, liệu trình ...'
                placeholderTextColor={Colors.gray}
                containerStyle = {{
                    flex: 1
                }}
            />
            <FontAwesome6 name="microphone" size={24} color="rgba(113, 118, 88, 0.5)" />
        </View>
    )
}

export default AppSearch
