import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dashboard from './components/Dashboard';

export default function Home() {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Dashboard container */}
      <View style={styles.dashboardContainer}>
        <Dashboard />
      </View>
      
      {/* Bottom navigation row */}
      <View style={styles.bottomRow}>
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.iconGroup}>
            <Icon name="people" size={24} color="#333" />
            <Icon name="list" size={16} color="#333" style={styles.smallIcon} />
          </View>
          <Text style={styles.iconText}>User list</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('file')}
        >
          <View style={styles.iconGroup}>
            <Icon name="folder" size={24} color="#333" />
            <Icon name="description" size={16} color="#333" style={styles.smallIcon} />
          </View>
          <Text style={styles.iconText}>File</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => navigation.navigate('image')}
        >
          <View style={styles.iconGroup}>
            <Icon name="image" size={24} color="#333" />
            <Icon name="collections" size={16} color="#333" style={styles.smallIcon} />
          </View>
          <Text style={styles.iconText}>Image</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={() => setShowLogoutModal(true)}
        >
          <View style={styles.iconGroup}>
            <Icon name="person" size={24} color="#333" />
            <Icon name="exit-to-app" size={16} color="#333" style={styles.smallIcon} />
          </View>
          <Text style={styles.iconText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.logoutCard}>
              <View style={styles.modalIconContainer}>
                <Icon name="exit-to-app" size={40} color="#e74c3c" />
              </View>
              <Text style={styles.logoutTitle}>Logout</Text>
              <Text style={styles.logoutMessage}>Are you sure you want to logout?</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.logoutButton]}
                  onPress={handleLogout}
                >
                  <Icon name="exit-to-app" size={18} color="#fff" />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dashboardContainer: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  iconContainer: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    width: '22%', // Adjusted for 4 items
  },
  iconGroup: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  smallIcon: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },
  iconText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  logoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  modalIconContainer: {
    marginBottom: 10,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  logoutMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});