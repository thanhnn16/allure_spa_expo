import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";
import { Href, router } from "expo-router";
import { translate } from "@/languages/i18n";
import { useAuth } from "@/hooks/useAuth";
import AppDialog from "../dialog/AppDialog";
import { useDialog } from "@/hooks/useDialog";
import { useLanguage } from "@/hooks/useLanguage";

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  url?: string;
  route?: string;
}

const RenderCategory: React.FC = () => {
  const { t } = useLanguage();
  const { isGuest, signOut } = useAuth();
  const { showDialog, hideDialog, dialogConfig } = useDialog();

  const categories = useMemo(
    () => [
      {
        id: "1",
        name: translate("home.introduce"),
        icon: require("@/assets/images/home/icons/Introduce.png"),
        url: "https://allurespa.com.vn/gioi-thieu/",
      },
      {
        id: "2",
        name: translate("home.voucher"),
        icon: require("@/assets/images/home/icons/Voucher.png"),
        route: "/voucher",
      },
      {
        id: "3",
        name: translate("home.service"),
        icon: require("@/assets/images/home/icons/Service.png"),
        route: "/see-more?type=services",
      },
      {
        id: "4",
        name: translate("home.product"),
        icon: require("@/assets/images/home/icons/Product.png"),
        route: "/see-more?type=products",
      },
      {
        id: "5",
        name: translate("home.course"),
        icon: require("@/assets/images/home/icons/Course.png"),
        url: "https://allurespa.com.vn/khoa-hoc/",
      },
      {
        id: "6",
        name: translate("home.news"),
        icon: require("@/assets/images/home/icons/News.png"),
        url: "https://allurespa.com.vn/category/tin-tuc/",
      },
    ],
    []
  );

  const handleNavigation = (item: CategoryItem) => {
    if (item.id == "2") {
      if (isGuest) {
        showDialog(
          t("auth.login.login_required"),
          t("auth.login.login_profile"),
          "info",
        );
      } else {
        router.push({
          pathname: "/voucher",
        });
      }
    } else if (item.url) {
      router.push({
        pathname: "/webview",
        params: { url: item.url },
      });
    } else if (item.route) {
      router.push(item.route as Href<string>);
    }
  };

  const renderCateItem = ({ item }: { item: CategoryItem }) => {
    return (
      <TouchableOpacity
        center
        marginH-12
        onPress={() => handleNavigation(item)}
      >
        <View
          width={48}
          height={48}
          backgroundColor="#F3F4F6"
          center
          style={{ borderRadius: 30 }}
        >
          {item.icon && <Image source={item.icon} width={32} height={32} />}
        </View>
        <Text marginT-5>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View width={"100%"} marginV-12>
      <FlatList
        data={categories}
        renderItem={renderCateItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
      <AppDialog
        visible={dialogConfig.visible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("common.confirm")}
        severity={dialogConfig.severity}
        onClose={hideDialog}
        onConfirm={() => signOut()}
      />
    </View>

  );
};

export default RenderCategory;
