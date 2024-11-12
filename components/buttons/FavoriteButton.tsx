import React, { useState, useEffect } from "react";
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FavoriteButtonProps {
  itemId: number;
  type: "product" | "service";
  initialFavorited?: boolean;
  size?: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  type,
  initialFavorited = false,
  size = 24,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const scaleValue = new Animated.Value(1);
  const dispatch = useDispatch<AppDispatch>();

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await dispatch(
        toggleFavoriteThunk({ type, itemId })
      ).unwrap();
      if (response === "added" || response === "removed") {
        setIsFavorited(response === "added");
        if (response === "added") {
          animateHeart();
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleToggleFavorite}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {isFavorited ? (
          <MaterialCommunityIcons name="heart" size={size} color="#FF4B4B" />
        ) : (
          <MaterialCommunityIcons
            name="heart-outline"
            size={size}
            color="#8C8585"
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default FavoriteButton;
