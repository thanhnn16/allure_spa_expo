import React from "react";
import { View, Text } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import PagerView from "react-native-pager-view";
import AppBar from "@/components/app-bar/AppBar";

interface RewardProps {}

const Reward: React.FC<RewardProps> = () => {
  const [selectedPage, setSelectedPage] = React.useState(0);
  const pagerRef = React.useRef<PagerView>(null);
  const handlePageChange = (page: number) => {
    setSelectedPage(page);
    if (pagerRef.current) {
      pagerRef.current.setPageWithoutAnimation(page);
    }
  };
  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("reward.title")} />
      <View flex center>
        <Text h1_bold>Reward</Text>
        <Text h3>Tính năng sắp ra mắt</Text>
      </View>
    </View>
  );
};
export default Reward;
