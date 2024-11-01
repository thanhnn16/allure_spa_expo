import { View, TouchableOpacity, Image, Colors, Button } from 'react-native-ui-lib'
import { StyleSheet, TextInput } from 'react-native'
import { BlurView } from 'expo-blur'
import * as ImagePicker from "expo-image-picker";
import { Href, router } from 'expo-router';

import MicIcon from '@/assets/icons/mic.svg';
import CameraIcon from '@/assets/icons/camera.svg';
import i18n from '@/languages/i18n';


interface MessageTextInputProps {
    placeholder: string;
    message: string;
    setMessage: (text: string) => void;
    handleSend: () => void;
    isAI: boolean;
    isCamera: boolean;
    selectedImages: string[];
    setSelectedImages: (images: string[]) => void;
    onVoicePress?: () => void;
}

const MessageTextInput = ({
    placeholder, message, setMessage, handleSend, isAI, isCamera, selectedImages, setSelectedImages
}: MessageTextInputProps) => {

    const handleSelectImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages(result.assets.map(asset => asset.uri));
        }
    };

    const handleAI = () => {
        router.push('/(app)/(chat)/AIVoiceScreen' as Href<string>)
    };

    return (
        <BlurView
            intensity={200}
            tint='light'
            style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 16,
            }}
        >
            {isCamera && (
                <View width={40} height={40} centerV marginT-5>
                    <TouchableOpacity onPress={handleSelectImages}>
                        <Image source={CameraIcon} />
                    </TouchableOpacity>
                </View>
            )}

            <View row flex style={styles.inputContainer}>
                <TextInput
                    placeholder={placeholder}
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSend}
                    style={isAI ? styles.inputAI : styles.input}
                />
                {isAI && (
                    <View flex right centerV marginR-5>
                        <TouchableOpacity onPress={handleAI}>
                            <Image source={MicIcon} />
                        </TouchableOpacity>
                    </View>
                )}

            </View>

            <Button
                size={Button.sizes.small}
                label={i18n.t('chat.send').toString()}
                backgroundColor={Colors.primary}
                onPress={handleSend}
            />
        </BlurView>
    );
}

export default MessageTextInput

const styles = StyleSheet.create({
    input: {
        width: '95%',
    },
    inputAI: {
        width: '85%',
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 5,
        paddingStart: 10,
        marginRight: 10,
    },

})
