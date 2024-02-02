import { createReducer, createAction } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    post: {},
    error: null,
    isLoading: true,
    isSuccessCreatePost: false,
    isSuccess: false,
}



export const postReducer = createReducer(initialState, {
    postCreateRequest: (state) => {
        state.isLoading = true;
        state.isSuccessCreatePost = false;
    },
    postCreateSuccess: (state, action) => {
        state.isLoading = false
        state.post = action.payload
        state.isSuccessCreatePost = true
    },
    postCreateFailed: (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isSuccessCreatePost = false
    },
    getAllPostsRequest: state => {
        state.isLoading = true;
    },
    getAllPostsSuccess: (state, action) => {
        state.isLoading = false
        state.posts = action.payload
        state.isSuccess = true
    },
    getAllPostsFailed: (state, action) => {
        state.isLoading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    }

});