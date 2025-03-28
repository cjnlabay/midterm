import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, StyleSheet, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { handleLogout } from './Logout';

const screenWidth = Dimensions.get("window").width;

export default function NavigationBar() {
  const [modalVisible, setModalVisible] = useState(false);

  const onLogout = async () => {
    setModalVisible(false);
    await handleLogout();
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerRight: () => (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="log-out-outline" size={24} color="#588157" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={30} color="#588157" />
            ),
            tabBarLabel: 'Home',
            tabBarLabelStyle: { color: "#588157" }
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={30} color="#588157" />
            ),
            tabBarLabel: 'Profile',
            tabBarLabelStyle: { color: "#588157" }
          }}
        />
      </Tabs>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalButtonCancel} 
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalButtonLogout} 
                  onPress={onLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: 8,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalCard: {
    width: screenWidth * 0.85,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#588157',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#64748b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  modalButtonLogout: {
    flex: 1,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});