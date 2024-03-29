import { useEffect } from 'react'
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import handleRecipeClick from "../functions/handleRecipeClick"
import removeFavorite from "../functions/removeFavorite"
import listFavorites from "../functions/listFavorites"
import x_mark from '../assets/x_mark.png'
import defaultImage from '../assets/defaultRecipe.png'
import Loader from './Loader'

function Favorites({ user, favoritesList, setFavoritesList, isAuthenticated, setRecipe, isLoadingRecipe, setIsLoadingRecipe }) {
  const navigate = useNavigate()

  // Function to call listFavorites with the required parameters
  const callListFavorites = () => {
    listFavorites(user, isAuthenticated, setFavoritesList);
  }

  useEffect(() => {
    callListFavorites()
  }, [isAuthenticated])


  const favoritesDisplayList = favoritesList.map((element) => (
    <Grid key={element.recipe_id}>
      <Card>
        <img className="favoriteIcon" src={x_mark} onClick={() => removeFavorite(user, element, callListFavorites)} />
        <Link onClick={() => handleRecipeClick(element.recipe_id, setRecipe, navigate, setIsLoadingRecipe)}>
            {element.image ?
              <img className="recipeImage" src={element.image} alt={element.title} />
              :
              <img className="recipeImage" src={defaultImage} alt={element.title} />
            }
        </Link>
        {/* <button className="pl-14 pt-2" onClick={() => removeFavorite(user, element, callListFavorites)}>Remove from Favorites</button> */}

        <h4>{element.title}</h4>
      </Card>
    </Grid>
  ))

  if (isLoadingRecipe) return (<Loader/>)

  return (
    <div>
      <h1 className="text-5xl text-center pt-5"> Your Favorites </h1>
      <Grid>
        { /* console.log(favoritesList) */}
        {favoritesDisplayList}
      </Grid>
    </div >
  )
}

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

export default Favorites