import styled from "styled-components"
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import handleRecipeClick from "../functions/handleRecipeClick"
import addFavorite from "../functions/addFavorite"
import removeFavorite from "../functions/removeFavorite"
import listFavorites from "../functions/listFavorites"
import favorite from '../assets/addFavorite.png'
import unFavorite from '../assets/removeFavorite.png'
import defaultImage from '../assets/defaultRecipe.png'
import Loader from "./Loader"

function DisplayResults({ user, mealsList, setRecipe, isAuthenticated, favoritesList, setFavoritesList, isLoadingMeals, isLoadingRecipe, setIsLoadingRecipe }) {

  // navigate : redirect to other pages (react-router-dom function)
  const navigate = useNavigate()

  // Function to call listFavorites with the required parameters
  const callListFavorites = () => {
    listFavorites(user, isAuthenticated, setFavoritesList);
  }

  // mealsList : state variable to map meals to elements rendered on the page
  const [displayMealsList, setDisplayMealsList] = useState([])

  // useEffect : re-initialize `favoritesId` and `favoritesIdSet` every time `favoritesList` is changed
  useEffect(() => {
    // obtain list of favorites
    const favoritesId = favoritesList.map((element) => element.recipe_id)
    // convert to `set` (to increase look-up time effeciency)
    const favoritesIdSet = new Set(favoritesId)

    // update mealsList
    setDisplayMealsList(
      mealsList.map((element) => (
        //Sets a unique key based on the index for each div container
        <Grid key={element.id}>
          <Card>
            {isAuthenticated && (
              favoritesIdSet.has(String(element.id)) ?
                <img className="favoriteIcon" src={unFavorite} onClick={() => removeFavorite(user, { recipe_id: element.id }, callListFavorites)} />
                :

                <img className="favoriteIcon" src={favorite} onClick={() => addFavorite(user.uid, element, callListFavorites)} />
                )
              }

            <Link onClick={() => handleRecipeClick(element.id, setRecipe, navigate, setIsLoadingRecipe)}>
              {element.image ?
                <img className="recipeImage" src={element.image} alt={element.title} />
                :
                <img className="recipeImage" src={defaultImage} alt={element.title} />
              }
            </Link>

            <h4>{element.title}</h4>

          </Card>
        </Grid>
      ))
    )

    }, [favoritesList, mealsList, isAuthenticated])


  if (isLoadingMeals) return (<Loader/>)
  if (isLoadingRecipe) return (<Loader/>)

  return (
    <div className="flex items-center justify-center mt-20">
      {/* Displays the newly mapped list, which is just a bunch of div containers of information for each element */}
      {
        displayMealsList.length > 0
        ?
        <Grid>{displayMealsList}</Grid>
        :
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Oops, that didn't work</h1>
            <h4 className="text-lg">Try entering a different query, or edit some of your restrictions!</h4>
          </div>
        </div>

      }
    </div>
  )
}

// template strings below used for styling custom divs

const Card = styled.div`
  min-height: 20rem;
  border-radius: 2rem;
  // overflow: hidden;
  .recipeImage {
    border-radius: 2rem;
    box-shadow: 4px 8px 10px rgba(0, 0, 0, 0.4);
    z-index: 10;

    height: 60%;
    width: 100%;
    max-height: 100%; /* Ensure the image doesn't exceed the container height */

    &:hover {
      transform: scale(0.98);
      filter: brightness(0.8)
    }
  }
  h4 {
    text-align: center;
    padding: 1rem;
    font-weight: 600;
  }

  .favoriteIcon {
    position: absolute;
    margin-top: -10px;
    margin-left: -10px;
    width: 30px;
    z-index: 1; /* Ensure the icon is on top */

    // backdrop-filter: blur(10px);
    // box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    // background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    // border-radius: 50%; /* Optional: to create a circular background */


    &:hover {
      cursor: pointer;
      transform: scale(1.2);
      filter: brightness(.95)
    }
  }
`

const Grid = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
grid-gap: 2rem;
margin: 0 auto; /* Center the grid horizontally */
max-width: 1200px; /* Set a maximum width for the grid */
margin-top: 20px; /* Adjust the value as needed */
`

export default DisplayResults

