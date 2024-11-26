import AppBar from '@/components/app-bar/AppBar'
import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native-ui-lib'

const HistoryLogin = () => {
  return (
    <View flex bg-white>
      <View flex>
        <AppBar back title="History Login" />
      </View>
    </View>
  )
}

export default HistoryLogin

const styles = StyleSheet.create({})