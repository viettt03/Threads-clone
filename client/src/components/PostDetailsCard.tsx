import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getTimeDuration from '../common/TimeGenerator'
import { addLikes, addLikesToReply, addLikesToReplyReplies, removeLikes, removeLikesToReply, removeLikesToReplyReplies } from '../../redux/actions/postAction'
import axios from 'axios'
import { URI } from '../../redux/URI'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Props = {
    navigation: any
    item: any
    isReply: boolean | null
    postId?: string | null;
    replies?: boolean | null;
    isRepliesReply?: boolean;
}

const PostDetailsCard = ({ navigation, item, isReply, postId, isRepliesReply }: Props) => {

    const { token, user } = useSelector((state: any) => state.user);
    const { posts } = useSelector((state: any) => state.post);
    const dispatch = useDispatch();
    const time = item?.createdAt;
    const formattedDuration = getTimeDuration(time);
    const [active, setActive] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: '',
        avatar: {
            url: 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
        },
    });
    const profileHandler = async (e: any) => {
        // await axios.get(`${URI}/get-user/${e._id}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // }).then((res) => {
        //     if (res.data.user._id !== user._id) {
        //         navigation.navigate('UserProfile', {
        //             item: res.data.user,
        //         });
        //     } else {
        //         navigation.navigate('Profile');
        //     }
        // })
        if (e._id !== user._id) {
            navigation.navigate('UserProfile', {
                item: e,
            });
        } else {
            navigation.navigate('Profile');
        }
    }


    const reactsHandler = (e: any) => {
        if (item.likes.length !== 0) {
            const isLikedBefore = item.likes.find((i: any) => i.userId === user._id);

            if (isLikedBefore) {
                removeLikes({ postId: postId ? postId : e._id, posts, user, replyId: '', title: '' })(dispatch);
            } else {
                addLikes({ postId: postId ? postId : e._id, posts, user, replyId: '', title: '' })(dispatch);
            }
        } else {
            addLikes({ postId: postId ? postId : e._id, posts, user, replyId: '', title: '' })(dispatch);
        }

    }

    const repliesReactHanlder = (e: any) => {
        if (e.likes.length !== 0) {
            const isLikedBefore = e.likes.find((i: any) => i.userId === user._id);

            if (isLikedBefore) {
                removeLikesToReply({ postId: postId ? postId : '', posts, user, replyId: e._id, title: e.title })(dispatch);
            } else {
                addLikesToReply({ postId: postId ? postId : '', posts, user, replyId: e._id, title: e.title })(dispatch);
            }
        } else {
            addLikesToReply({ postId: postId ? postId : '', posts, user, replyId: e._id, title: e.title })(dispatch);
        }

    }

    const handlePress = async (e: any) => {
        setActive(!active);
        await AsyncStorage.setItem('replyId', e._id)
    }

    const replyRepliesReactHandle = async (e: any) => {
        const replyId = await AsyncStorage.getItem('replyId');

        if (e.likes.length !== 0) {
            const isLikedBefore = e.likes.find((i: any) => i.userId === user._id);

            if (isLikedBefore) {
                removeLikesToReplyReplies({ postId: postId ? postId : '', posts, user, replyId: replyId, title: e.title, singleReplyId: e._id })(dispatch);
            } else {
                addLikesToReplyReplies({ postId: postId ? postId : '', posts, user, replyId: replyId, title: e.title, singleReplyId: e._id })(dispatch);
            }
        } else {
            addLikesToReplyReplies({ postId: postId ? postId : '', posts, user, replyId: replyId, title: e.title, singleReplyId: e._id })(dispatch);
        }
    }
    useEffect(() => {
        axios.get(`${URI}/get-user/${item.user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUserInfo(res.data.user)
        })
    }, [])
    return (
        <View className={`p-[10px] ${!isReply && 'border-b border-b-[#00000017]'} `}
            style={{ left: isReply ? 15 : 0, width: isReply ? '95%' : '100%' }}
        >
            <View className='relative'>
                <View className='flex-row w-full justify-between'>
                    <View className='flex-row mt-1'>
                        <TouchableOpacity onPress={() => profileHandler(userInfo)}>
                            <Image source={{ uri: userInfo.avatar.url }} width={40} height={40} borderRadius={100} />

                        </TouchableOpacity>
                        <View className='pl-3'>
                            <TouchableOpacity onPress={() => profileHandler(userInfo)}>
                                <Text className='text-black font-[500] text-[18px] pb-2 pt-1' >{userInfo.name}</Text>
                            </TouchableOpacity>
                            <Text className='text-black-800 font-[500] text-[18px]' >{item?.title}</Text>

                        </View>
                    </View>
                    <View className='flex-row items-center '>
                        <Text className='text-[#000000b6]'>{formattedDuration}</Text>
                        <TouchableOpacity>
                            <Text className='text-[#000] pl-4  font-[900] mb-[8px]'>...</Text>

                        </TouchableOpacity>
                    </View>

                </View>
                <View className='ml-[50px] my-3 mr-3'>
                    {
                        item.image && (
                            <Image source={{ uri: item.image.url }}
                                style={{ aspectRatio: 1, borderRadius: 10, zIndex: 1111, borderWidth: 1, borderColor: 'grey' }}
                                resizeMode='contain'
                            />
                        )
                    }

                </View>
                {item.image ? (
                    <View className="absolute top-12 left-5 h-[90%] w-[1px] bg-[#00000017]" />
                ) : (
                    <View className="absolute top-12 left-5 h-[60%] w-[1px] bg-[#00000017]" />
                )}

                <View className='flex-row items-center left-[50px] top-[5px]'>
                    <TouchableOpacity
                        onPress={() => !isRepliesReply ? !isReply ? reactsHandler(item) : repliesReactHanlder(item) : replyRepliesReactHandle(item)}>
                        {item.likes.length > 0 ? (
                            <>
                                {item.likes.find((i: any) => i.userId === user._id) ? (
                                    <Image
                                        source={{
                                            uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
                                        }}
                                        width={30}
                                        height={30}
                                    />
                                ) : (
                                    <Image
                                        source={{
                                            uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png',
                                        }}
                                        width={30}
                                        height={30}
                                    />
                                )}
                            </>

                        ) : (
                            <Image
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png',
                                }}
                                width={30}
                                height={30}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateReplies', {
                        item: item,
                        navigation: navigation,
                        postId: postId
                    })}>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/512/5948/5948565.png',
                            }}
                            width={22}
                            height={22}
                            className="ml-5"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/512/3905/3905866.png',
                            }}
                            width={25}
                            height={25}
                            className="ml-5"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={{
                                uri: 'https://cdn-icons-png.flaticon.com/512/10863/10863770.png',
                            }}
                            width={25}
                            height={25}
                            className="ml-5"
                        />
                    </TouchableOpacity>
                </View>
                {
                    !isReply && (
                        <View className='pl-[50px] pt-4 flex-row'>
                            <TouchableOpacity onPress={() => navigation.navigate('PostDetails', {
                                data: item,
                            })}>
                                <Text className='text-[14px] text-[0000009b]'>
                                    {item.replies.length !== 0 && `${item.replies.length} replies ·`}{' '}

                                </Text>
                            </TouchableOpacity>
                            <Text className='text-[14px] text-[0000009b]'>
                                {item.likes.length} {item.likes.length > 1 ? 'likes' : 'like'}
                            </Text>
                        </View>
                    )
                }
                {isRepliesReply && (
                    <View className="pl-[50px] pt-4 flex-row">
                        <Text className="text-[16px[ text-[#0000009b]">
                            {item.likes.length} {item.likes.length > 1 ? 'likes' : 'like'}
                        </Text>
                    </View>
                )}
            </View>
            {item.reply && (
                <>
                    {
                        item.reply.length !== 0 && (
                            <>
                                <View className='flex-row items-center'>
                                    <TouchableOpacity onPress={() => handlePress(item)}>
                                        <Text className='ml-[50px] mt-[20px] text-black text-[16px]'>
                                            {active ? 'Hide Replies' : 'View Replies'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text className='ml-[10px] mt-[20px] text-black text-[16px]'>

                                            {item.likes.length}{' '}
                                            {item.likes.length > 1 ? 'likes' : 'like'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    active && (
                                        <>
                                            {item.reply.map((i: any) => (
                                                <PostDetailsCard
                                                    navigation={navigation}
                                                    item={i}
                                                    key={i._id}
                                                    isReply={true}
                                                    postId={postId}
                                                    isRepliesReply={true}
                                                />
                                            )
                                            )}
                                        </>
                                    )
                                }
                            </>

                        )
                    }
                </>
            )}
        </View >
    )
}

export default PostDetailsCard;

const styles = StyleSheet.create({})