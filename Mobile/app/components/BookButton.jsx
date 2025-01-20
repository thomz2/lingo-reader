import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'

export default function BookButton({ bookId, title, coverSource }) {
    
    useEffect(() => (console.log(bookId)))

    return (
        <Link 
            href={{
                pathname: '/reader/' + bookId,
            }}
            asChild
        >
            <TouchableOpacity>
                <View 
                    className="my-2 h-80 rounded-3xl flex mr-4 overflow-hidden"
                >
                    <Image
                        source={{ uri: coverSource }} // "https://picsum.photos/400"
                        className="flex-1 aspect-[2/3] h-full"
                    />
                    <View className='flex bg-neutral-800 p-3'>
                        <Text className='text-white'>
                            {title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    )
}