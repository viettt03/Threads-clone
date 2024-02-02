import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dispatch } from "react";
import { URI } from "../URI";





export const getNotifications = () => async (dispatch: Dispatch<any>) => {
    try {
        dispatch({
            type: 'getNotificationRequest'
        });
        const token = await AsyncStorage.getItem('token');
        const { data } = await axios.get(`${URI}/get-notifications`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch({
            type: 'getNotificationSuccess',
            payload: data.notifications
        })
    } catch (error: any) {
        dispatch({
            type: 'getNotificationFailed',
            payload: error.response.data.message
        })
    }
}