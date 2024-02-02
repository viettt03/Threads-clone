import { Button, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';

type Props = {
    navigation: any
}
const { width } = Dimensions.get('window');

const ProfileScreen = (props: Props) => {

    const { user } = useSelector((state: any) => state.user);
    const { posts } = useSelector((state: any) => state.post)
    const [active, setActive] = useState(0);
    const [repliesData, setRepliesData] = useState([])
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const logoutHandle = async () => {
        logoutUser()(dispatch);
    }

    useEffect(() => {
        if (posts && user) {
            const myPosts = posts.filter((e: any) => user._id === e.user._id)
            setData(myPosts);

            const myPostsUser = posts.filter((post: any) =>
                post.replies.some((reply: any) => reply.user._id === user._id)
            );


            setRepliesData(myPostsUser)

        }
    }, [posts, user])


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <SafeAreaView className='p-[15px]'>
                <View className='flex-row justify-between'>
                    <View style={{ marginTop: 5 }}>
                        <Text className='text-[#000] text-[27px]' >{user?.name}</Text>
                        <Text className='text-[#000] text-[15px]' >{user?.userName}</Text>

                    </View>

                    <Image source={{ uri: user?.avatar?.url }} height={70} width={70} borderRadius={100} />
                </View>
                <Text className='w-[80%] py-3 text-[#000] font-sans leading-6 text-[17px]' style={{ marginTop: -10 }}>
                    Định nghĩa các thuộc tính được truyền vào các component React:
                    Trong React, các component có thể nhận các thuộc tính (props)

                </Text>

                <View className='py-3'>
                    <TouchableOpacity onPress={() => props.navigation.navigate('FollowerCard', {
                        item: user?.followers,
                        followers: user.followers,
                        following: user.following
                    })}>
                        <Text className='text-[16px] text-[#444]'>{user?.followers?.length} followers</Text>

                    </TouchableOpacity>
                </View>
                <View className='py-3 px-6 flex-row w-full items-center g-10'>
                    <TouchableOpacity onPress={() => props.navigation.navigate('EditProfile')}>
                        <Text className='w-[100] pt-1 text-center h-[30px] text-[#000] mr-5' style={{ borderColor: '#666', borderWidth: 1, borderRadius: 5 }}>Edit profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logoutHandle}>
                        <Text className='w-[100] pt-1 text-center h-[30px] text-[#000]' style={{ borderColor: '#666', borderWidth: 1, borderRadius: 5 }}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <View className='border-b border-b-[#00000032] p-4'>
                    <View className='w-[95%] m-auto flex-row justify-between'>
                        <TouchableOpacity onPress={() => setActive(0)}>
                            <Text className='text-[18px] pl-3 text-[#000]' style={{ opacity: active === 0 ? 1.2 : 0.5 }}>Threads</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActive(1)} >
                            <Text className='text-[18px] pl-3 text-[#000]' style={{ opacity: active === 1 ? 1.2 : 0.5 }}>Replies</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        active === 0 ? (
                            <View className='w-[45%] absolute h-[1px] bg-black left-[4px] bottom-0' />
                        ) : (
                            <View className='w-[45%] absolute h-[1px] bg-black right-[-4px] bottom-0' />

                        )
                    }
                </View>
                {active === 0 && (
                    <>
                        {
                            data && data.map((item: any) => (
                                <PostCard
                                    navigation={props.navigation}
                                    key={item._id}
                                    item={item}

                                />
                            ))
                        }
                    </>
                )

                }
                {active === 1 && (
                    <>
                        {
                            repliesData && repliesData.map((item: any) => (
                                <PostCard
                                    navigation={props.navigation}
                                    key={item._id}
                                    item={item}
                                    replies={true}
                                />
                            ))
                        }
                    </>
                )

                }
            </SafeAreaView>

        </ScrollView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})