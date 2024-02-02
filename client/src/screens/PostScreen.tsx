import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { createPostAction, getAllPosts } from '../../redux/actions/postAction';

type Props = {
    navigation: any;
}
const PostScreen = ({ navigation }: Props) => {
    const { user } = useSelector((state: any) => state.user);
    const { isSuccessCreatePost } = useSelector((state: any) => state.post);
    const { isLoading } = useSelector((state: any) => state.post);

    const [activeIndex, setActiveIndex] = useState(0)
    const [active, setActive] = useState(false);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('')
    const [replies, setReplies] = useState([
        {
            title: '',
            image: '',
            user
        }
    ]);

    useEffect(() => {
        if (replies.length == 1 && replies[0].title === '' && replies[0].image === '') {
            setReplies([]);
        }
        if (isSuccessCreatePost) {
            navigation.goBack();
            getAllPosts()(dispatch);

        }
        setTitle('');
        setImage('');
        setReplies([]);

    }, [isSuccessCreatePost]);

    const handleTitleChange = (index: number, text: string) => {
        setReplies(prevPost => {
            const updatePost = [...prevPost];
            updatePost[index] = { ...updatePost[index], title: text };
            return updatePost;
        })
    }

    const uploadImage = (index: number) => {

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.9,
            includeBase64: true
        }).then((image: ImageOrVideo | null) => {
            if (image) {
                setReplies(prevPost => {
                    const updatePost = [...prevPost];
                    updatePost[index] = { ...updatePost[index], image: 'data:image/jpeg;base64,' + image?.data };
                    return updatePost;
                })
            }
        })

    }

    const addNewThread = () => {
        if (replies[activeIndex].title !== '' || replies[activeIndex].image !== '') {
            setReplies(prevPost => [...prevPost, { title: '', image: '', user }]);
            setActiveIndex(replies.length);
        }
    }


    const removeThread = (index: number) => {
        if (replies.length > 0) {
            const updatePost = [...replies];
            updatePost.splice(index, 1);
            setReplies(updatePost);
            setActiveIndex(replies.length - 1)
        }
        else {
            setReplies([{ title: '', image: '', user }]);
        }
    }

    const addFreshNewThread = () => {
        if (title !== '' || image !== '' && !isLoading) {
            setActive(true);
            setReplies(prevPost => [...prevPost, { title: '', image: '', user }]);
            setActiveIndex(replies.length)
        }
    }

    const postImageUpload = () => {
        ImagePicker.openPicker({
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
    const createPost = async () => {
        if (title !== '' || image !== "") {
            await createPostAction(title, image, user, replies)(dispatch);
        }
    }

    return (
        <SafeAreaView className='m-3 flex-1 justify-between'>
            <View>
                <View className='w-full flex-row items-center'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>

                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }}
                            style={{ width: 20, height: 20 }}
                        />
                    </TouchableOpacity>
                    <Text className='pl-4 text-[20px] font-[500] text-[#000]'>New Threas</Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View className='mt-3 flex-row'>
                        <Image source={{ uri: user?.avatar.url }}
                            style={{ width: 42, height: 42, borderRadius: 21 }}
                        />

                        <View className='pl-4'>
                            <View className=' w-[74%] flex-row justify-between'>
                                <Text className=' text-[20px] font-[400] text-black mb-0'>{user?.name}</Text>
                                <TouchableOpacity>
                                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={{ marginTop: -8 }}
                                placeholder='What do you think? ...'
                                placeholderTextColor={'#333'}
                                value={title}
                                onChangeText={text => setTitle(text)}
                                className='mt-0 text-[#000] text-[15px]'
                            />

                            <TouchableOpacity
                                onPress={postImageUpload}
                            >

                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png' }}
                                    style={{ width: 20, height: 20 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {image && (
                        <View className='m-2'>
                            <Image
                                source={{ uri: image }}
                                width={300}
                                height={300}
                                resizeMethod='auto'
                                alt=''
                            />
                        </View>
                    )}
                    {
                        replies.length === 0 && (
                            <View className='flex-row m-3 w-full items-start mt-5 opacity-7'>
                                <Image source={{ uri: user?.avatar.url }}
                                    style={{ width: 30, height: 30 }}
                                    borderRadius={100}
                                />
                                <Text className='pl-3' onPress={addFreshNewThread}> Add to thread ...</Text>

                            </View>
                        )}

                    {
                        replies.map((item, index) => (
                            <View key={index}>
                                <View className='mt-2 flex-row'>
                                    <Image source={{ uri: user?.avatar.url }}
                                        style={{ width: 42, height: 42, borderRadius: 21 }}
                                    />

                                    <View className='pl-4'>
                                        <View className=' w-[74%] flex-row justify-between'>
                                            <Text className=' text-[20px] font-[400] text-black mb-0'>{user?.name}</Text>
                                            <TouchableOpacity onPress={() => removeThread(index)}>
                                                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png' }}
                                                    style={{ width: 18, height: 18 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <TextInput
                                            style={{ marginTop: -8 }}
                                            placeholder='What do you think? ...'
                                            placeholderTextColor={'#333'}
                                            value={item.title}
                                            onChangeText={text => handleTitleChange(index, text)}
                                            className='mt-0 text-[#000] text-[15px]'
                                        />

                                        <TouchableOpacity
                                            onPress={() => uploadImage(index)}
                                        >

                                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png' }}
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {item.image && (
                                    <View className='m-2'>
                                        <Image
                                            source={{ uri: item?.image }}
                                            width={300}
                                            height={300}
                                            resizeMethod='auto'
                                            alt=''
                                        />
                                    </View>
                                )}
                                {

                                    index === activeIndex && (
                                        <View className='flex-row m-3 w-full items-start mt-5 opacity-7'>
                                            <Image source={{ uri: user?.avatar.url }}
                                                style={{ width: 30, height: 30 }}
                                                borderRadius={100}
                                            />
                                            <Text className='pl-3' onPress={addNewThread}> Add to thread ...</Text>

                                        </View>
                                    )
                                }
                            </View>
                        ))}
                    {/* <View className='flex-row m-3 w-full items-start mt-5 opacity-7'>
                    <Image source={{ uri: user?.avatar.url }}
                        style={{ width: 30, height: 30 }}
                        borderRadius={100}
                    />
                    <Text className='pl-3' onPress={addNewThread}> Add to thread ...</Text>

                </View> */}
                </ScrollView>
            </View>
            <View className='p-2 flex-row justify-between'>
                <Text>Anyone can reply</Text>
                <TouchableOpacity onPress={createPost}>
                    <Text className='text-[#1977f2]'>Post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default PostScreen

const styles = StyleSheet.create({})