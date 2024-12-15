import { View, SkeletonView, Colors } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import { useLanguage } from "@/hooks/useLanguage";


import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const OrderSkeleton = () => {
  const { t } = useLanguage();

  return (
    <View flex bg-white>
      <AppBar back title={t("orders.detail")} />
      <View padding-16>
        <SkeletonView height={24} width={width - 32} />
        <SkeletonView height={16} width={width - 32} marginT-8 />

        <View marginT-24>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.itemSkeleton} row>
              <SkeletonView width={width * 0.2} height={width * 0.2} borderRadius={8} />
              <View flex marginL-12>
                <SkeletonView height={16} width={width * 0.6} />
                <SkeletonView height={14} width={width * 0.6} marginT-8 />
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
