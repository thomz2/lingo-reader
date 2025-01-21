import { View, Text, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { TestContext } from '../hooks/TestContext';

export default function HorizontalList({ title, children }) {
  
  // const { teste } = useContext(TestContext);

  return (
    <View className='rounded-2xl py-6 px-5'>
        <Text className='text-neutral-800 mb-3 text-3xl font-semibold'>
            {title}
            {/* {teste} */}
        </Text>
        <ScrollView horizontal={true} content>
            {children}
        </ScrollView>
    </View>
  )
}