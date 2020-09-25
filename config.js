import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyAv8_5ELjzn-tRA4PxH9I-QVrumrhzVnZA",
  authDomain: "virtual-plasma-donor-ban-8cbe0.firebaseapp.com",
  databaseURL: "https://virtual-plasma-donor-ban-8cbe0.firebaseio.com",
  projectId: "virtual-plasma-donor-ban-8cbe0",
  storageBucket: "virtual-plasma-donor-ban-8cbe0.appspot.com",
  messagingSenderId: "835605150301",
  appId: "1:835605150301:web:81bf7a6599113a6cbbabb4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
