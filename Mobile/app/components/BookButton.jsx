import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import React from 'react'

export default function BookButton({ title, coverSource, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View 
                className="my-2 h-48 shadow-2xl"
            >
                <Image
                    source={{ uri: coverSource }} // "https://picsum.photos/400"
                    className="flex-1 aspect-[2/3] mr-2 h-full shadow-2xl"
                />
            </View>
        </TouchableOpacity>
    )
}