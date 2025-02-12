import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Link } from 'expo-router'

export default function BookButton({ bookId, title, coverSource }) {
    
    useEffect(() => (console.log('bookid:', bookId)))

    return (
        <Link 
            href={{
                pathname: '/reader/' + bookId,
            }}
            asChild
        >
            <TouchableOpacity>
                <View 
                    className="h-72 rounded-3xl flex mx-2 overflow-hidden aspect-[2/3]"
                >
                    <Image
                        source={{ uri: coverSource }} // "https://picsum.photos/400"
                        className="flex-1 h-full"
                    />
                    <View className='flex bg-neutral-800 p-3 w-[100%]'>
                        <Text className='text-white w-fit'>
                            {title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    )
}