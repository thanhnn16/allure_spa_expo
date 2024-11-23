import { Voucher } from '@/types/voucher.type'
import { Text, View, Image, Colors } from 'react-native-ui-lib'

import VoucherMoney from '@/assets/icons/money-4.svg'
import VoucherPrecent from '@/assets/icons/ticket-discount.svg'
import { useLanguage } from '@/hooks/useLanguage';
const { t } = useLanguage();

interface VoucherItemProps {
    voucher: Voucher;
}

const VoucherItem = ({ voucher }: VoucherItemProps) => {
    const VoucherIcon = voucher.discount_type === 'percentage' ? VoucherPrecent : VoucherMoney;
    return (
        <View
            paddingV-10
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 3,
                backgroundColor: 'white',
                borderRadius: 10,
                marginVertical: 10,
                marginHorizontal: 20,
                borderColor: '#e3e4de',
            }}
        >
            <View row spread centerV marginB-10 paddingH-15>
                <View
                    row gap-15 centerV
                >
                    <Image
                        source={VoucherIcon}
                    />
                    <Text h3_bold>{voucher.code}</Text>
                </View>
                <View centerV>
                    <Text h3_bold
                        style={
                            voucher.is_active ?
                                { color: Colors.primary }
                                : { color: Colors.secondary }
                        }
                    >{voucher.is_active ? t('voucher.active') : t('voucher.expired')}</Text>
                </View>
            </View>
            <View height={1} bg-$backgroundPrimaryLight></View>
            <View paddingH-15>
                <View marginT-10>
                    <View row gap-5 centerV>
                        <View row centerV>
                            <Text h3>{t('voucher.discount')} </Text>
                            <Text h3_bold secondary>{voucher.formatted_discount}</Text>
                        </View>
                        <View row gap-3 centerV>
                            <Text h3>{t('voucher.max')}: </Text>
                            <Text h3>{voucher.max_discount_amount_formatted}</Text>
                        </View>
                    </View>
                    <View row gap-3 centerV>
                        <Text h3_bold>{t('voucher.min_order')}: </Text>
                        <Text h3>{voucher.min_order_value_formatted}</Text>
                    </View>
                    <View row gap-3 centerV>
                        <Text h3_bold>{t('voucher.description')}: </Text>
                        <Text h3>{voucher.description}</Text>
                    </View>
                    <View row centerV>
                        <Text h3>{t('voucher.expires_on')} </Text>
                        <Text h3>{voucher.end_date_formatted}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default VoucherItem