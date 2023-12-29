// Obtain Firebase config keys from .env
const apiKey = process.env.FIREBASE_API_KEY
const authDomain = process.env.FIREBASE_AUTH_DOMAIN
const projectId = process.env.FIREBASE_PROJECT_ID
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET
const messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID
const appId = process.env.FIREBASE_APP_ID
const measurementId = process.env.FIREBASE_MEASUREMENT_ID
// Obtain gapi scores from .env
const API_KEY = process.env.GAPI_KEY
const CLIENT_ID = process.env.CLIENT_ID
const scope = process.env.SCOPE

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase authentication
const auth = getAuth(app)

// function to signInWithGoogle (using Firebase authentication)
exports.signInWithGoogle = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // initialize google OAuth
      const provider = new firebase.auth.GoogleAuthProvider()
      // add appropriate scopes (for calendar api)
      provider.addScope(scope)
      // sign in with popup
      const result = await firebase.auth().signInWithPopup(provider)

      // Resolve with gapi object
      resolve({ result: result.user })
      // resolve({ result: result.user, gapi })
    } catch (error) {
      console.log("Error authenticating with Google:", error)
      reject(error)
    }
  })
}

// function to sign out (with firebase authentication)
exports.handleSignOut = async () => {
  try {
    
    // additionally, sign out with FIREBASE
    await auth.signOut()
    console.log("Successfully signed out")
  } catch (error) {
    console.log("Error signing out:", error)
  }
}
