import React from "react";
import {
  View,
  Text,
  Image,
  AnimatedImage,
  Card,
  Dividers,
  Colors,
  TouchableOpacity,
} from "react-native-ui-lib";
import i18n from "@/languages/i18n";

import HeartIcon from "@/assets/icons/heart.svg";
import StarIcon from "@/assets/icons/star.svg";

interface RewardItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

const RewardItemProps = ({ item }: { item: RewardItemProps }) => {
  return (
    <Card borderRadius={10} elevation={23} >
      <View width={"100%"}>
        <AnimatedImage
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          height={200}
          source={{ uri: item.image }}
        />
        <View padding-8>
          <View paddingV-5>
            <Text h2_bold>{item.name}</Text> // phần này nó dính với db nên em chưa xử lý được , có gì giúp e phần này nha
          </View>
          <View row centerV gap-8>
            <View row centerV gap-2>
              <Image source={StarIcon} size={24} />
            </View>
            <Text h3>5.0</Text>
            <Text h3>|</Text>
            <Text h3>{i18n.t("reward.changed")}</Text>
          </View>
          <View row paddingV-5>
            <View flex center marginT-10>
              <TouchableOpacity
                backgroundColor="#717658"
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 35,
                  paddingVertical: 10,
                  shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
              >
                <Text white text80BO>
                  {i18n.t("reward.change_now")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default RewardItemProps;
