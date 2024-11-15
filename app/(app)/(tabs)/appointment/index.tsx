import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '@/redux/features/appointment/appointmentThunk';
import { resetAppointmentState } from '@/redux/features/appointment/appointmentSlice';
import i18n from '@/languages/i18n';
import moment from 'moment-timezone';

const ScheduledPage = () => {
  const [selectedItem, setSelectedItem] = useState<number>(1); // Set initial selected item to 1
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state: any) => state.appointment);

  useEffect(() => {
    const params = {
      from_date: moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
      to_date: moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
      status: 'confirmed'
    };
    console.log('Fetching appointments with params:', params);
    dispatch(getAppointments(params));
  }, [dispatch]);

  useEffect(() => {
    console.log('Component State:', appointments);
  }, [appointments]);

  const items = [
    { id: 1, name: i18n.t('appointment.all') },
    { id: 6, name: i18n.t('appointment.7upcoming') },
    { id: 2, name: i18n.t('appointment.pending'), status: 'pending' },
    { id: 5, name: i18n.t('appointment.confirmed'), status: 'confirmed' },
    { id: 3, name: i18n.t('appointment.completed'), status: 'completed' },
    { id: 4, name: i18n.t('appointment.cancelled'), status: 'cancelled' },
  ];

  const handleItemPress = (item: { id: number; status?: string }) => {
    setSelectedItem(item.id);
    let params: { from_date: string; to_date: string; status?: string } = {
      from_date: moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
      to_date: moment().tz('Asia/Ho_Chi_Minh').add(7, 'days').format('YYYY-MM-DD'),
      status: item.status,
    };

    if (item.id === 6) {
      params = {
        from_date: moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'),
        to_date: moment().tz('Asia/Ho_Chi_Minh').add(7, 'days').format('YYYY-MM-DD'),
        status: 'confirmed',
      };
    }

    console.log('Fetching appointments with params:', params);
    dispatch(getAppointments(params));
  };

  useEffect(() => {
    handleItemPress(items[0]);
  }, []);


  const flatListItems = appointments.map((appointment: any) => ({
    id: appointment.id,
    isBanner: true,
    name: appointment.title,
    note: appointment.note,
    service: appointment.service,
    times: appointment.time_slot ? `${i18n.t('appointment.times')}: ${moment(appointment.time_slot.start_time, 'HH:mm:ss').tz('Asia/Ho_Chi_Minh').format('HH:mm')} - ${moment(appointment.time_slot.end_time, 'HH:mm:ss').tz('Asia/Ho_Chi_Minh').format('HH:mm')}` : '',
    time: `${moment(appointment.start).tz('Asia/Ho_Chi_Minh').format(' HH:mm  DD/MM/YYYY ')}  -  ${moment(appointment.end).tz('Asia/Ho_Chi_Minh').format(' HH:mm  DD/MM/YYYY')}`,
    status: appointment.status === 'completed' ? i18n.t('appointment.completed') :
        appointment.status === 'pending' ? i18n.t('appointment.pending') :
            appointment.status === 'cancelled' ? i18n.t('appointment.cancelled') :
                i18n.t('appointment.confirmed'),

  }));

  const renderItem = (item: { id: number; name: string; status?: string }, index: number) => {
    const isSelected = item.id === selectedItem;
    return (
        <TouchableOpacity key={item.id} onPress={() => handleItemPress(item)}>
          <View style={[styles.itemContainer, isSelected ? styles.selectedItem : styles.unselectedItem]}>
            <Text style={[styles.itemText, isSelected ? styles.selectedItemText : styles.unselectedItemText]}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
    );
  };

  const renderFlatListItem = ({ item }: { item: { id: number; isBanner?: boolean; name?: string; service?: { single_price?: number }; times?: string; time?: string; status?: string; note?: string } }) => {
    const statusStyle = item.status === i18n.t('appointment.completed') ? styles.completedStatus : styles.pendingStatus;
    return (
        <View style={styles.bannerContainer}>
          <Image source={require('@/assets/images/banner.png')} style={styles.banner} />
          <View marginT-10>
            <Text h2_bold>{item.name}</Text>
          </View>
          <View centerV style={styles.infoContainer}>
            <Image source={require('@/assets/images/home/icons/ticket.png')} style={styles.icon} />
            <View centerV style={styles.priceSpace}>
              <Text h3_semibold>{item.service?.single_price ? ` ${item.service.single_price.toLocaleString()} ₫` : i18n.t('appointment.no_price')}</Text>
            </View>
          </View>
          <View centerV style={styles.infoContainer}>
            <Image source={require('@/assets/images/home/icons/note.png')} style={styles.icon} />
            <Text h3_semibold>{item.note}</Text>
          </View>
          <View centerV style={styles.infoContainer}>
            <Image source={require('@/assets/images/home/icons/clock.png')} style={styles.icon} />
            <View style={styles.priceSpace}>
              <Text h3_semibold>{item.time}</Text>
            </View>
          </View>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        <View>
          <Text h1_bold primary>{i18n.t('appointment.scheduled')}</Text>
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.scrollView}>
          {items.map((item, index) => renderItem(item, index))}
        </ScrollView>
        <FlatList showsVerticalScrollIndicator={false}
                  data={flatListItems}
                  renderItem={renderFlatListItem}
                  keyExtractor={(item) => item.id.toString()}
        />
      </View>
  );
};

export default ScheduledPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    color: "#717658",
    fontSize: 24,
    fontFamily: "Inter-Bold",
  },
  bannerContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
  },
  banner: {
    width: 350,
    height: 159,
    borderRadius: 18,
    alignSelf: "center",
  },
  bannerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#717658",
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  priceSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#717658",
    fontWeight: "bold",
  },
  priceText: {
    color: "red",
  },
  blackText: {
    color: "black",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  circleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  circleIconText: {
    color: "#fff",
    fontSize: 12,
  },
  scrollView: {
    marginTop: 10,
    marginBottom: 5,
  },
  itemContainer: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    marginBottom: 7,
  },
  selectedItem: {
    backgroundColor: "#717658",
    borderColor: "#717658",
  },
  unselectedItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#717658",
  },
  itemText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  selectedItemText: {
    color: "#FFFFFF",
  },
  unselectedItemText: {
    color: "#717658",
  },
  flatListItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  flatListItemText: {
    fontSize: 18,
  },
  completedStatus: {
    color: "#77891F",
  },
  pendingStatus: {
    color: "#6B7079",
  },
});
