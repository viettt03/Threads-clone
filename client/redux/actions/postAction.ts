import axios from 'axios';
import { URI } from '../URI';
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createPostAction = (title: String, image: String, user: Object,
    replies: Array<{ title: String, image: String, user: Object }>
) => async (dispatch: Dispatch<any>) => {
    try {

        dispatch({
            type: "postCreateRequest"
        });
        const token = await AsyncStorage.getItem('token')

        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${URI}/create-post`, { title, image, user, replies }, config


        );

        dispatch({
            type: "postCreateSuccess",
            payload: data.user

        });




    } catch (error: any) {
        dispatch({
            type: "postCreateFailed",
            payload: error.response.data.message,
        })
    }
}

export const getAllPosts = () => async (dispatch: Dispatch<any>) => {
    try {
        dispatch({
            type: "getAllPostsRequest"
        });
        const token = await AsyncStorage.getItem('token')
        const { data } = await axios.get(`${URI}/get-all-posts`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        dispatch({
            type: "getAllPostsSuccess",
            payload: data.posts
        });


    } catch (error: any) {
        dispatch({
            type: "getAllPostsFailed",
            payload: error.response.data.message,
        })
    }
}

interface LikesParams {
    postId: string;
    posts: any
    user: any
    replyId?: string | null
    title?: string | null
    singleReplyId?: string | null

}

//add like
export const addLikes = ({ postId, posts, user }: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const updatedPosts = posts.map((userObj: any) =>
            userObj._id === postId ? {
                ...userObj,
                likes: [
                    ...userObj.likes,
                    {
                        userName: user.name,
                        userId: user._id,
                        userAvatar: user.avatar.url,
                        postId
                    }
                ]
            } : userObj
        );
        dispatch({
            type: 'getAllPostsSuccess',
            payload: updatedPosts
        });
        await axios.put(`${URI}/update-likes`, { postId }, {
            headers: { Authorization: `Bearer ${token}` }
        })


    } catch (error) {
        console.log(error);

    }
}

//remmmove like
export const removeLikes = ({ postId, posts, user }: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const updatedPosts = posts.map((userObj: any) =>
            userObj._id === postId ? {
                ...userObj,
                likes: userObj.likes.filter((like: any) => like.userId !== user._id)
            } : userObj
        );
        dispatch({
            type: 'getAllPostsSuccess',
            payload: updatedPosts
        });
        await axios.put(`${URI}/update-likes`, { postId }, {
            headers: { Authorization: `Bearer ${token}` }
        })


    } catch (error) {
        console.log(error);

    }
}

//add like to reply
export const addLikesToReply = ({ postId, posts, user, replyId, title }: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const updatedPosts = posts.map((post: any) =>
            post._id === postId ? {
                ...post,
                replies: post.replies.map((reply: any) =>
                    reply._id === replyId ?
                        {
                            ...reply,
                            likes: [
                                ...reply.likes, {
                                    userName: user.name,
                                    userId: user._id,
                                    userAvatar: user.avatar.url,
                                },
                            ]
                        } : reply
                )
            } : post
        );
        dispatch({
            type: 'getAllPostsSuccess',
            payload: updatedPosts
        });

        await axios.put(`${URI}/update-replies-react`, { postId, replyId, replyTitle: title }, {
            headers: { Authorization: `Bearer ${token}` }
        })


    } catch (error) {
        console.log(error);

    }
}

//remove like to reply
export const removeLikesToReply = ({ postId, posts, user, replyId, title }: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const updatedPosts = posts.map((post: any) =>
            post._id === postId ? {
                ...post,
                replies: post.replies.map((reply: any) =>
                    reply._id === replyId ?
                        {
                            likes: reply.likes.filter((i: any) => i.userId !== user._id)
                        } : reply
                )
            } : post
        );
        dispatch({
            type: 'getAllPostsSuccess',
            payload: updatedPosts
        });

        await axios.put(`${URI}/update-replies-react`, { postId, replyId, replyTitle: title }, {
            headers: { Authorization: `Bearer ${token}` }
        })


    } catch (error) {
        console.log(error);

    }
}


//add likes reply replies
export const addLikesToReplyReplies = ({ postId, posts, user, replyId, title, singleReplyId }: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {


        const token = await AsyncStorage.getItem('token');

        const updatedPosts = posts.map((post: any) =>
            post._id === postId ? {
                ...post,
                replies: post.replies.map((replie: any) =>
                    replie._id === replyId ?
                        {
                            ...replie,
                            reply: replie.reply.map((rep: any) =>
                                rep._id === singleReplyId ? {
                                    ...rep,
                                    likes: [
                                        ...rep.likes,
                                        {
                                            userName: user.name,
                                            userId: user._id,
                                            userAvatar: user.avatar.url
                                        }
                                    ]
                                } : rep
                            )
                        } : replie
                )
            } : post
        );


        dispatch({
            type: 'getAllPostsSuccess',
            payload: updatedPosts
        });

        await axios.put(`${URI}/update-reply-react`, { postId, replyId, replyTitle: title, singleReplyId }, {
            headers: { Authorization: `Bearer ${token}` }
        })


    } catch (error) {
        console.log(error);

    }
}

//remove like reply in replies
export const removeLikesToReplyReplies = ({ postId, posts, user, replyId, title, singleReplyId }: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {
        const token = await AsyncStorage.getItem('token');

        const updatedPosts = posts.map((post: any) =>
            post._id === postId ? {
                ...post,
                replies: post.replies.map((replie: any) =>
                    replie._id === replyId ?
                        {
                            ...replie,
                            reply: replie.reply.map((rep: any) =>
                                rep._id === singleReplyId ? {
                                    ...rep,
                                    likes: rep.likes.filter((i: any) => i.userId !== user._id)
                                } : rep
                            )
                        } : replie
                )
            } : post
        );
        dispatch({
            type: 'getAllPostsSuccess',
            payload: updatedPosts
        });

        await axios.put(`${URI}/update-reply-react`, { postId, replyId, replyTitle: title, singleReplyId }, {
            headers: { Authorization: `Bearer ${token}` }
        })


    } catch (error) {
        console.log(error);

    }
}