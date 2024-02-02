import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Center, HStack, NativeBaseProvider, Spinner } from 'native-base';

const Loader = () => {
    return (
        <HStack flex={1} justifyContent='center'>
            <Spinner size='lg' />
        </HStack>
    )
}

export default () => {
    return (
        <NativeBaseProvider>
            <Center flex={1} px='3'>
                <Loader />
            </Center>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({})