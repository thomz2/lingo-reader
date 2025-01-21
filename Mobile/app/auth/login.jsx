import { View, Text } from 'react-native'
import React from 'react'

import '../../global.css'
import { Link } from 'expo-router'

const Login = () => {
  return (
    <View className='flex-1 justify-center items-center h-screen w-screen'>
      <Text className='text-3xl'>Login</Text>
      <Link href={'/auth/register'}>Registrar</Link>
    </View>
  )
}

export default Login