import { Colors, TabController } from 'react-native-ui-lib'

const AppTabBar = () => {
    return (
        <TabController.TabBar
            selectedLabelStyle={{
                fontSize: 16, fontFamily: 'SFProText-Bold'
            }}
            labelStyle={{
                fontSize: 16, fontFamily: 'SFProText-Regular'
            }}
            selectedLabelColor={Colors.primary}
            containerStyle={{ height: 48, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}
            indicatorStyle={{
                width: '100%',
                backgroundColor: '#717658',
                height: 3,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }}
            labelColor='#808080'
        />
    )
}

export default AppTabBar