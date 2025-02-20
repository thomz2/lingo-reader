// import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import BookButton from '../components/BookButton';
// import HorizontalList from '../components/HorizontalList';
// import { useAuth } from '../hooks/AuthContext';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { useRouter } from 'expo-router';

// export default function Profile() {
  
//   const { authState, onGetUserBooks } = useAuth();

//   const router = useRouter();

//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

//   useEffect(() => {
//     const getAndSetBooks = async () => {
//       try {
//         const books = await onGetUserBooks(authState.email);
//         setBooks(books);
//       } catch (error) {
//         console.error('Error fetching books:', error);
//       } finally {
//         setLoading(false); // Finaliza o carregamento, independentemente do resultado
//       }
//     };

//     getAndSetBooks();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator />;
//   }


//   return (
//     <View className="my-8 flex justify-between relative">

//       <Pressable
//         className='absolute right-4 z-10'
//         onPress={() => {
//           router.replace('/config')
//         }}
//       >
//         <Ionicons name="settings-outline" size={36} color="#a78bfa" />
//       </Pressable>

//       <Text className='mx-4 text-4xl font-light text-neutral-800'>
//         Welcome, {authState.username.split(' ')[0]}
//       </Text>

//       <ScrollView className='mt-4'>
//         <HorizontalList
//           title={'Last books'}
//         >
//           {books.map((val, idx) => (
//             <BookButton
//               key={idx}
//               title={val.name}
//               coverSource={val.cover}
//               bookId={val.id}
//             />
//           ))}
//         </HorizontalList>
//       </ScrollView>
//     </View>

//   )
// }