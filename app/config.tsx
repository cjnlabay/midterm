const API_URL = __DEV__ 
  ? 'http://192.168.1.100:3000/api' // Replace with your actual local IP for device testing
  : 'http://localhost:3000/api'; // For emulator testing

export { API_URL };