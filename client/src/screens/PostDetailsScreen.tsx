import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard';
import PostDetailsCard from '../components/PostDetailsCard';
import { useSelector } from 'react-redux';

type Props = {
    navigation: any;
    route: any;
}

const PostDetailsScreen = ({ navigation, route }: Props) => {

    let item = route.params.data;
    const { posts } = useSelector((state: any) => state.post);
    const [data, setData] = useState(item);

    useEffect(() => {
        if (posts) {
            const d = posts.find((i: any) => i._id === item._id);
            setData(d);
        }
    }, [posts]);


    return (
        <SafeAreaView>

            <View className="px-3">
                <TouchableOpacity className='pt-3 mb-[-7px]' onPress={() => navigation.goBack()}>
                    <Image
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png',
                        }}
                        height={25}
                        width={25}
                    />
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <PostDetailsCard
                        navigation={navigation}
                        item={item}
                        isReply={false}
                        postId={data._id}
                    />

                    <View>
                        {
                            data?.replies.map((i: any, index: number) => {
                                return (
                                    <PostDetailsCard
                                        navigation={navigation}
                                        item={i}
                                        key={index}
                                        isReply={true}
                                        postId={item._id}
                                    />
                                )
                            })
                        }
                    </View>
                    <View className='mb-[300px]'></View>
                </ScrollView>
            </View>
            <View className="absolute bottom-8 flex-row w-full justify-center bg-white h-[70px] items-center">
                <TouchableOpacity
                    className="w-[92%] bg-[#00000026] h-[45px] rounded-[40px] flex-row items-center"
                    onPress={() =>
                        navigation.navigate('CreateReplies', {
                            item: item,
                            navigation: navigation,

                        })
                    }>
                    <Image
                        source={{ uri: item.user.avatar.url }}
                        width={30}
                        height={30}
                        borderRadius={100}
                        className="ml-3 mr-3"
                    />
                    <Text className="text-[16px] text-[#0000009b]">
                        Reply to {item.user.name}{' '}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PostDetailsScreen

const styles = StyleSheet.create({})