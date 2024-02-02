import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, loginUser } from '../../redux/actions/userAction';

type Props = {
  navigation: any;
}

const LoginScreen = ({ navigation }: Props) => {
  const { error, isAuthenticated } = useSelector((state: any) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  // console.log('eror login', error);

  // console.log('logib', isAuthenticated);

  useEffect(() => {
    if (error) {
      Alert.alert(error);
    }
    if (isAuthenticated) {
      navigation.navigate("Main")
      loadUser()(dispatch);
    }
  }, [error, isAuthenticated])

  const submitHandler = async (e: any) => {
    await loginUser(email, password)(dispatch);

    // if (error) {
    //   Alert.alert(error);
    // }
    // if (isAuthenticated) {
    //   navigation.navigate("Home")
    // }

    // ToastAndroid.showWithGravity(
    //   'Login successfull!',
    //   ToastAndroid.LONG,
    //   ToastAndroid.BOTTOM

    // )
  };





  return (
    <View className='flex-[1] items-center justify-center'>
      <View className='w-[70%]'>
        <Text className='text-[25px] font-[600] text-center'>Login</Text>
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

        <TouchableOpacity className='mt-6' onPress={submitHandler}>

          <Text
            className='w-full text-[#fff] text-center pt-[6px]  text-[20px] h-[40px] bg-black rounded'

          >

            Login
          </Text>
        </TouchableOpacity>
        <Text className='pt-3' onPress={() => navigation.navigate("Signup")}>Don't have an account? <Text>Sign up</Text></Text>


      </View>

    </View>
  )
}

export default LoginScreen