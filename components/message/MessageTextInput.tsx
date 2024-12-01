import { View, TouchableOpacity, Image, Colors, Button, TextField } from 'react-native-ui-lib'
import * as ImagePicker from "expo-image-picker";
import { Href, router } from 'expo-router';

import MicIcon from '@/assets/icons/mic.svg';
import CameraIcon from '@/assets/icons/camera.svg';
import { useLanguage } from '@/hooks/useLanguage';


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
    placeholder, message, setMessage, handleSend, isAI, isCamera, selectedImages, setSelectedImages, onVoicePress
}: MessageTextInputProps) => {
    const { t } = useLanguage();


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
        router.push("/(app)/chat/voice-chat" as Href<string>);
    };

    return (
        <View
            row
            padding-10
            paddingH-16
            backgroundColor={Colors.white}
        >
            {isCamera && (
                <View width={40} height={40} centerV marginT-5>
                    <TouchableOpacity onPress={handleSelectImages}>
                        <Image source={CameraIcon} />
                    </TouchableOpacity>
                </View>
            )}

            <View
                row
                flex
                br100
                centerV
                marginR-10
                borderWidth={1}
                padding-5
                paddingL-10
                style={{ borderColor: Colors.border }}
            >
                <TextField
                    placeholder={placeholder}
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSend}
                    containerStyle={{ width: isAI ? '85%' : '95%' }}
                    enableErrors={false}
                    fieldStyle={{ marginTop: 0 }}
                    placeholderTextColor={Colors.text_secondary}
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
                label={t('chat.send').toString()}
                backgroundColor={Colors.primary}
                onPress={handleSend}
            />
        </View>
    );
}

export default MessageTextInput
