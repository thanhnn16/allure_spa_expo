import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={{fontFamily: 'SFProText-Bold'}} >Home</Text>
      <Link href="/details/1">Chi tiết</Link>
      <Link href="/favorite">Yêu thích</Link>
    </View>
  );
}

export default gestureHandlerRootHOC(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});