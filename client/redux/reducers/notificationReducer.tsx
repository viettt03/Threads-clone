import { createReducer, createAction } from "@reduxjs/toolkit";

const initialState = {
    error: null,
    isLoading: false,
    notifications: []
}



export const notificationReducer = createReducer(initialState, {
    getNotificationRequest: (state) => {
        state.isLoading = true;

    },
    getNotificationSuccess: (state, action) => {
        state.isLoading = false
        state.notifications = action.payload
    },
    getNotificationFailed: (state, action) => {
        state.isLoading = false
        state.error = action.payload
    },

    clearErrors: (state) => {
        state.error = null
    }

});