import Axios from "axios"
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

async function removeFavorite(user, recipe, callListFavorites){
    Axios.delete(`${BACKEND_API_DOMAIN}/users/removeFavorite`, {
      params: {
        user_id: user.uid,
        recipe
      }
    })
    .then(() => {
      // only call `listFavorites` if on `favorites` page
      if (callListFavorites) {
        callListFavorites()
      }
      console.log("Removed from favorited recipes")
    })
    .catch((error) => {
      console.error('Error removing favorite:', error)
    })
  }


export default removeFavorite