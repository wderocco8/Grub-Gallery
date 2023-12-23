import Axios from "axios"
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

// handleRecipeClick : calls spoonacular api from backend `/search/recipe` endpoint and updates `recipe` object
const handleRecipeClick = async (id, setRecipe, navigate) => {
    console.log("getting recipe:", id)
    // Perform the API request using Axios (replace with your API endpoint)
    // Once data is fetched, navigate to the "APIDataPage"
    try {
      // Perform the API request using Axios (replace with your API endpoint)
      const response = await Axios.post(`${BACKEND_API_DOMAIN}/search/recipe`, { id: id })
      const apiData = response.data

      // Pass the data as state to the "APIDataPage"
      const parsedData = JSON.parse(apiData)

      // Use the setRecipe directly
      setRecipe(parsedData)

      // Update `recipe` (aka `parsedData`) in localStorage
      localStorage.setItem('recipe', JSON.stringify(parsedData))

      // Navigate to recipe page
      navigate('/recipe')
    } catch (error) {
      console.log("Error fetching data from backend:", error)
    }
  }

export default handleRecipeClick