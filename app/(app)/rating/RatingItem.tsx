import { useState } from "react";
import {
  View,
  Text,
  Image,
  Carousel,
  TouchableOpacity,
} from "react-native-ui-lib";

import { Href, Link, router } from "expo-router";

import StarIcon from "@/assets/icons/star.svg";
import { Rating } from "@/types/rating.type";

const RatingItem = ({ item }: { item: Rating }) => {
  const handleImagePress = () => {
    if (!item?.id) return;
    router.push(`/pager_view?id=${item.id}`);
  };

  if (!item) {
    return null;
  }

  return (
    <View
      margin-10
      padding-15
      backgroundColor="#F9FAFB"
      style={{ borderRadius: 13 }}
    >
      <View row centerV>
        <View row gap-10 centerV>
          <Image
            width={40}
            height={40}
            borderRadius={20}
            source={{ uri: item.user?.avatar_url || "default_avatar_url" }}
          />
          <Text h3_bold>{item.user?.full_name || "Anonymous"}</Text>
        </View>
        <View row gap-5 centerV flex right>
          <Image source={StarIcon} width={20} height={20} />
          <Text h3_bold center>
            {item.stars || 0}
          </Text>
        </View>
      </View>

      <View marginV-10>
        <Text h3>{item.comment || ""}</Text>
      </View>

      {Array.isArray(item.media_urls) && item.media_urls.length > 0 && (
        <View marginT-10 row gap-10>
          {item.media_urls.slice(0, 3).map((image, index) => (
            <TouchableOpacity key={index} onPress={handleImagePress}>
              <Image
                width={40}
                height={40}
                source={{ uri: image }}
                defaultSource={require("@/assets/images/logo/logo.png")}
              />
            </TouchableOpacity>
          ))}
          {item.media_urls.length > 3 && (
            <TouchableOpacity
              key={item.media_urls.length - 1}
              onPress={handleImagePress}
            >
              <Image
                width={40}
                height={40}
                source={{ uri: item.media_urls[3] }}
                defaultSource={require("@/assets/images/logo/logo.png")}
              />
              <View
                style={{
                  position: "absolute",
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text h2_bold secondary>
                  {"+" + (item.media_urls.length - 3)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default RatingItem;
