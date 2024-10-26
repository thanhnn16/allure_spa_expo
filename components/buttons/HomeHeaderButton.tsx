import React from 'react'
import { SvgProps } from 'react-native-svg'
import { TouchableOpacity, Image } from 'react-native-ui-lib'

type ButtonMessageIconProps = {
    onPress: () => void,
    source: React.FC<SvgProps>
}
const ButtonMessageIcon = ({ onPress, source }: ButtonMessageIconProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <Image source={source} />
    </TouchableOpacity>
  )
}

export default ButtonMessageIcon
