import { StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Colors, Text, View, Image, Button } from 'react-native-ui-lib';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments, cancelAppointment } from '@/redux/features/appointment/appointmentThunk';
import i18n from '@/languages/i18n';
import moment from 'moment-timezone';
import ClockIcon from '@/assets/icons/clock.svg';
import AppButton from "@/components/buttons/AppButton";
import { AppointmentResponeModelParams } from '@/types/service.type';

const ScheduledPage = () => {
  const [selectedItem, setSelectedItem] = useState<number>(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: any) => state.appointment);
  const loggedInUserId = useSelector((state: any) => state.auth.user.id);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  useEffect(() => {
    console.log('Appointments State:', appointments);
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

    if (item.id === 1) {
      params = {
        from_date: null,
        to_date: null,
        status: null,
      };
    }

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

  const flatListItems = appointments.map((appointment: AppointmentResponeModelParams) => ({
    id: appointment.id,
    isBanner: true,
    name: appointment.title,
    note: appointment.note,
    service: appointment.service,
    start: appointment.start,
    end: appointment.end,
    times: appointment.time_slot ? `${i18n.t('appointment.times')}: ${moment(appointment.time_slot.start_time, 'HH:mm:ss').tz('Asia/Ho_Chi_Minh').format('HH:mm')} - ${moment(appointment.time_slot.end_time, 'HH:mm:ss').tz('Asia/Ho_Chi_Minh').format('HH:mm')}` : '',
    time: `${moment(appointment.start).tz('Asia/Ho_Chi_Minh').format(' HH:mm  DD/MM/YYYY ')}  -  ${moment(appointment.end).tz('Asia/Ho_Chi_Minh').format(' HH:mm  DD/MM/YYYY')}`,
    status: appointment.status === 'Completed' ? i18n.t('appointment.completed') :
        appointment.status === 'Pending' ? i18n.t('appointment.pending') :
            appointment.status === 'Cancelled' ? i18n.t('appointment.cancelled') :
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


  const handleCancelOrderPress = (id: number) => {
    setCurrentItemId(id);
    setModalVisible(true);
  };

  const handleConfirmCancel = () => {
    if (currentItemId !== null) {
      dispatch(cancelAppointment({ id: currentItemId, note })).then(() => {
        dispatch(getAppointments());
      });
      setModalVisible(false);
      setNote('');
    }
  };

  const renderFlatListItem = ({ item }: { item: AppointmentResponeModelParams }) => {
    // @ts-ignore
    return (
        <View
            paddingT-10
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 3,
              backgroundColor: 'white',
              borderRadius: 10,
              marginVertical: 10,
              marginHorizontal: 10,
              borderColor: '#e3e4de',
            }}
        >
          <View row spread centerV paddingH-15>
            <View row gap-15 centerV>
              <Text h3_bold>{`${i18n.t('appointment.order_code')} #${item.id.toString().padStart(3)}`}</Text>
            </View>
            <View row gap-10 centerV>
              <View>
                <Text
                    h3_semibold
                    style={
                      item.status === 'completed'
                          ? styles.completedStatus
                          : item.status === 'pending'
                              ? styles.pendingStatus
                              : item.status === 'cancelled'
                                  ? styles.cancelledStatus
                                  : styles.confirmedStatus
                    }
                >
                  {item.status === 'completed'
                      ? i18n.t('appointment.completed')
                      : item.status === 'pending'
                          ? i18n.t('appointment.pending')
                          : item.status === 'cancelled'
                              ? i18n.t('appointment.cancelled')
                              : i18n.t('appointment.confirmed')}
                </Text>
              </View>
            </View>
          </View>
          <View height={1} marginV-10 bg-$backgroundPrimaryLight></View>
          <View paddingH-15>
            <View row spread marginT-10>
              <Image
                  source={require('@/assets/images/banner.png')}
                  style={{ width: 120, height: 120, borderRadius: 13 }}
              />
              <View flex marginL-10 gap-5>
                <View>
                  <Text h3_bold numberOfLines={2}>{item.title}</Text>
                  <Text h3_bold secondary>{item.service?.single_price ? ` ${item.service.single_price.toLocaleString()} ₫` : i18n.t('appointment.no_price')}</Text>
                </View>
              </View>
            </View>
            <View flex row centerV bottom marginT-10>
              <Image source={ClockIcon} width={20} height={20} />
              <Text h3>{`${moment(item.start).tz('Asia/Ho_Chi_Minh').format(' HH:mm  DD/MM/YYYY ')}  -  ${moment(item.end).tz('Asia/Ho_Chi_Minh').format(' HH:mm  DD/MM/YYYY')}`}</Text>
            </View>
            {item.status !== 'Pending' && item.status !== 'Confirmed' && item.status !== 'Completed' && (
                <View marginT-10>

                  <Text h4_bold>{`${i18n.t('appointment.cancellation_note')}: ${item.cancellation_note ? item.cancellation_note : i18n.t('appointment.no_notes')}`}</Text>
                  <Text h4_bold>{`${i18n.t('appointment.cancelled_at')}: ${new Date(item.cancelled_at).toLocaleString()}`}</Text>
                  <Text h4_bold>{`${i18n.t('appointment.cancelled_by')}: ${item.cancelled_by_user?.full_name}`}</Text>
                </View>
            )}
          </View>
          <View height={1} marginT-10 bg-$backgroundPrimaryLight></View>
          <View paddingH-15 paddingV-5 backgroundColor={Colors.primary_light}>
            <View row spread marginT-10>
              <Text h3_bold>Tổng tiền:</Text>
              <Text h3_bold secondary>{item.service?.single_price ? ` ${item.service.single_price.toLocaleString()} ₫` : i18n.t('appointment.no_price')}</Text>
            </View>
            {item.status === 'Pending' && (
                <AppButton
                    type="outline"
                    title={i18n.t('appointment.cancel_appointment')}
                    onPress={() => handleCancelOrderPress(item.id)}
                    buttonStyle={{ marginTop: 10 }}
                />
            )}
          </View>
          <Modal visible={isModalVisible} transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{i18n.t('appointment.cancel_appointment')}</Text>
                <TextInput
                    style={styles.noteInput}
                    placeholder={i18n.t('appointment.cancel_appointment_reason')}
                    value={note}
                    onChangeText={setNote}
                    multiline
                />
                <View style={styles.buttonContainer}>

                  <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmCancel}>
                    <Text style={styles.buttonText}>{i18n.t('appointment.confirm')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'column', marginBottom: 10, backgroundColor: '#fff' }}>
          <Text h1_bold primary>{i18n.t('appointment.scheduled')}</Text>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.scrollView}>
            {items.map((item, index) => renderItem(item, index))}
          </ScrollView>
        </View>
        <FlatList
            style={{ backgroundColor: '#fff', paddingRight: 10 }}
            showsVerticalScrollIndicator={false}
            data={appointments}
            renderItem={renderFlatListItem}
            keyExtractor={(item) => item.id.toString()}
        />

      </View>
  );
};

export default ScheduledPage;

const styles = StyleSheet.create({
  container: {
    paddingStart: 10,
    marginBottom: 95,
    backgroundColor: '#fff',
  },
  text: {
    color: '#717658',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  bannerContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
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
    alignSelf: 'center',
  },
  bannerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#717658',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priceSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#717658',
    fontWeight: 'bold',
  },
  priceText: {
    color: 'red',
  },
  blackText: {
    color: 'black',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  circleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  circleIconText: {
    color: '#fff',
    fontSize: 12,
  },
  scrollView: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  itemContainer: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    marginBottom: 7,
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: '#717658',
    borderColor: '#717658',
  },
  unselectedItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#717658',
  },
  itemText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectedItemText: {
    color: '#FFFFFF',
  },
  unselectedItemText: {
    color: '#717658',
  },
  flatListItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatListItemText: {
    fontSize: 18,
  },
  noteInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    confirmButton: {
        backgroundColor: '#77891F',
        padding: 10,
        borderRadius: 5,
    },
  completedStatus: {
    color: '#77891F',
    backgroundColor: '#F0F4E3',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#77891F',
  },
  pendingStatus: {
    color: '#6B7079',
    backgroundColor: '#E8E9EB',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#6B7079',
  },
  cancelledStatus: {
    color: '#FF0000',
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  confirmedStatus: {
    color: '#0000FF',
    backgroundColor: '#E5E5FF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#0000FF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});
