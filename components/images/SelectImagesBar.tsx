import { StyleSheet, Text,  } from 'react-native'
import {View, TouchableOpacity, Image} from 'react-native-ui-lib'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

import CloseIcon from '@/assets/icons/close_circle.svg';

interface SelectImagesBarProps {
  selectedImages: string[];
  setSelectedImages: (images: string[]) => void;
  isRating?: boolean;
}

const SelectImagesBar: React.FC<SelectImagesBarProps> = ({ selectedImages, setSelectedImages, isRating = true }) => {
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

  return (
    <View row centerV marginT-10>
      {isRating ? (
        <TouchableOpacity
          onPress={handleSelectImages}
          style={styles.addImage}>
          <Text>+</Text>
        </TouchableOpacity>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
        {selectedImages.map((uri, index) => (
          <View style={{ position: 'relative', marginLeft: 10 }}>
            <Image
              source={{ uri: uri }}
              style={{ width: 55, height: 55 }}
            />
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setSelectedImages(selectedImages.filter((_, i) => i !== index));
              }}
            >
              <Image
                source={CloseIcon}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}

export default SelectImagesBar

const styles = StyleSheet.create({
  addImage: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1000,
  }
})