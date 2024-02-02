import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList, Image, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications } from '../../redux/actions/notificationAction'
import { StatusBar } from 'native-base'
import getTimeDuration from '../common/TimeGenerator'
import axios from 'axios'
import { URI } from '../../redux/URI'
import Loader from '../common/Loader'

type Props = {
    navigation: any
}

const NotificationScreen = ({ navigation }: Props) => {

    const { notifications } = useSelector((state: any) => state.notifications)
    const dispatch = useDispatch();
    const [active, setActive] = useState(0)
    const { token, isLoading } = useSelector((state: any) => state.user)
    const { posts } = useSelector((state: any) => state.post)

    const labels = ['All', 'Replies', 'Mentions'];
    const handleTabPress = (index: number) => {
        setActive(index);
    }
    useEffect(() => {
        getNotifications()(dispatch);
    }, []);
    // console.log(notifications);


    return (
        <>
            {
                isLoading ? (<Loader />) : (

                    <SafeAreaView>
                        {/* <StatusBar
                animated={true}
                backgroundColor={'#61dafb'}
                barStyle={'dark-content'}
                showHideTransition={'fade'}
            /> */}

                        <View className='p-3'>
                            <Text className='text-3xl font-[700]'>Activity</Text>
                            <View className='w-full flex-row my-2 justify-between '>
                                {
                                    labels.map((label, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className='w-[115px] h-[40px] rounded-[8px]'
                                            style={{
                                                backgroundColor: active === index ? 'black' : '#fff',
                                                borderWidth: active === index ? 1 : 0,
                                                borderColor: 'rgba(0,0,0,0.29)'
                                            }}
                                            onPress={() => handleTabPress(index)}
                                        >
                                            <Text className={`${active !== index ? 'text-black' : 'text-[#fff]'} text-[20px] font-[600] text-center pt-[6px]`}>{label}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                            {/* All active */}
                            {
                                notifications.length === 0 && (
                                    <View className='w-full h-[40px] flex items-center justify-center'>
                                        <Text>You have no activity yet?</Text>
                                    </View>
                                )
                            }
                            {/* //All Replies */}
                            {
                                active === 1 && (
                                    <View className='w-full h-[40px] flex items-center justify-center'>
                                        <Text>You have no replies yet?</Text>
                                    </View>
                                )
                            }

                            {
                                active === 2 && (
                                    <View className='w-full h-[40px] flex items-center justify-center'>
                                        <Text>You have no mentions yet?</Text>
                                    </View>
                                )
                            }

                            {active === 0 &&

                                <FlatList
                                    data={notifications}
                                    renderItem={({ item }: any) => {
                                        const time = item.createdAt;
                                        const formattedDuration = getTimeDuration(time);
                                        const handleNavigation = async (e: any) => {
                                            console.log(item);
                                            console.log('e', e);


                                            const id = e.creator._id;
                                            navigation.navigate('UserProfile', {
                                                item: e.creator
                                            })
                                            if (item.type === "Follow") {
                                                navigation.navigate('UserProfile', {
                                                    item: e.creator,
                                                });
                                            } else {
                                                navigation.navigate('PostDetails', {
                                                    data: posts.find((i: any) => i.id === item.postId)
                                                });
                                            }
                                            // await axios.get(`${URI}/get-user/${id}`, {
                                            //     headers: { Authorization: `Bearer ${token}` },
                                            // }).then(res => {
                                            //     navigation.navigate('UserProfile', {
                                            //         item: res.data.user,
                                            //     })
                                            // })
                                        }
                                        return (



                                            <TouchableOpacity onPress={() => handleNavigation(item)}>
                                                <View className='flex-row mt-2' key={item._id}>
                                                    <View className='relative'>
                                                        <Image
                                                            source={{ uri: item?.creator.avatar.url }}
                                                            width={40}
                                                            height={40}
                                                            borderRadius={100}
                                                        />
                                                        {
                                                            item.type === 'Like' && (
                                                                <View className="absolute bottom-1 border-[2px] border-[#fff] right-[-5px] h-[25px] w-[25px] bg-[#eb4545] rounded-full items-center justify-center flex-row">

                                                                    <Image
                                                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png' }}
                                                                        width={15}
                                                                        height={15}
                                                                        tintColor={'#fff'}
                                                                        borderRadius={100}
                                                                    />
                                                                </View>
                                                            )
                                                        }
                                                        {
                                                            item.type === 'Follow' && (
                                                                <View className="absolute bottom-1 border-[2px] border-[#fff] right-[-5px] h-[25px] w-[25px] bg-[#3262bb] rounded-full items-center justify-center flex-row">

                                                                    <Image
                                                                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3917/3917546.png' }}
                                                                        width={15}
                                                                        height={15}
                                                                        tintColor={'#fff'}
                                                                        borderRadius={100}
                                                                    />
                                                                </View>
                                                            )
                                                        }
                                                    </View>
                                                    <View className='pl-3 my-0'>
                                                        <View className='flex-row w-full items-center border-b pb-2 border-[#0000003b]'>
                                                            <View className='w-full'>
                                                                <View className='flex-row items-center'>
                                                                    <Text className='text-[16px] text-black font-[600]'>{item.creator.name}</Text>
                                                                    <Text className='pl-2 text-[14px] text-[#1615157a] font-[600]'>{formattedDuration}</Text>

                                                                </View>
                                                                <Text className='pl-2 text-[14px] text-[#1615157a] font-[600]'>{item.title}</Text>

                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>

                                        )

                                    }}
                                />

                            }
                        </View>

                    </SafeAreaView >
                )
            }
        </>

    )
}

export default NotificationScreen

const styles = StyleSheet.create({})