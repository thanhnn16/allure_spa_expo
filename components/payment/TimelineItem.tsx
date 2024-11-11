import { View, Text, Timeline } from 'react-native-ui-lib'

interface TimelineItemProps {
    title?: string;
    current?: boolean;
    currentTitle?: string;
    state: keyof typeof Timeline.states;
}

const TimelineItem = ({title, current, currentTitle, state} : TimelineItemProps) => {
    const timelineState = Timeline.states[state];
    return (
        <View row>
            <Timeline
                topLine={{
                    state: timelineState
                }}
                bottomLine={{
                    type: Timeline.lineTypes.DASHED,
                    state: timelineState
                }}
                point={{
                    type: Timeline.pointTypes.OUTLINE,
                    state: timelineState
                }}
            />
            <View centerV>
                {current ? <Text h3_bold>{currentTitle}</Text> : <Text h3>{title}</Text>}
            </View>
        </View>
    )
}

export default TimelineItem