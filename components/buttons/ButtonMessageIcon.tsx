import { TouchableOpacity } from 'react-native-ui-lib'
import AntDesign from '@expo/vector-icons/AntDesign';

type ButtonMessageIconProps = {
    onPress: () => void
}
const ButtonMessageIcon = ({ onPress }: ButtonMessageIconProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <AntDesign name="message1" size={24} color="rgba(113, 118, 88, 0.5)" />
    </TouchableOpacity>
  )
}

export default ButtonMessageIcon
