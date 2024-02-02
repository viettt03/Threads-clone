import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ImageCropPicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import getTimeDuration from '../common/TimeGenerator';
import axios from 'axios';
import { URI } from '../../redux/URI';
import { getAllPosts } from '../../redux/actions/postAction';


type Props = {
    navigation: any;
    route: any;

}

const CreateRepliesScreen = ({ route, navigation }: Props) => {
    const post = route.params.item;
    const postId = route.params.postId;
    const { user, isLoading, token } = useSelector((state: any) => state.user);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');

    const time = post.createdAt;
    const formattedDuration = getTimeDuration(time);

    const ImageUpload = async () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.8,
            includeBase64: true
        }).then((image: ImageOrVideo | null) => {

            if (image)
                setImage('data:image/jpeg;base64,' + image?.data)

        })
    }
    const dispatch = useDispatch();
    const createReplies = async () => {
        if (!postId) {
            await axios.put(`${URI}/add-replies`, {
                postId: post._id,
                title,
                image,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then((res: any) => {
                getAllPosts()(dispatch);

                navigation.navigate('PostDetails', {
                    data: res.data.post,
                    navigation: navigation
                });
                setTitle('');
                setImage('');
            })
        } else {
            await axios.put(`${URI}/add-reply`, {
                postId,
                replyId: post._id,
                title,
                image,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then((res: any) => {
                navigation.navigate('PostDetails', {
                    data: res.data.post,
                    navigation: navigation
                });
                setTitle('');
                setImage('');
            })
        }
    }

    return (
        <SafeAreaView>
            <View className='flex-row items-center p-3'>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png' }}
                        width={25} height={25} />
                </TouchableOpacity>
                <Text className='text-[20px] left-4 font-[600] text-[#000]'>Reply</Text>
            </View>

            <View className='h-[88vh] justify-between flex-col'>

                <ScrollView className='relative' showsVerticalScrollIndicator={false}>

                    <View className='flex-row w-full justify-between mx-4 mb-2'>
                        <View className='flex-row'>
                            <TouchableOpacity >
                                <Image source={{ uri: post.user.avatar.url }} width={40} height={40} borderRadius={100} />

                            </TouchableOpacity>
                            <View className='pl-3'>
                                <TouchableOpacity >
                                    <Text className='text-black font-[500] text-[18px] mt-1 mb-2' >{post.user.name}</Text>
                                </TouchableOpacity>
                                <Text className='text-black-800 font-[500] text-[18px]' >{post.title}</Text>

                            </View>
                        </View>
                        <View className='flex-row items-center mt-[-2  0px]'>
                            <Text className='text-[#000000b6]'>{formattedDuration}</Text>
                            <TouchableOpacity>
                                <Text className='text-[#000]  pr-9 pl-4  font-[900] mb-[8px]'>...</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className='ml-[55px] my-3'>
                        {
                            post.image && (
                                <Image source={{ uri: post.image.url }}
                                    style={{ width: '95%', aspectRatio: 1, borderRadius: 10, zIndex: 1111, borderWidth: 1, borderColor: 'grey' }}
                                    resizeMode='contain'
                                />
                            )
                        }

                    </View>
                    {post.image ? (
                        <View className="absolute top-[50] left-9 h-[70%] w-[2px] bg-[#00000017]" />
                    ) : (
                        <View className="absolute top-[45] left-9 h-[22%] w-[1px] bg-[#00000017]" />
                    )}

                    <View className='mx-4 mb-2'>
                        <View className='flex-row'>
                            <TouchableOpacity >
                                <Image source={{ uri: user.avatar.url }} width={40} height={40} borderRadius={100} />

                            </TouchableOpacity>
                            <View className='pl-3'>
                                <Text className='text-black font-[500] text-[18px] mt-1' >{user.name}</Text>
                                <TextInput
                                    placeholder={`Reply to ${post.user.name}...`}
                                    placeholderTextColor={'#666'}
                                    className='mt-[-6px] mb-[-8px]'
                                    value={title}
                                    onChangeText={setTitle}
                                />
                                <TouchableOpacity
                                    onPress={ImageUpload}
                                >

                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png' }}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {image && (
                                <Image
                                    source={{ uri: image }}
                                    style={{
                                        width: '60%',
                                        aspectRatio: 1,
                                        borderRadius: 10,
                                        zIndex: 1111,
                                        marginLeft: 45,
                                        marginVertical: 20,
                                    }}
                                />
                            )}
                        </View>

                    </View>
                </ScrollView>
                <View>
                    <View className="p-2">
                        <View className="w-full flex-row justify-between">
                            <Text className="left-3 text-[#000]">Anyone can reply</Text>
                            <TouchableOpacity onPress={createReplies}>
                                <Text className="text-[#1977f2] mr-[10px]">Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default CreateRepliesScreen

const styles = StyleSheet.create({})