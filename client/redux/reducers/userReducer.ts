import { createReducer, createAction } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: false,
    isLoading: false,
    user: {},
    error: null,
    token: '',
    users: []
}



export const userReducer = createReducer(initialState, {
    userRegisterRequest: (state) => {
        state.loading = true;
        state.isAuthenticated = false
    },
    userRegisterSuccess: (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
    },
    userRegisterFailed: (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload
    },
    userLoadRequest: (state) => {
        state.loading = true;
        state.isAuthenticated = false
    },
    userLoadSuccess: (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token;

    },
    userLoadFailed: (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload
    },
    userLoginRequest: (state) => {
        state.loading = true;
        state.isAuthenticated = false;
    },
    userLoginSuccess: (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
    },
    userLoginFailed: (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = {};
    },
    userLogoutRequest: (state) => {
        state.loading = true;
    },
    userLogoutSuccess: (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = {}
    },
    userLogoutFailed: (state, action) => {
        state.loading = false

    },
    getUsersRequest: state => {
        state.isLoading = true;
    },
    getUsersSuccess: (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
    },
    getUsersFailed: (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
    },
    clearErrors: (state) => {
        state.error = null
        state.isAuthenticated = false
    }

});