import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { followUserAction, unfollowUserAction } from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';

type Props = {
    route: any;
    navigation: any;
}
const UserProfileScreen = ({ route, navigation }: Props) => {

    const { users, user, isLoading } = useSelector((state: any) => state.user);
    const { posts } = useSelector((state: any) => state.post);
    const d = route.params.item;
    const [data, setData] = useState(d);
    const [imagePreview, setImagePreview] = useState(false);
    const [followUnfollow, setFollowUnfollow] = useState(false);
    const [repliesData, setRepliesData] = useState([]);
    const [active, setActive] = useState(0);
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        if (users) {
            const userData = users.find((i: any) => i._id === d._id);
            setData(userData)
        }
        if (posts) {
            const myPostsUser = posts.filter((post: any) =>
                post.replies.some((reply: any) => reply.user._id === d._id)
            );

            setRepliesData(myPostsUser.filter((post: any) => post.replies.length > 0))
            const myPosts = posts.filter((post: any) => post.user._id === d._id);

            setMyPosts(myPosts);

        }


    }, [users, route.params.item, posts, d]);


    const dispatch = useDispatch();
    const FollowUnfollowHandle = async () => {
        try {
            if (data.followers.find((i: any) => i.userId === user._id)) {
                await unfollowUserAction({
                    userId: user._id,
                    users,
                    followUserId: data._id
                })(dispatch);
            } else {
                await followUserAction({
                    userId: user._id,
                    users,
                    followUserId: data._id
                })(dispatch);
            }
        } catch (error) {
            console.log('error user profile', error);

        }
    }


    return (
        <>
            {
                data && (
                    <SafeAreaView>
                        {
                            imagePreview ? (
                                <TouchableOpacity className='h-screen bg-white w-full items-center justify-center'
                                    onPress={() => setImagePreview(!imagePreview)}
                                >
                                    <Image source={{ uri: data.avatar.url }} width={350} height={350} />
                                </TouchableOpacity>
                            ) : (
                                <View className='p-3'>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png' }}

                                            width={25} height={25} />
                                    </TouchableOpacity>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View className='w-full flex-row justify-between'>
                                            <View>
                                                <Text className='pt-3 text-[22px] text-black'>
                                                    {data.name}
                                                </Text>
                                                {data.userName && (
                                                    <Text className='py-2 text-[16px] text-[#0000009d]'>
                                                        {data.userName}
                                                    </Text>
                                                )}
                                                {
                                                    data.bio && (
                                                        <Text className='py-2 text-[16px] text-[#000000c4]'>
                                                            {data.bio}
                                                        </Text>
                                                    )
                                                }
                                                <TouchableOpacity onPress={() => navigation.navigate('FollowerCard', {
                                                    item: data?.followers,
                                                    followers: data.followers,
                                                    following: data.following
                                                })}>
                                                    <Text className='py-0 px-2 text-[16px] text-[#000000c7]'>
                                                        {data.followers.length} followers
                                                    </Text>

                                                </TouchableOpacity>

                                            </View>
                                            <TouchableOpacity onPress={() => setImagePreview(!imagePreview)}>
                                                <Image source={{ uri: data.avatar.url }}
                                                    width={60} height={60} borderRadius={100}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            className=' h-[35px] w-full mt-5 rounded-[8px] flew-row justify-center items-center bg-blue-600'
                                            onPress={() => FollowUnfollowHandle()}
                                        >
                                            <Text className='text-white text-[18px]'>
                                                {
                                                    data.followers.find((i: any) => i.userId === user._id) ? 'Following' : 'Follow'
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                        <View className='w-[90%] mx-auto border-b border-b-[#00000032] pt-5 pb-2 relative '>
                                            <View className='w-[80%] m-auto flex-row justify-between'>
                                                <TouchableOpacity onPress={() => setActive(0)}>
                                                    <Text className='text-[18px] pl-3 text-black'
                                                        style={{ opacity: active === 0 ? 1 : 0.6 }}
                                                    >

                                                        Threads</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => setActive(1)}>
                                                    <Text className='text-[18px] pl-3 text-black'
                                                        style={{ opacity: active === 1 ? 1 : 0.6 }}
                                                    >

                                                        Replies</Text>
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
                                                    myPosts && myPosts.map((item: any) => (
                                                        <PostCard
                                                            navigation={navigation}
                                                            key={item._id}
                                                            item={item}
                                                        />
                                                    ))
                                                }
                                                {
                                                    myPosts.length === 0 && (
                                                        <Text className='text-black py-5 text-center text-[18px]'>No Post yet!</Text>
                                                    )
                                                }
                                            </>
                                        )

                                        }
                                        {active === 1 && (
                                            <>
                                                {
                                                    repliesData && repliesData.map((item: any) => (
                                                        <PostCard
                                                            navigation={navigation}
                                                            key={item._id}
                                                            item={item}
                                                            replies={true}
                                                        />
                                                    ))
                                                }
                                                {
                                                    myPosts.length === 0 && (
                                                        <Text className='text-black py-5 text-center text-[18px]'>No Post yet!</Text>
                                                    )
                                                }
                                            </>
                                        )

                                        }
                                        <View className='h-10'></View>
                                    </ScrollView>
                                </View >
                            )
                        }
                    </SafeAreaView>
                )
            }
        </>
    )
}

export default UserProfileScreen

const styles = StyleSheet.create({})