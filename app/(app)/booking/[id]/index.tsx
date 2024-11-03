import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import AppBar from '@/components/app-bar/AppBar';
import i18n from '@/languages/i18n';
import { router, useLocalSearchParams } from 'expo-router'
import { View, Text, TouchableOpacity, GridList, Spacings, TextField } from 'react-native-ui-lib';
// import { Calendar } from 'react-native-calendars';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import moment from 'moment';
import AppButton from '@/components/buttons/AppButton';

const BookingPage = () => {
  let numColumns = 3;
  const { id } = useLocalSearchParams();
  // const [today] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState();

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const renderTimeSlot = (time: any) => {
    return (
      <TouchableOpacity
        key={time.id}
        onPress={() => setSelectedTime(time.id)}
      >
        <View
          backgroundColor={selectedTime === time.id ? '#717658' : '#F9FAFB'}
          center 
          width={110}
          marginH-5
          paddingH-10
          paddingV-8
          style={{ borderRadius: 8 }}>
          <Text color={selectedTime === time.id ? '#FFFFFF' : '#6B7280'} h3_semibold >{time.start_time}</Text>
          <Text color={selectedTime === time.id ? '#FFFFFF' : '#6B7280'} h3_semibold>{time.end_time}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View flex useSafeArea bg-$white>
      <AppBar back title={i18n.t("service.make_appointment")} />
      <ScrollView style={{ flex: 1 }}>
        <View paddingH-24 gap-20>

          {/* <Calendar
            current={today}
            renderArrow={(direction: any) => {
              if (direction === 'left') {
                return <MaterialIcons name="arrow-back-ios-new" size={24} color="#717658" />
              }
              return <MaterialIcons name="arrow-forward-ios" size={24} color="#717658" />
            }}
            theme={{
              calendarBackground: '#F9FAFB',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#717658',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#717658',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#717658',
              selectedDotColor: '#ffffff',
              arrowColor: '#717658',
              monthTextColor: '#000000',
              textDayFontWeight: '700',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '700',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            minDate={today}
            maxDate={'2050-12-31'}
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: '#717658',
                borderRadius: 8
              },
              [today]: {
                marked: true,
                selected: selectedDate === today,
                dotColor: 'white',
                borderWidth: 1,
                borderColor: '#717658'
              }
            }}

            enableSwipeMonths={true}
            firstDay={1}
            hideExtraDays={false}
          /> */}

          <View >
            <Text h2_bold>{i18n.t("service.select_time")}</Text>
            <View center marginT-20>
              <FlatList
                key={`${numColumns}`}
                data={times}
                renderItem={({ item }) => renderTimeSlot(item)}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                contentContainerStyle={{ gap: 10, }}
              />
            </View>
          </View>

          <View >
            <Text h2_bold>{i18n.t('service.note')}</Text>
            <TextField
              placeholder={i18n.t('service.enter_content').toString()}
              placeholderTextColor='#8C8585'
              multiline
              numberOfLines={10}
              marginT-20
              style={{
                borderWidth: 1,
                borderColor: '#D9D9D9',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                textAlignVertical: 'top'
              }}

            />
          </View>


          <AppButton
            title={i18n.t("service.continue")}
            type="primary"
            onPress={() => {

            }}
          />
        </View>
      </ScrollView>

    </View>
  )
}

export default BookingPage

var times = [
  { id: 1, start_time: '08:00', end_time: '09:00' },
  { id: 2, start_time: '09:00', end_time: '10:00' },
  { id: 3, start_time: '10:00', end_time: '11:00' },
  { id: 4, start_time: '11:00', end_time: '12:00' },
  { id: 5, start_time: '12:00', end_time: '13:00' },
  { id: 6, start_time: '13:00', end_time: '14:00' },
  { id: 7, start_time: '14:00', end_time: '15:00' },
  { id: 8, start_time: '15:00', end_time: '16:00' },
  { id: 9, start_time: '16:00', end_time: '17:00' },
  { id: 10, start_time: '17:00', end_time: '18:00' },
  { id: 11, start_time: '18:00', end_time: '18:30' },
];
