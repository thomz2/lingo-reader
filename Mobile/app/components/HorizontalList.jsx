import { View, Text, ScrollView } from 'react-native'
import React from 'react'

export default function HorizontalList({ title, children }) {
  return (
    <View className='bg-neutral-800 rounded-lg py-6 px-5'>
        <Text className='text-green-400 text-xl'>
            {title}
        </Text>
        <ScrollView horizontal={true}>
            {children}
        </ScrollView>
    </View>
  )
}