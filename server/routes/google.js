
const { signInWithGoogle, handleSignOut } = require("../Firebase")

// Note: this file exists to process Login/Logout/Google Calendar requests from the frontend
const express = require("express")
const router = express.Router()
const Axios = require('axios');
const cors = require('cors')



router.use(express.json())
router.use(cors())

// Endpoint for Calling the spoonacular api call for meals based on searchString from req.body
router.post("/signIn", async (req, res) => {
    try {
        // if google auth fails (jump to error catch)
        const { result } = await signInWithGoogle()

        if (result) {
            // body: object of data being sent to backend endpoint
            const body = {
                name: result.displayName,
                email: result.email,
                user_id: result.uid
            }

            // Call backend's MongoDB 'createUsers' endpoint to create the user
            const response = await Axios.post(`${BACKEND_API_DOMAIN}/users/createUser`, body)

            console.log("Create User API call response:", response.data)
            
            // Send a success response to the client
            res.status(200).json({ message: "User created successfully" })
        }
    } catch (error) {
        console.error("Error during signIn:", error)
        
        // Send an appropriate error response to the client
        res.status(500).json({ error: "Internal Server Error" })
    }
})

module.exports = router