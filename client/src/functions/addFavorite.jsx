import Axios from "axios"
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

function addFavorite(user_id, recipe_object, callListFavorites) {
    // body : object of data being sent to backend endpoint
    const body = {
        user_id: user_id,
        recipe_id: recipe_object.id,
        title: recipe_object.title,
        image: recipe_object.image
    }

    // Call backend's MongoDB 'createUsers' endpoint to create the user, backend sends "response" back ("response" pretty useless unless debugging)
    // Backend takes in "req.body", which is the name & email retrieved from Google
    Axios.put(`${BACKEND_API_DOMAIN}/users/addFavorite`, body)
        .then((response) => {
            callListFavorites()
            console.log("Add favorite api call repsonse: " + response)
        }).catch((error) => {
            console.error('Error adding favorite:', error)
          })
    }


export default addFavorite