import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyB1havR4MrdZJRy_Rd3E1Nj-KiNdcf5Dpo',
  authDomain: 'lsi-web-carbonemissionsp-7887c.firebaseapp.com',
  projectId: 'lsi-web-carbonemissionsp-7887c',
  storageBucket: 'lsi-web-carbonemissionsp-7887c.firebasestorage.app',
  messagingSenderId: '14197321247',
  appId: '1:14197321247:web:b282fb8f3c7a66ee39af2a',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)

export { app, auth, provider, signInWithPopup, signOut, db }
