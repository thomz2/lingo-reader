import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link, Redirect, useRouter } from 'expo-router'

import '../../global.css'
import { useAuth } from '../hooks/AuthContext'

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { onLogin, authState } = useAuth();

  const router = useRouter();

  if (authState && authState.authenticated) {
    return (<Redirect href={'/(tabs)/books'} />);
  }

  return (
    <View className='flex-1 justify-center items-center h-screen w-screen'>
      <View className='w-[85%]'>
        <Text className='text-6xl mb-8 font-thin'>
          <Text className='text-violet-400'>Lingo</Text><Text className='text-neutral-800'>Reader</Text>
        </Text>
        <Text className='text-5xl font-black text-neutral-800'>Sign in to your Account</Text>
        <Text className='text-gray-400 font-semibold mt-2'>Enter your email and password to log in</Text>

        <View className='flex gap-y-2 mt-5'>
          <Text className='text-gray-400 font-semibold'>E-mail</Text>
          <TextInput
            className='bg-neutral-50 border-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5'
            value={email} onChangeText={setEmail}
            placeholder="Lingoreader@email.com"
          />
        </View>

        <View className='flex gap-y-2 mt-3'>
          <Text className='text-gray-400 font-semibold'>Password</Text>
          <TextInput
            textContentType='password'
            secureTextEntry={true}
            className='bg-neutral-50 border-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5'
            value={password} onChangeText={setPassword}
            placeholder="Password"
          />
        </View>

        <TouchableOpacity 
          onPress={async () => {
            const loginResult = await onLogin(email, password);
            console.log('na tela de login:', loginResult);
            
            if (!email || !password) {
              setError('All fields are required');
              return;
            }

            if (!loginResult) {
              setError('Unknown error.');
              return;
            }

            if (loginResult.error) {
              setError(loginResult.msg);
              return;
            }
             
            router.replace('/(tabs)/books');
          }}
          className='mt-8 w-full flex justify-center items-center p-4 bg-violet-400 rounded-xl'
        >
          <View><Text className='text-white font-semibold text-lg'>Log In</Text></View>
        </TouchableOpacity>

        {error != '' && <View className='flex justify-center items-center mt-3 -mb-1'>
          <Text className='text-sm font-semibold text-red-500'>{error}</Text>
        </View>}

      </View>

      <Link className='mt-4 text-gray-400 font-semibold' href={'/auth/register'}>
        Don't have an account? <Text className='text-violet-400'>Sign Up</Text>
      </Link>
    </View>
  )
}

export default Login