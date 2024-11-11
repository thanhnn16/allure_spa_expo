import { useState } from 'react'
import { Dimensions, Pressable, StyleSheet } from 'react-native'
import { View, Text, ExpandableSection, Image, TouchableOpacity } from 'react-native-ui-lib'

import ArrowDownIcon from '@/assets/icons/arrow_down_sm.svg'
import ArrowUpIcon from '@/assets/icons/arrow_up_sm.svg'

interface ProductDescriptionColapableProps {
    headerText: string;
    childrenText: string;
    keyText?: string;
};

const ProductDescriptionColapable = ({ headerText, childrenText, keyText }: ProductDescriptionColapableProps) => {
    const [expanded, setExpanded] = useState(false);

    const handleArrowIcon = () => {
        return expanded ? ArrowUpIcon : ArrowDownIcon
    };

    const windowWidth = Dimensions.get("window").width;

    return (
        <View marginV-5>
            <ExpandableSection
                expanded={expanded}
                minHeight={55}
                onPress={() => setExpanded(!expanded)}
            >
                {childrenText.length > 80 ?
                    <TouchableOpacity
                        onPress={() => setExpanded(!expanded)}
                    >
                        <View row centerV gap-5>
                            <Text h3_bold>{headerText}</Text>
                            <Image source={handleArrowIcon()} />
                        </View>
                    </TouchableOpacity>
                    :
                    <View row centerV gap-5>
                        <Text h3_bold>{headerText}</Text>
                    </View>
                }
                <View row>
                    <TouchableOpacity
                        onPress={() => setExpanded(!expanded)}
                    >
                        <View row>
                            <Text h3>• </Text>
                            <Text h3>
                                {keyText ? <Text h3_bold>{keyText}, </Text> : null}
                                {childrenText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ExpandableSection>
        </View>
    )
}

export default ProductDescriptionColapable