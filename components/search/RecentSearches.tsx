import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLanguage } from '@/hooks/useLanguage';
const { t } = useLanguage();

interface RecentSearchesProps {
  searches: string[];
  onSearchPress: (search: string) => void;
  onRemoveSearch: (search: string) => void;
  onClearAll: () => void;
}

const RecentSearches = ({
  searches,
  onSearchPress,
  onRemoveSearch,
  onClearAll
}: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <View>
      <View row spread centerV marginB-15>
        <Text h2>{t("search.recent_searches")}</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text h3 red30>{t("search.clear_all")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {searches.map((search, index) => (
          <View key={index} style={styles.searchItem}>
            <TouchableOpacity
              style={styles.searchContent}
              onPress={() => onSearchPress(search)}>
              <AntDesign name="clockcircleo" size={16} color="#666" />
              <Text h3 marginL-8 numberOfLines={1}>{search}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onRemoveSearch(search)}
              style={styles.removeButton}
            >
              <AntDesign name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 150,
  },
  removeButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default RecentSearches;
