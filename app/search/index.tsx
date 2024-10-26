import { SafeAreaView, StyleSheet, } from 'react-native'
import { Text, View, Image } from 'react-native-ui-lib'
import React from 'react'
import SearchAppBar from '@/components/app_bar/SearchAppBar'
import AppSearch from '@/components/inputs/AppSearch'

import ArrowDownIcon from '@/assets/icons/arrow-down.svg'

const index = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View flex marginH-20>
                <SearchAppBar />
                <AppSearch />
                <View >
                    <Text h2>Tìm kiếm gần đây</Text>
                </View>
                <View row style={{justifyContent: 'space-between'}}>
                    <Text h2_bold>Sắp xếp theo</Text>
                    <View row centerV>
                        <Text h2_bold>Từ a-Z</Text>
                        <Image source={ArrowDownIcon} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({})