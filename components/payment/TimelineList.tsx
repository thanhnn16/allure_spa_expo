import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native-ui-lib'
import TimelineItem from './TimelineItem';
import i18n from '@/languages/i18n';

interface TimelineListProps {
    state: string;
}

const TimelineList = ({ state }: TimelineListProps) => {

    const handleTimelineList = (state: string) => {
        if (state === 'pending') {
            return (
                <View>
                    <TimelineItem current currentTitle={i18n.t("transaction_detail.timeline.pending")} state="CURRENT" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.confirmed")} state="NEXT" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.delivering")} state="NEXT" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.completed")} state="NEXT" />
                </View>
            )
        } else if (state === 'confirmed') {
            return (
                <View>
                    <TimelineItem title={i18n.t("transaction_detail.timeline.pending")} state="SUCCESS" />
                    <TimelineItem current currentTitle={i18n.t("transaction_detail.timeline.confirmed")} state="CURRENT" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.delivering")} state="NEXT" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.completed")} state="NEXT" />
                </View>
            )
        } else if (state === 'delivering') {
            return (
                <View>
                    <TimelineItem title={i18n.t("transaction_detail.timeline.pending")} state="SUCCESS" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.confirmed")} state="SUCCESS" />
                    <TimelineItem current currentTitle={i18n.t("transaction_detail.timeline.delivering")} state="CURRENT" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.completed")} state="NEXT" />
                </View>
            )
        } else if (state === 'completed') {
            return (
                <View>
                    <TimelineItem title={i18n.t("transaction_detail.timeline.pending")} state="SUCCESS" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.confirmed")} state="SUCCESS" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.delivering")} state="SUCCESS" />
                    <TimelineItem current currentTitle={i18n.t("transaction_detail.timeline.completed")} state="SUCCESS" />
                </View>
            )
        } else {
            return (
                <View>
                    <TimelineItem title={i18n.t("transaction_detail.timeline.pending")} state="SUCCESS" />
                    <TimelineItem title={i18n.t("transaction_detail.timeline.confirmed")} state="SUCCESS" />
                    <TimelineItem current currentTitle={i18n.t("transaction_detail.timeline.canceled")} state="ERROR" />
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