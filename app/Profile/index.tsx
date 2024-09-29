import * as React from "react";
import { StyleSheet } from "react-native";
import { View, Image, Button, Text } from "react-native-ui-lib";

interface componentNameProps {}

const componentName = (props: componentNameProps) => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:24,fontWeight:"bold",margin:20}}>Profile</Text>
      <View style={styles.box1}>
        <Image
          style={styles.imgAvt}
          source={require("@/assets/images/avt.png")}
        />
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Nguyễn Văn Tèo
          </Text>
          <Text style={{color:"#7D8267"}}>+84 346 912 121</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.allureCoin}
              source={require("@/assets/images/allureCoin.png")}
            />
            <Text style={{ color: "white", letterSpacing: 1 }}>1234</Text>
          </View>
          <Button
            style={styles.btnGift}
            iconSource={require("@/assets/images/gift.png")}
            iconStyle={styles.iconGift}
          />
        </View>
      </View>
      <View style={styles.box2}>
        <View style={styles.row}>
            <Image
              style={styles.icon}
              source={require("@/assets/images/user.png")}/>    
            <View>
                <Text style={{fontSize:16,fontWeight:"bold"}}>Tài khoản của tôi</Text>
                <Text style={{color:"#7D8267"}}>Chỉnh sửa thông tin cá nhân </Text>
            </View>
            <Image
            //   style={styles.icon}
              source={require("@/assets/images/arowright.png")}/>
        </View>
      </View>
    </View>
  );
};

export default componentName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  box1: {
    width: "90%",
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#D5D6CD",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  box2: {
    width:"auto",

    
  },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 20,
        padding: 10,
    },
    icon: {
       
        
       
        
    },
  btnGift: {
    width: 48,
    height: 29,
    borderRadius: 10,
    backgroundColor: "#F7F7F7",
    elevation: 2,
  },
  imgAvt: {
    width: 64,
    height: 64,
    borderRadius: 50,
    margin: 10,
  },
  iconGift: {
    width: 24,
    height: 24,
    tintColor: "#4D4D4D",
  },
  allureCoin: {
    width: 24,
    height: 24,
    margin: 10,
  },
});
