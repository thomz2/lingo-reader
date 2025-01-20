import { View, Text, ScrollView } from 'react-native'
import React from 'react'

export default function HorizontalList({ title, children }) {
  return (
    <View className='rounded-2xl py-6 px-5'>
        <Text className='text-neutral-800 mb-3 text-3xl font-semibold'>
            {title}
        </Text>
        <ScrollView horizontal={true} content>
            {children}
        </ScrollView>
    </View>
  )
}