import AppBar from '@/components/app_bar/app_bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { Image, View, Text } from 'react-native-ui-lib';
import { TouchableOpacity, StyleSheet, Dimensions, Button, Pressable } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import MicIcon from '@/assets/icons/mic.svg';
import KeyboardIcon from '@/assets/icons/keyboard.svg';
import StopIcon from '@/assets/icons/stop_fill.svg';
import { router } from 'expo-router';

const AIVoiceScreen = () => {

    const [recording, setRecording] = useState<Audio.Recording>();
    const [recordingUri, setRecordingUri] = useState<string | undefined>();
    const [waveCount, setWaveCount] = useState<number[]>([]);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    async function startRecording() {
        try {
            if (!permissionResponse || permissionResponse.status !== "granted") {
                console.log("Requesting permission..");
                await requestPermission();
            }

            setRecordingUri(undefined);
            setWaveCount(() => []);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log("Starting recording..");
            const { recording: audioRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
                (status) => {
                    let loudness = status.metering !== undefined && !isNaN(status.metering + 160)
                        ? Math.max(status.metering + 160, 10)
                        : 10;
                    setWaveCount((waves) => [loudness, ...waves]);
                }
            );

            setRecording(() => audioRecording);

            console.log("Recording Started");
        } catch (err) {
            console.log("Failed to start recording");
        }
    }

    async function stopRecording() {
        console.log("Stopping recording..");

        setRecording(() => undefined);

        if (recording) {
            await recording.stopAndUnloadAsync();
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
        });
        const uri: string | undefined = recording ? recording.getURI() || undefined : undefined;

        console.log("Recording Saved", uri);

        setRecordingUri(uri);
    }

    return (
        <View style={styles.container}>
            <View style={styles.voiceContainer}>
                <View style={styles.circle} />
                {recording ? (
                    <Text style={styles.startText}>nói đã chưa?</Text>
                ) : (
                    <Text style={styles.startText}>Nhấn núi r nói i</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { router.back() }}
                >
                    <Image source={KeyboardIcon} />
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        width: Dimensions.get("screen").width / 2,
                        paddingHorizontal: 20,
                        backgroundColor: "ghostwhite",
                        borderWidth: 2,
                        borderColor: "gainsboro",
                        height: 50,
                        overflow: "hidden",
                        borderRadius: 20,
                    }}
                >
                    {waveCount.map((waveHeight, index) => (
                        <Animated.View
                            layout={LinearTransition}
                            key={index.toString()}
                            style={{
                                height: waveHeight,
                                width: 4,
                                backgroundColor: "black",
                                borderRadius: 10,
                            }}
                        ></Animated.View>
                    ))}
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        recording ? stopRecording() : startRecording();
                    }}
                >
                    <Image source={StopIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#f0f0f0',
        marginBottom: 20,
    },
    startText: {
        fontSize: 16,
        marginBottom: 20,
    },
    voiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
    },
    buttonText: {
        fontSize: 24,
    },
});

export default AIVoiceScreen;