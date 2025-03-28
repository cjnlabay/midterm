import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshCcw, Edit, Trash2, Info } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const API_BASE_URL = 'http://10.0.2.2:3000/api/'; // For Android emulator
const API_BASE_URL = 'http://localhost:3000/api/'; // For iOS simulator or physical device

const Profile = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found. Please log in.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}products`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error);
            Alert.alert('Error', error.message || 'Failed to fetch users. Please try again.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers();
    }, [fetchUsers]);

    const prepareUpdateForm = (user) => {
        setSelectedUser(user);
        setFullname(user.fullname || '');
        setUsername(user.username || '');
        setEmail(user.email || '');
        setPassword(user.password || '');
        setModalVisible(true);
    };

    const resetForm = () => {
        setFullname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setSelectedUser(null);
    };

    const showUserInfo = (user) => {
        setSelectedUser(user);
        setInfoModalVisible(true);
    };

    const addUser = async () => {
        if (!fullname || !username || !email) {
            Alert.alert('Error', 'Fullname, Username and Email are required!');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found. Please log in.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}products`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname, username, email, password }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const newUser = await response.json();
            setUsers(prevUsers => [...prevUsers, newUser]);
            resetForm();
            setModalVisible(false);
            Alert.alert('Success', 'User added successfully!');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to add user. Please try again.');
        }
    };

    const updateUser = async () => {
        if (!selectedUser || !fullname || !username || !email) {
            Alert.alert('Error', 'All required fields must be filled!');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found. Please log in.');
                return;
            }

            const updateData = {
                fullname: fullname.trim(),
                username: username.trim(),
                email: email.trim(),
                ...(password.trim() ? { password: password.trim() } : {}),
            };

            const response = await fetch(`${API_BASE_URL}products/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const updatedUser = await response.json();
            setUsers(prevUsers => prevUsers.map(user => user._id === updatedUser._id ? updatedUser : user));
            resetForm();
            setModalVisible(false);
            Alert.alert('Success', 'User updated successfully!');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to update user. Please try again.');
        }
    };

    const deleteUser = async (userId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No authentication token found. Please log in.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}products/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            Alert.alert('Success', 'User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', error.message || 'Failed to delete user. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Manage Users</Text>
                <TouchableOpacity 
                    onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }} 
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>Add User</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3498db" />
                </View>
            ) : error ? (
                <View style={styles.retryContainer}>
                    <Text style={styles.errorText}>Failed to load users.</Text>
                    <TouchableOpacity onPress={fetchUsers} style={styles.retryButton}>
                        <RefreshCcw size={20} color="#3498db" />
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    contentContainerStyle={styles.listContentContainer}
                    renderItem={({ item }) => (
                        <View style={styles.userCard}>
                            <Text style={styles.userName}>{item.fullname}</Text>
                            <Text style={styles.userDetails}>@{item.username}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                            <Text style={styles.userCreated}>
                                Joined: {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity 
                                    onPress={() => deleteUser(item._id)} 
                                    style={[styles.actionButton, styles.deleteButton]}
                                >
                                    <Trash2 size={18} color="white" />
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => prepareUpdateForm(item)} 
                                    style={[styles.actionButton, styles.updateButton]}
                                >
                                    <Edit size={18} color="white" />
                                    <Text style={styles.actionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => showUserInfo(item)} 
                                    style={[styles.actionButton, styles.infoButton]}
                                >
                                    <Info size={18} color="white" />
                                    <Text style={styles.actionText}>Info</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No users found</Text>
                        </View>
                    }
                />
            )}

            {/* Add/Update User Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderText}>
                            {selectedUser ? 'Update User' : 'Add User'}
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Full Name" 
                            value={fullname} 
                            onChangeText={setFullname} 
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Username" 
                            value={username} 
                            onChangeText={setUsername} 
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Email" 
                            value={email} 
                            onChangeText={setEmail} 
                            keyboardType="email-address"
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Password" 
                            secureTextEntry 
                            value={password} 
                            onChangeText={setPassword} 
                            placeholderTextColor="#999"
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity 
                                onPress={selectedUser ? updateUser : addUser} 
                                style={[styles.modalButton, styles.saveButton]}
                            >
                                <Text style={styles.modalButtonText}>
                                    {selectedUser ? 'Update' : 'Save'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {
                                    resetForm();
                                    setModalVisible(false);
                                }} 
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* User Info Modal */}
            <Modal visible={infoModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeaderText}>User Details</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoLabel}>Fullname:</Text>
                            <Text style={styles.infoValue}>{selectedUser?.fullname}</Text>
                            
                            <Text style={styles.infoLabel}>Username:</Text>
                            <Text style={styles.infoValue}>@{selectedUser?.username}</Text>
                            
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>{selectedUser?.email}</Text>
                            
                            <Text style={styles.infoLabel}>User ID:</Text>
                            <Text style={styles.infoValue}>{selectedUser?._id}</Text>
                            
                            <Text style={styles.infoLabel}>Created At:</Text>
                            <Text style={styles.infoValue}>
                                {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                            </Text>
                            
                            <Text style={styles.infoLabel}>Updated At:</Text>
                            <Text style={styles.infoValue}>
                                {selectedUser?.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : 'N/A'}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setInfoModalVisible(false)} 
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    addButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    userCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userDetails: {
        color: '#666',
        marginBottom: 3,
    },
    userEmail: {
        color: '#3498db',
        marginBottom: 3,
    },
    userCreated: {
        color: '#999',
        fontSize: 12,
        marginBottom: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    updateButton: {
        backgroundColor: '#3498db',
    },
    infoButton: {
        backgroundColor: '#2ecc71',
    },
    actionText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    retryContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 10,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 5,
    },
    retryText: {
        marginLeft: 5,
        color: '#3498db',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2c3e50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: '#2ecc71',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    infoContainer: {
        marginBottom: 15,
    },
    infoLabel: {
        fontWeight: 'bold',
        marginTop: 8,
        color: '#2c3e50',
    },
    infoValue: {
        color: '#666',
    },
});

export default Profile;