import { FlatList } from "react-native"
import { View, Text, TouchableOpacity } from "react-native-ui-lib"

interface renderSectionProps {
    title: string;
    data: any;
    renderItem: any;
    onPressMore: any;
}

const RenderSection = ({title, data, renderItem, onPressMore}: renderSectionProps): JSX.Element => {
  return (
    <View gap-10 marginV-15 >
      <View row spread >
        <Text text60BO>{title}</Text>
        <TouchableOpacity onPress={onPressMore}>
          <Text underline style={{ color: '#717658' }}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10}}
      />
    </View>
  )
}

export default RenderSection;
