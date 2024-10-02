import { AppStyles } from '@/assets/styles/AppStyles';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Image, SortableList, TouchableOpacity } from 'react-native-ui-lib'

interface CateItem {
  id: string;
  name: string;
  icon: any;
}

const HomePage = () => {
  const [cateData, setCateData] = useState<CateItem[]>(cateArr)
  const [services, setServices] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("https://66fa1d4eafc569e13a9a70d9.mockapi.io/api/v1/products");
        const data = await res.json();
        if (data) setServices(data);
      } catch (error: any) {
        console.log("Get products error: ", error.message)
      }
    }
    getProducts();
  });

  const renderCateItem = (item: any) => {
    const rItem = item.item;
    return (
      <TouchableOpacity center marginR-20 >
        <View width={44} height={44} backgroundColor='#F3F4F6' center style={{ borderRadius: 30 }}>
          <Image source={rItem.icon} width={24} height={24} />
        </View>
        <Text marginT-5>{rItem.name}</Text>
      </TouchableOpacity>
    )
  }
  const handleOrderChange = (newData: CateItem[], info: { from: number; to: number }) => {
    console.log('New order:', newData);
    console.log('Item moved from index', info.from, 'to index', info.to);

    setCateData(newData);

  };

  const renderServiceItem = (item: any) => {
    const rItem = item.item;
    return (
      <TouchableOpacity marginR-15 style={AppStyles.shadowItem}>
        <Image source={require('@/assets/images/home/service1.png')} width={250} height={235} />
        <View paddingH-5 marginT-5>
          <Text text70H>{rItem.name}</Text>
          <Text style={{ color: '#8C8585' }}>{rItem.describe}</Text>
          <Text marginT-10 text70H style={{ color: '#A85A29' }}>{rItem.price + ' VNĐ'}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderProductItem = (item: any) => {
    const rItem = item.item;
    return (
      <TouchableOpacity marginR-15 style={AppStyles.shadowItem}>
        <Image source={require('@/assets/images/home/product1.png')} width={150} height={180} />
        <View paddingH-5 marginT-5>
          <Text text70H>{rItem.name}</Text>
          <View row>
            <View row>
              <Image source={require('@/assets/images/home/icons/yellowStar.png')} width={15} height={15} />
              <Text style={{ color: '#8C8585' }}>5.0</Text>
            </View>
            <Text> | 475 Đã bán</Text>
          </View>
          <Text marginT-10 text70H style={{ color: '#A85A29' }}>{rItem.price + ' VNĐ'}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View useSafeArea={true} paddingH-24 center bg-$backgroundDefault flex>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View row left marginB-15 width={345}>
          <Image width={48} height={48} borderRadius={30} source={require('@/assets/images/logo/logo.png')} />
          <View>
            <Text text60BO>Đức Lợi Lộc</Text>
            <Text>Allure Spa chúc bạn buổi sáng vui vẻ!</Text>
          </View>
        </View>

        <Image borderRadius={12} width={345} height={163} source={require('@/assets/images/home/PanerHome.png')} />

        <View width={345} height={65} marginT-15>
          <SortableList
            data={cateArr}
            renderItem={renderCateItem}
            onOrderChange={handleOrderChange}
            keyExtractor={item => item.id.toString()}
            flexMigration={true}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Dịch vụ */}
        <View width={345} height={370} marginT-15>
          <View row spread marginB-15>
            <Text text60BO >Dịch vụ nổi bật</Text>
            <TouchableOpacity>
              <Text underline style={{ color: '#717658' }}>Xem thêm</Text>
            </TouchableOpacity>
          </View>

          <SortableList
            data={services}
            renderItem={renderServiceItem}
            onOrderChange={handleOrderChange}
            keyExtractor={item => item.id.toString()}
            flexMigration={true}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Sản phẩm nổi bật */}
        <View width={345} height={340} marginT-15>
          <View row spread marginB-15>
            <Text text60BO >Sản phẩm nổi bật</Text>
            <TouchableOpacity>
              <Text underline style={{ color: '#717658' }}>Xem thêm</Text>
            </TouchableOpacity>
          </View>

          <SortableList
            data={services}
            renderItem={renderProductItem}
            onOrderChange={handleOrderChange}
            keyExtractor={item => item.id.toString()}
            flexMigration={true}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Sản phẩm bán chạy */}
        <View width={345} height={350} >
          <View row spread marginB-15>
            <Text text60BO >Sản phẩm bán chạy</Text>
            <TouchableOpacity>
              <Text underline style={{ color: '#717658' }}>Xem thêm</Text>
            </TouchableOpacity>
          </View>

          <SortableList
            data={services}
            renderItem={renderProductItem}
            onOrderChange={handleOrderChange}
            keyExtractor={item => item.id.toString()}
            flexMigration={true}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

      </ScrollView>
    </View>
  );
}
export default HomePage;

const cateArr = [
  {
    id: '1',
    name: 'Giới thiệu',
    icon: require('@/assets/images/home/icons/Introduce.png')
  },
  {
    id: '2',
    name: 'Voucher',
    icon: require('@/assets/images/home/icons/Voucher.png')
  },
  {
    id: '3',
    name: 'Dịch vụ',
    icon: require('@/assets/images/home/icons/Service.png')
  },
  {
    id: '4',
    name: 'Sản phẩm',
    icon: require('@/assets/images/home/icons/Product.png')
  },
  {
    id: '5',
    name: 'Khoá học',
    icon: require('@/assets/images/home/icons/Course.png')
  },
  {
    id: '6',
    name: 'Tin tức',
    icon: require('@/assets/images/home/icons/News.png')
  }
]