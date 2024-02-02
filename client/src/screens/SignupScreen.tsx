import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/actions/userAction';

type Props = {
  navigation: any;
}

const SignupScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const { error, isAuthenticated } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  // console.log('auth', isAuthenticated);

  useEffect(() => {
    console.log(error);
    if (error) {
      Alert.alert(error)
    }
    if (isAuthenticated) {
      Alert.alert("Account Creation Successful!");
      navigation.navigate("Login")
    }

  }, [error, isAuthenticated])

  const submitHandler = async (e: any) => {

    await registerUser(name, email, password, avatar)(dispatch);
    // if (error) {
    //   Alert.alert(error)
    // }
    // if (isAuthenticated) {
    //   Alert.alert("Account Creation Successful!");
    //   navigation.navigate("Login")
    // }

  }

  const uploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.9,
      includeBase64: true
    }).then((image: ImageOrVideo | null) => {

      if (image)
        setAvatar('data:image/jpeg;base64,' + image?.data)

    })
  };
  // console.log(avatar);


  return (
    <View className='flex-[1] items-center justify-center'>
      <View className='w-[70%]'>
        <Text className='text-[25px] font-[600] text-center'>Create Account</Text>

        <TextInput
          placeholder='Enter your name'
          className='w-full h-[40px] border border-[#00000072] px-3 my-2 rounded'
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder='Enter your email'
          className='w-full h-[40px] border border-[#00000072] px-3 my-2 rounded'
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput placeholder='Enter your password'
          className='w-full h-[40px] border border-[#00000072] px-3 my-2 rounded'
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity className='flex-row items-center' onPress={uploadImage}>
          <Image source={{ uri: avatar ? avatar : 'https://cdn-icons-png.flaticon.com/128/568/568717.png' }} className='w-[30px] h-[30px] rounded-full' />
          <Text className='text-black pl-2' >
            Select Avatar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className='mt-6' onPress={submitHandler}>

          <Text
            className='w-full text-[#fff] text-center pt-[6px]  text-[20px] h-[40px] bg-black rounded'

          >

            Sign up
          </Text>
        </TouchableOpacity>
        <Text className='pt-3' onPress={() => navigation.navigate("Login")}>Already have an account? <Text>Sign in</Text></Text>


      </View>

    </View>
  )
}

export default SignupScreen