import { Dimensions } from 'react-native';
import { View, SkeletonView } from 'react-native-ui-lib'

const AddressSkeletonView = () => {
    const windowWidth = Dimensions.get("window").width;
    return (
        <View flex>
            <SkeletonView
                height={130}
                width={windowWidth * 0.9}
                style={{
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: 20,
                }}
            />
            <SkeletonView
                height={130}
                width={windowWidth * 0.9}
                style={{
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: 10,
                }}
            />
            <SkeletonView
                height={130}
                width={windowWidth * 0.9}
                style={{
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: 10,
                }}
            />
            <SkeletonView
                height={130}
                width={windowWidth * 0.9}
                style={{
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: 10,
                }}
            />
            <SkeletonView
                height={130}
                width={windowWidth * 0.9}
                style={{
                    borderRadius: 20,
                    alignSelf: "center",
                    marginTop: 10,
                }}
            />
        </View>
    )
}

export default AddressSkeletonView