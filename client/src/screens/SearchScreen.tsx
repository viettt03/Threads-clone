import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux'
import { followUserAction, getAllUsers, unfollowUserAction } from '../../redux/actions/userAction'
import axios from 'axios';
import { URI } from '../../redux/URI';

type Props = {
    navigation: any;
}
const SearchScreen = (props: Props) => {


    const jsrmvi = require('jsrmvi');
    const { removeVI, DefaultOption } = jsrmvi;
    const [data, setData] = useState([{
        name: '',
        avatar: { url: '' },
        userName: '',
        followers: []
    }])
    const [userInfo, setUserInfo] = useState({
        name: '',
        avatar: {
            url: 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
        },
    });
    const { users, user, isLoading, token } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllUsers()(dispatch);
    }, [dispatch]);

    useEffect(() => {
        if (users) {
            setData(users);
        }
    }, [users]);
    const handleSearchChange = (e: any) => {
        const term = removeVI(e, { replaceSpecialCharacters: false });

        if (e.length !== 0) {
            const filteredUsers = users && users.filter((i: any) => removeVI(i.name, { replaceSpecialCharacters: false }).toLowerCase().includes(term));
            setData(filteredUsers);
        } else {
            setData(data);
        }

    }
    // useEffect(() => {
    //     axios.get(`${URI}/get-user/${item.user._id}`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //     }).then(res => {
    //         setUserInfo(res.data.user)
    //     })
    // }, [])

    return (
        <>
            {isLoading ? (
                <Loader />
            ) :
                (
                    <SafeAreaView>
                        <View className='p-3'>
                            <Text className='text-[30px] text-[#000] font-[600]'>Search</Text>

                            <View className='relative -mt-1.5 mb-2'>
                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3917/3917132.png' }}
                                    height={20}
                                    width={20}
                                    className='absolute top-[22px] left-2'
                                />
                                <TextInput
                                    onChangeText={(e) => handleSearchChange(e)}
                                    placeholder='Search'
                                    className='w-full h-[35px] bg-[#0000000e] rounded-[8px] py-0 pl-9 text-[#000] mt-[15px]'
                                />
                            </View>

                            <FlatList
                                data={data}
                                renderItem={({ item }) => {
                                    const handleFollowUnfollow = (e: any) => {
                                        try {
                                            if (e.followers.find((i: any) => i.userId === user._id)) {
                                                //unfollow
                                                unfollowUserAction({ userId: user._id, users, followUserId: e._id })(dispatch);

                                            } else {
                                                //follow
                                                followUserAction({ userId: user._id, users, followUserId: e._id })(dispatch);
                                            }
                                        } catch (error) {

                                        }
                                    }
                                    return (
                                        <TouchableOpacity onPress={() => props.navigation.navigate('UserProfile', { item: item })}>
                                            <View className='flex-row my-2'>
                                                <Image source={{ uri: item.avatar.url }} width={35} height={35} borderRadius={100} />

                                                <View className='w-[90%] flex-row justify-between border-b border-[#00000020] pb-1 '>
                                                    <View>
                                                        <Text className='-mt-0.5 pl-3 text-[18px] text-black'>{item.name}</Text>
                                                        <Text className='pl-3 text-[14px] text-black'>{item.userName}</Text>
                                                        <Text className='pl-3 text-[15px] text-[#444]'>
                                                            {item.followers.length} followers
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => handleFollowUnfollow(item)}
                                                            className='mt-2 rounded-[8px] w-[100px] flex-row justify-center items-center h-[35px] border border-[#a5a5a5]'>
                                                            <Text className='text-black'>{
                                                                item.followers.find((i: any) => i.userId === user._id) ? 'Following' : 'Follow'
                                                            }</Text>

                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </SafeAreaView>
                )
            }
        </>


    )
}

export default SearchScreen

const styles = StyleSheet.create({})