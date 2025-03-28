// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { Avatar, IconButton } from 'react-native-paper';
// import { StackScreenProps } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type RootStackParamList = {
//   UserProfile: undefined;
//   Login: undefined;
// };

// type UserProfileProps = StackScreenProps<RootStackParamList, 'UserProfile'>;

// interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   username: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
// }

// const API_URL = 'http://localhost:3000/api';

// const UserProfileScreen = ({ navigation }: UserProfileProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchUserAndProducts = useCallback(async () => {
//     try {
//       // 1. Get user data from AsyncStorage
//       const userString = await AsyncStorage.getItem('user');
//       if (!userString) {
//         navigation.replace('Login');
//         return;
//       }

//       const userData: User = JSON.parse(userString);
//       setUser(userData);

//       // 2. Fetch products from API
//       const response = await fetch(`${API_URL}/products`, {
//         headers: {
//           'Authorization': `Bearer ${userData._id}`, // Using _id as token for simplicity
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch products: ${response.status}`);
//       }

//       const productsData = await response.json();
//       setProducts(productsData);
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   }, [navigation]);

//   const handleLogout = useCallback(async () => {
//     try {
//       await AsyncStorage.removeItem('user');
//       navigation.replace('Login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       Alert.alert('Error', 'Failed to logout');
//     }
//   }, [navigation]);

//   // Set navigation options
//   useEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => null,
//       headerRight: () => (
//         <IconButton
//           icon="logout"
//           onPress={handleLogout}
//           color="#FF3B30"
//           style={{ marginRight: 10 }}
//         />
//       ),
//     });
//   }, [navigation, handleLogout]);

//   // Fetch data on mount
//   useEffect(() => {
//     fetchUserAndProducts();
//   }, [fetchUserAndProducts]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6200ee" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* User Profile Section */}
//       <View style={styles.profileSection}>
//         <Avatar.Text 
//           size={80} 
//           label={user?.username?.charAt(0).toUpperCase() || 'U'} 
//           style={styles.avatar}
//         />
//         <View style={styles.userInfo}>
//           <Text style={styles.fullName}>{user?.fullName || 'Guest User'}</Text>
//           <Text style={styles.username}>@{user?.username || 'guest'}</Text>
//           <Text style={styles.email}>{user?.email || 'No email'}</Text>
//         </View>
//       </View>

//       {/* Products Section */}
//       <Text style={styles.sectionTitle}>Your Products ({products.length})</Text>
      
//       {products.length > 0 ? (
//         <View style={styles.productsContainer}>
//           {products.map(product => (
//             <View key={product._id} style={styles.productCard}>
//               <Text style={styles.productName}>{product.name}</Text>
//               <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
//               <Text style={styles.productDescription}>{product.description}</Text>
//             </View>
//           ))}
//         </View>
//       ) : (
//         <Text style={styles.noProducts}>No products available</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 2,
//   },
//   avatar: {
//     backgroundColor: '#6200ee',
//     marginRight: 16,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   fullName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   username: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   email: {
//     fontSize: 14,
//     color: '#666',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//     color: '#333',
//   },
//   productsContainer: {
//     marginBottom: 20,
//   },
//   productCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   productPrice: {
//     fontSize: 14,
//     color: '#6200ee',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   productDescription: {
//     fontSize: 14,
//     color: '#666',
//   },
//   noProducts: {
//     textAlign: 'center',
//     color: '#999',
//     marginTop: 20,
//     fontStyle: 'italic',
//   },
// });

// export default UserProfileScreen;