import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import AppBar from '@/components/app-bar/AppBar';
import { useLanguage } from "@/hooks/useLanguage";

const Policy = () => {
  const { t } = useLanguage();

  return (
      <View flex bg-white>
        <AppBar back title={t("profile.purchase_policy")} />
        <ScrollView style={styles.container}>
          {/* Purchase Policy Section */}
          <Section number="1" title={t('policy.purchase_policy.title')}>
            <SubSection2 number="1.1" title={t('policy.purchase_policy.order.title')} />
            {/* Order Policy Section */}
            <SubSection3 title={t('policy.purchase_policy.order.title1')} />
            <SubSection data={t('policy.purchase_policy.order.content1')} />
            <SubSection3 title={t('policy.purchase_policy.order.title2')} />
            <SubSection data={t('policy.purchase_policy.order.content2')} />
            {/* Payment Policy Section */}
            <SubSection2 number="1.2" title={t('policy.purchase_policy.payment.title')} />
            <SubSection3 title={t('policy.purchase_policy.payment.title1')} />
            <SubSection data={t('policy.purchase_policy.order.content1')} />
            <SubSection3 title={t('policy.purchase_policy.payment.title2')} />
            <SubSection data={t('policy.purchase_policy.order.content2')} />
            {/* Shipping Policy Section */}
            <SubSection2 number="1.3" title={t('policy.purchase_policy.shipping.title')} />
            <SubSection3 title={t('policy.purchase_policy.shipping.title1')} />
            <SubSection data={t('policy.purchase_policy.shipping.delivery_time')} />
            <SubSection3 title={t('policy.purchase_policy.shipping.title2')} />
            <SubSection data={t('policy.purchase_policy.shipping.shipping_fee')} />
            <SubSection3 title={t('policy.purchase_policy.shipping.title3')} />
            <SubSection data={t('policy.purchase_policy.shipping.tracking')} />
          </Section>

            {/* Return Policy Section */}
            <Section number="2" title={t('policy.return_policy.title')}>
              <SubSection2 number="2.1" title={t('policy.return_policy.conditions.title')} />
                <SubSection3 title={t('policy.return_policy.conditions.title1')} />
                <SubSection data={t('policy.return_policy.conditions.general_conditions')} />
                <SubSection3 title={t('policy.return_policy.conditions.title2')} />
                <SubSection data={t('policy.return_policy.conditions.not_eligible')} />
              {/* Return Process Section */}
              <SubSection2 number="2.2" title={t('policy.return_policy.process.title')} />
                <SubSection3 title={t('policy.return_policy.process.title1')} />
                <SubSection data={t('policy.return_policy.process.steps')} />
                <SubSection3 title={t('policy.return_policy.process.title2')} />
                <SubSection data={t('policy.return_policy.process.steps2')} />
                <SubSection3 title={t('policy.return_policy.process.title3')} />
                <SubSection data={t('policy.return_policy.process.steps3')} />
                {/* Return Refund Section */}
                <SubSection2 number="2.3" title={t('policy.return_policy.refund.title')} />
                <SubSection3 title={t('policy.return_policy.refund.title1')} />
                <SubSection data={t('policy.return_policy.refund.process')} />
                <SubSection3 title={t('policy.return_policy.refund.title2')} />
                <SubSection data={t('policy.return_policy.refund.costs')} />
                {/* Return Reschedule Section */}
                <SubSection2 number="2.4" title={t('policy.return_policy.reschedule.title')} />
                <SubSection3 title={t('policy.return_policy.reschedule.title1')} />
                <SubSection data={t('policy.return_policy.reschedule.conditions')} />

            </Section>

            {/* Cancellation Policy Section */}
          <Section number="3" title={t('policy.privacy_policy.title')}>
            <SubSection2 number="3.1" title={t('policy.privacy_policy.title1')} />
            <SubSection data={t('policy.privacy_policy.data_collection')} />
            <SubSection2 number="3.2" title={t('policy.privacy_policy.title2')} />
            <SubSection data={t('policy.privacy_policy.payment_security')} />

          </Section>

        </ScrollView>
      </View>
  );
};

const Section = ({ number, title, children }) => (
    <View>
      <Text marginT-20 h2_bold>{`${number}. ${title}`}</Text>
      {children}
    </View>
);

const SubSection2 = ({number,  title }) => (
    <View>
      <Text marginT-10 h3>
        <Text h3_bold style={styles.subSectionNumber}>{`${number}. ${title}:`}</Text>
      </Text>
    </View>
);
const SubSection3 = ({  title }) => (
    <View>
      <Text marginT-10 h3>
        <Text h3_bold style={styles.subSectionNumber}>{` ${title}`}</Text>
      </Text>
    </View>
);

// @ts-ignore
const SubSection = ({ data }) => (
    <View>
      {data.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item}</Text></Text>
          </View>
      ))}
    </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  subSectionNumber: {
    fontWeight: 'bold',
  },
});

export default Policy;
