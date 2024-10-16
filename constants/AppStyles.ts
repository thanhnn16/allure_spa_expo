import { StyleSheet } from "react-native";

export const AppStyles = StyleSheet.create({
    buttonFill: {
        backgroundColor: '#717658',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    buttonOutline: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderColor: '#717658',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    shadowItem: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})