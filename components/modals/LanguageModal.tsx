import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { useLanguage } from '@/hooks/useLanguage';
const { t } = useLanguage();

interface LanguageModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
  currentLanguage: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  isVisible,
  onClose,
  onSelectLanguage,
  currentLanguage,
}) => {
  const [modalVisible, setModalVisible] = useState(isVisible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [isVisible, fadeAnim, scaleAnim]);

  if (!modalVisible) return null;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ja', name: '日本語' },
  ];

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View 
        style={[
          styles.modalContainer, 
          { 
            opacity: fadeAnim,
            backgroundColor: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
            }),
          }
        ]}
      >
        <TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <Text style={styles.title}>{t('language')}</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  currentLanguage === lang.code && styles.selectedLanguage,
                ]}
                onPress={() => onSelectLanguage(lang.code)}
              >
                <Text
                  style={[
                    styles.languageText,
                    currentLanguage === lang.code && styles.selectedLanguageText,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  selectedLanguage: {
    backgroundColor: Colors.primary,
  },
  languageText: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectedLanguageText: {
    color: Colors.white,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.grey40,
    borderRadius: 10,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default LanguageModal;
