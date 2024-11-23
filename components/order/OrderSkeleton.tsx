import { View, SkeletonView, Colors } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();

import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const OrderSkeleton = () => {
  return (
    <View flex bg-white>
      <AppBar back title={t("orders.detail")} />
      <View padding-16>
        <SkeletonView height={24} width={width - 32} />
        <SkeletonView height={16} width={width - 32 * 0.4} marginT-8 />

        <View marginT-24>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.itemSkeleton} row>
              <SkeletonView width={60} height={60} borderRadius={8} />
              <View flex marginL-12>
                <SkeletonView height={16} width={width - 32 * 0.8} />
                <SkeletonView height={14} width={width - 32 * 0.4} marginT-8 />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemSkeleton: {
    padding: 12,
    backgroundColor: Colors.grey70,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default OrderSkeleton;
