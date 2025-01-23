import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'

import '../../global.css'
import { useAuth } from '../hooks/AuthContext'
import { TextInput } from 'react-native'

const Register = () => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { onRegister } = useAuth();

  const router = useRouter();

  return (
    <View className='flex-1 justify-center items-center h-screen w-screen'>
      <View className='w-[85%]'>
        <Text className='text-5xl font-black text-neutral-800'>Sign up to your Account</Text>
        <Text className='text-gray-400 font-semibold mt-2'>Embark on this journey of continuous learning</Text>

        <View className='flex gap-y-2 mt-5'>
          <Text className='text-gray-400 font-semibold'>E-mail</Text>
          <TextInput
            className='bg-neutral-50 border-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5'
            value={email} onChangeText={setEmail}
            placeholder="Lingoreader@email.com"
          />
        </View>

        <View className='flex gap-y-2 mt-3'>
          <Text className='text-gray-400 font-semibold'>Username</Text>
          <TextInput
            className='bg-neutral-50 border-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5'
            value={username} onChangeText={setUsername}
            placeholder="John Doe"
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

        <View className='flex gap-y-2 mt-3'>
          <Text className='text-gray-400 font-semibold'>Confirm Password</Text>
          <TextInput
            textContentType='password'
            secureTextEntry={true}
            className='bg-neutral-50 border-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5'
            value={confirmPassword} onChangeText={setConfirmPassword}
            placeholder="Confirm password"
          />
        </View>

        <TouchableOpacity
          onPress={async () => {

            if (!email || !username || !password || !confirmPassword) {
              setError('All fields are required');
              return;
            }

            if (password !== confirmPassword) {
              setError('The password must match with the confirm password field.');
              return;
            }

            const registerResult = await onRegister(email, username, password);
            console.log('na tela de registro:', registerResult);

            if (!registerResult) {
              setError('Unknown error.');
              return;
            }

            if (registerResult.error) {
              setError(registerResult.msg);
              return;
            }

            router.replace('/(tabs)/profile');
          }}
          className='mt-8 w-full flex justify-center items-center p-4 bg-violet-400 rounded-xl'
        >
          <View><Text className='text-white font-semibold text-lg'>Sign Up</Text></View>
        </TouchableOpacity>

        {error != '' && <View className='flex justify-center items-center mt-3 -mb-1'>
          <Text className='text-sm font-semibold text-red-500'>{error}</Text>
        </View>}

      </View>

      <Link className='mt-4 text-gray-400 font-semibold' href={'/auth/login'}>
        Already have an account? <Text className='text-violet-400'>Sign In</Text>
      </Link>
    </View>
  )
}

export default Register