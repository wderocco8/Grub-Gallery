import NavBar from './components/NavBar'
import Home from './components/Home'
import Login from './components/Login'
import UpdateProfile from './components/UpdateProfile'
import DisplayResults from './components/DisplayResults'
import Favorites from './components/Favorites'
import Schedule from './components/Schedule'
import PrivacyPolicy from './components/PrivacyPolicy'
import listRestrictions from './functions/listRestrictions'
import './index.css'
import Recipe from './components/Recipe'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { auth } from "./Firebase"

function App() {

  // assign state variables (keep track of meals lists, favorites lists, recipe, restrictions and user info)
  const [searchMealsList, setSearchMealsList] = useState([])
  const [browseMealsList, setBrowseMealsList] = useState([])
  const [recipe, setRecipe] = useState({})
  const [favoritesList, setFavoritesList] = useState([])
  const [restrictions, setRestrictions] = useState({})
  // const [ignoreRestrictions, setIgnoreRestrictions] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingMeals, setIsLoadingMeals] = useState(false)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)
  
  // use Firebase auth to detect if user is logged in
  const user = auth.currentUser

  useEffect(() => {
    // firebase function (check if authentication changes...)
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(user !== null) // update isAuthenticated based on if user signed in
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // check localStorage cache to see if `searchMealsList` has been saved
    const localStorageSearchMeals = localStorage.getItem('searchMealsList')
    if (localStorageSearchMeals) {
      // update `searchMealsList` state array
      setSearchMealsList(JSON.parse(localStorageSearchMeals))
    }

    // check localStorage cache to see if `browseMealsList` has been saved
    const localStorageBrowseMeals = localStorage.getItem('browseMealsList')
    if (localStorageBrowseMeals) {
      // update `browseMealsList` state array
      setBrowseMealsList(JSON.parse(localStorageBrowseMeals))
    }

    // check localStorage cache to see if `recipe` has been saved
    const localStorageRecipe = localStorage.getItem('recipe')
    if (localStorageRecipe) {
      // update `browseMealsList` state array
      setRecipe(JSON.parse(localStorageRecipe))
    }

    // check localStorage cache to see if `favorite` has been saved
    const localStorageFavorites = localStorage.getItem('favoritesList')
    if (localStorageFavorites) {
      // update `favoritesList` state array
      setFavoritesList(JSON.parse(localStorageFavorites))
    }
    
    // check mongoDB cluster for dietary restrictions on page refresh
    listRestrictions(user, isAuthenticated, setRestrictions)
    
  }, [isAuthenticated])

  return (
    <Router>
      {/* Will change searchMealsList depending on the search. Not a web-page so will be outside of <Routes> */}
      <NavBar restrictions={restrictions} setSearchMealsList={setSearchMealsList} user={user} isAuthenticated={isAuthenticated} setIsLoadingMeals={setIsLoadingMeals} />
      <Routes>
        <Route path='/' element={<Home restrictions={restrictions} setBrowseMealsList={setBrowseMealsList} isLoadingMeals={isLoadingMeals} setIsLoadingMeals={setIsLoadingMeals} />} />
        {/* Sets the route pathnames to X, to be used later when trying to route Y to the X's element. So X is used as a pathname to route to X's element */}
        <Route path='/login' element={<Login isAuthenticated={isAuthenticated} />} />
        <Route path='/update-profile' element={<UpdateProfile user={user} isAuthenticated={isAuthenticated} restrictions={restrictions} setRestrictions={setRestrictions} />} />
        <Route path='/browse/display-results' element={<DisplayResults user={user} mealsList={browseMealsList} setRecipe={setRecipe} isAuthenticated={isAuthenticated} favoritesList={favoritesList} setFavoritesList={setFavoritesList} isLoadingMeals={isLoadingMeals} isLoadingRecipe={isLoadingRecipe} setIsLoadingRecipe={setIsLoadingRecipe} />} />
        <Route path='/search/display-results' element={<DisplayResults user={user} mealsList={searchMealsList} setRecipe={setRecipe} isAuthenticated={isAuthenticated} favoritesList={favoritesList} setFavoritesList={setFavoritesList} isLoadingMeals={isLoadingMeals} isLoadingRecipe={isLoadingRecipe} setIsLoadingRecipe={setIsLoadingRecipe} />} />
        <Route path='/favorites' element={<Favorites user={user} favoritesList={favoritesList} setFavoritesList={setFavoritesList} isAuthenticated={isAuthenticated} setRecipe={setRecipe} isLoadingRecipe={isLoadingRecipe} setIsLoadingRecipe={setIsLoadingRecipe} />} />
        <Route path='/schedule' element={<Schedule />} />
        <Route path='/recipe' element={<Recipe recipe={recipe} isAuthenticated={isAuthenticated} user={user} favoritesList={favoritesList} setFavoritesList={setFavoritesList} />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  )
}

export default App