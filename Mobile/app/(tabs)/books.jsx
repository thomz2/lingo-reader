import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import * as DocumentPicker from 'expo-document-picker';

const books = () => {
  
  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync(
        // {
        //   type: [DocumentPicker.types.allFiles],
        // }
      );
      console.log(res);
      return res;
    } catch (err) {
      console.log('Erro:', err);
    }
  };
  
  
  return (    
    <View className='relative h-full w-full'>
      <TouchableOpacity 
        className='absolute bottom-6 right-6' 
        onPress={() => {
          const res = pickDocument();
        }}
      >
        <View className='rounded-full px-6 pt-4 pb-2 bg-violet-400'>
          <Text className='text-white text-5xl'>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default books