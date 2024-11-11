import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native-ui-lib'
import TimelineItem from './TimelineItem';

interface TimelineListProps {
    state: string;
    deliveryDate?: string;
    delivedDate?: string;
}

const TimelineList = ({ state, deliveryDate, delivedDate }: TimelineListProps) => {

    const handleTimelineList = (state: string) => {
        if (state === 'pending') {
            return (
                <View>
                    <TimelineItem current currentTitle="Đơn hàng được đặt" state="CURRENT" />
                    <TimelineItem title="Đơn hàng đang được xử lý" state="NEXT" />
                    <TimelineItem title="Đơn hàng đang được vận chuyển" state="NEXT" />
                    <TimelineItem title="Đơn hàng đã được giao" state="NEXT" />
                </View>
            )
        } else if (state === 'confirmed') {
            return (
                <View>
                    <TimelineItem title="Đơn hàng được đặt" state="SUCCESS" />
                    <TimelineItem current currentTitle="Đơn hàng đang được xử lý" state="CURRENT" />
                    <TimelineItem title="Đơn hàng đang được vận chuyển" state="NEXT" />
                    <TimelineItem title="Đơn hàng đã được giao" state="NEXT" />
                </View>
            )
        } else if (state === 'delivering') {
            return (
                <View>
                    <TimelineItem title="Đơn hàng được đặt" state="SUCCESS" />
                    <TimelineItem title="Đơn hàng đang được xử lý" state="SUCCESS" />
                    <View
                        centerV
                    >
                        <TimelineItem current currentTitle="Đơn hàng đang được vận chuyển" state="CURRENT" />
                        <Text h3_bold>Ngày giao hàng dự kiến: <Text h3>{deliveryDate}</Text></Text>
                    </View>
                    <TimelineItem title="Đơn hàng đã được giao" state="NEXT" />
                </View>
            )
        } else if (state === 'completes') {
            return (
                <View>
                    <TimelineItem title="Đơn hàng được đặt" state="SUCCESS" />
                    <TimelineItem title="Đơn hàng đang được xử lý" state="SUCCESS" />
                    <TimelineItem title="Đơn hàng đang được vận chuyển" state="SUCCESS" />
                    <View
                        centerV
                    >
                        <TimelineItem current currentTitle="Đơn hàng đã được giao" state="SUCCESS" />
                        <Text h3_bold>Ngày nhận hàng: <Text h3>{delivedDate}</Text></Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <TimelineItem title="Đơn hàng được đặt" state="SUCCESS" />
                    <TimelineItem title="Đơn hàng đang được xử lý" state="SUCCESS" />
                    <TimelineItem current currentTitle="Đơn hàng đã bị hủy" state="ERROR" />
                </View>
            )
        }
    }

    return (
        <View>
            {handleTimelineList(state)}
        </View>
    )
}

export default TimelineList