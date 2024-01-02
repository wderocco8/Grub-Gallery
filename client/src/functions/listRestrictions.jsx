import Axios from "axios"
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

function listRestrictions(user, isAuthenticated, setRestrictions) {
    // only run get request if user is authenticated
    if (isAuthenticated) {
        // Send "get" request using Axios to the backend and sets favoritesList to its data returned back
        Axios.get(`${BACKEND_API_DOMAIN}/users/getRestrictions`,
          {
            params: {
              user_id: user.uid
            }
          })
          .then((response) => {
            console.log("getting restrictions", response)
  
            // Need to get favorites
            setRestrictions(response.data.dietary_restrict)
          })
          .catch((error) => {
            console.error('Error fetching restrictions:', error)
          })
      }
  }

export default listRestrictions