import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Redirect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../hooks/AuthContext';

const ConfigIndex = () => {

  const router = useRouter();

  const { authState, onReplaceUser, onLogout } = useAuth();

  const [email, setEmail] = useState(authState.email);
  const [username, setUsername] = useState(authState.username);
  const [password, setPassword] = useState('');

  if (!authState || !authState.authenticated) {
    return (
      <Redirect href={'/auth/login'} />
    );
  }

  return (
    <View>
      <Pressable
        className='absolute left-4 top-4 z-10'
        onPress={() => {
          router.replace('/(tabs)/profile');
        }}
      >
        <Ionicons name="arrow-back" size={36} color="#a78bfa" />  
      </Pressable>

      <Text className='text-3xl mx-auto text-violet-400 font-light mt-5'>Settings</Text>

      <View className='mx-[5%] mt-8'>
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
          <Text className='text-gray-400 font-semibold'>New Password</Text>
          <TextInput
            textContentType='password'
            secureTextEntry={true}
            className='bg-neutral-50 border-2 border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5'
            value={password} onChangeText={setPassword}
            placeholder="Enter new password"
          />
        </View>
      </View>

      <View className='mx-[5%] absolute flex-1 justify-end h-[95vh] w-[90%]'>
        <TouchableOpacity
          onPress={() => {
            
            const newProfile = {
              email: email, 
              username: username, 
              password: password
            }

            onReplaceUser(authState.email, newProfile);
            
          }}
          className='w-full flex justify-center items-center p-4 bg-violet-400 rounded-xl'
        >
          <View><Text className='text-white font-semibold text-lg'>Save</Text></View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onLogout();
          }}
          className='mt-4 w-full flex justify-center items-center p-4 border-2 border-violet-400 rounded-xl'
        >
          <View><Text className='font-semibold text-lg text-violet-400'>Logout</Text></View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ConfigIndex;