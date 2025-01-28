import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const index = () => {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

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

      <Text className='text-3xl mx-auto text-violet-400 font-normal mt-5'>Settings</Text>

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
      </View>
    </View>
  )
}

export default index;