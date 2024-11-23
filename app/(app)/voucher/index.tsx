import { useEffect, useState } from "react";
import {
  View,
  Text,
  TabController,
  Image
} from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { getAllVouchersThunk } from "@/redux/features/voucher/getAllVoucherThunk";
import AppBar from "@/components/app-bar/AppBar";
import AppTabBar from "@/components/app-bar/AppTabBar";
import VoucherItem from "@/components/voucher/VoucherItem";
import { Voucher as VoucherType } from "@/types/voucher.type";
import VoucherSkeletonView from "@/components/voucher/VoucherSkeletonView";

import VoucherShape from "@/assets/icons/discount-shape.svg";

const Voucher = () => {
  const dispatch = useDispatch();
  const [activeVouchers, setactiveVoucher] = useState<VoucherType[]>([]);
  const [expiredVouchers, setexpiredVoucher] = useState<VoucherType[]>([]);

  const { vouchers, isLoading } = useSelector((
    state: RootState) => state.voucher
  );

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        await dispatch(getAllVouchersThunk());
        setactiveVoucher(vouchers.filter((voucher: any) => voucher.is_active));
        setexpiredVoucher(vouchers.filter((voucher: any) => !voucher.is_active));
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, [dispatch]);

  const renderAllPage = () => {
    if (vouchers.length === 0) {
      return (
        <View flex center>
          <Image
            source={VoucherShape}
            width={200}
            height={200}
          />
          <View marginT-20 centerH>
            <Text h3_bold>{t("voucher.no_voucher")}</Text>
            <Text h3>{t("voucher.buy_product_for_voucher")}</Text>
          </View>
        </View>
      );
    } else if (vouchers.length > 0) {
      return (
        <FlatList
          data={vouchers}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (<VoucherItem voucher={item} />)}
        />
      );
    };
  };

  const renderActivePage = () => {
    if (activeVouchers.length === 0) {
      return (
        <View flex center>
          <Image
            source={VoucherShape}
            width={200}
            height={200}
          />
          <View marginT-20 centerH>
            <Text h3_bold>{t("voucher.no_voucher")}</Text>
            <Text h3>{t("voucher.buy_product_for_voucher")}</Text>
          </View>
        </View>
      );
    } else if (activeVouchers.length > 0) {
      return (
        <FlatList
          data={activeVouchers}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (<VoucherItem voucher={item} />)}
        />
      );
    };
  };

  const renderExpiredPage = () => {
    if (expiredVouchers.length === 0) {
      return (
        <View flex center>
          <Image
            source={VoucherShape}
            width={200}
            height={200}
          />
          <View marginT-20 centerH>
            <Text h3_bold>{t("voucher.no_voucher")}</Text>
            <Text h3>{t("voucher.buy_product_for_voucher")}</Text>
          </View>
        </View>
      );
    } else if (expiredVouchers.length > 0) {
      return (
        <FlatList
          data={expiredVouchers}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (<VoucherItem voucher={item} />)}
        />
      );
    };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title={t("voucher.title")} />
        {isLoading ? (
          <VoucherSkeletonView />
        ) : (
          <TabController items={[{ label: t("voucher.all") }, { label: t("voucher.active") }, { label: t("voucher.expired") }]}>
            <AppTabBar />
            <View flex>
              <TabController.TabPage index={0}>{renderAllPage()}</TabController.TabPage>
              <TabController.TabPage index={1} lazy>{renderActivePage()}</TabController.TabPage>
              <TabController.TabPage index={2} lazy>{renderExpiredPage()}</TabController.TabPage>
            </View>
          </TabController>
        )}

      </View>
    </GestureHandlerRootView>
  );
};
export default Voucher;
