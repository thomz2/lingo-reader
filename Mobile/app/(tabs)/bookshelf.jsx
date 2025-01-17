import React from 'react'
import { View, Text, ScrollView, Image } from 'react-native';

const onlineBooks = [
    { 
        title: 'Book One',
        imageUrl: 'https://m.media-amazon.com/images/I/61kif0Iav7L._AC_UF1000,1000_QL80_.jpg',
        src: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf' 
    },
    { 
        title: 'Book Two', 
        imageUrl: 'https://picsum.photos/400' 
    },
    { 
        title: 'Book Three', 
        imageUrl: 'https://picsum.photos/200' 
    },
];

export default function bookshelf() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-3xl font-bold text-center mb-4 text-green-400">LingoLeaf Reader</Text>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {onlineBooks.map((book, index) => (
          <View key={index} className="w-1/3 p-2 cursor-pointer">
            <View className="rounded-lg shadow shadow-green-600 relative">
                <Text className="inset-0 items-end flex justify-center absolute z-10 text-neutral-400 text-lg font-medium mb-2 text-center">
                    {book.title}
                </Text>
                <Image source={{ uri: book.imageUrl }} className="h-96 w-full rounded" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}