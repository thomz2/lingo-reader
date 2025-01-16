import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import "../global.css"

export default function signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Sign In</Text>
      <TextInput
        className="w-full bg-white rounded-lg p-4 mb-4 border border-gray-300"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="w-full bg-white rounded-lg p-4 mb-6 border border-gray-300"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity className="w-full bg-blue-500 rounded-lg p-4">
        <Text className="text-center text-white font-bold">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};
