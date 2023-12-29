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
const firebase = require("firebase/app")
require("firebase/auth")
require("firebase/analytics")
const gapi = require('gapi-script')

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
const app = firebase.initializeApp(firebaseConfig)
const analytics = firebase.analytics()

// Initialize Firebase authentication
const auth = firebase.auth(app)

// function to signInWithGoogle (using Firebase authentication)
exports.signInWithGoogle = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("starting sign in...")

      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope(scope)
      const result = await firebase.auth().signInWithPopup(provider)

      const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result)
      const accessToken = credential.accessToken

      // Ensure the gapi.client is initialized
      await gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: scope
        })

        // Set the access token for authorization
        if (accessToken) {
          gapi.auth.setToken({
            access_token: accessToken
          })
        }
      })
      console.log("finished sign in...")
      // Resolve with gapi object
      resolve({ result: result.user, gapi })
    } catch (error) {
      console.log("Error authenticating with Google:", error)
      reject(error)
    }
  })
}

// function to sign out (with firebase authentication)
exports.handleSignOut = async () => {
  try {
    // IMPORTANT: if authenticated with google Calendar api --> sign out (prevents altering somebody else's google calendar)
    if (gapi.auth2 && gapi.auth2.getAuthInstance()) {
      await gapi.auth2.getAuthInstance().signOut()
    }
    // additionally, sign out with FIREBASE
    await auth.signOut()
    console.log("Successfully signed out")
  } catch (error) {
    console.log("Error signing out:", error)
  }
}
