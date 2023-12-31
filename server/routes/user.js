const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');


// req is for sending data from the frontend to the backend (requesting data), and res is for sending data from the backend to the frontend (response data)
// async allows this function to run "UserModel.find()" independently of the other program, so no need to wait

// endpoint to obtain all users. Sends from backend to frontend all users, .get is for getting data
router.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Endpoint for creating a user. Will not create one if the user email already exists. .post is for posting new data
router.post("/createUser", async (req, res) => {
  const user = req.body
  console.log(user)
  const existUsername = await UserModel.findOne({ user_id: user.user_id })
  if (existUsername) {
    console.log("username exists")
  }
  else {
    const newUser = new UserModel(user)
    await newUser.save()
    console.log("new user")
  }
  res.json(user)
})

// endpoint to retrieve all of user's dietary restrictions
router.get("/getRestrictions", async (req, res) => {
  try {
    const userId = req.query.user_id // Use req.query to get parameters from the query string
    console.log("UserId is WTFFFF:", userId)
    const restrictions = await UserModel.findOne({ "user_id": userId }, { "dietary_restrict": 1, "_id": 0 })
    console.log("Restrictions:", JSON.stringify(restrictions, null, 2))
    res.status(200).json(restrictions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// endpoint to add dietary restriction to user
router.put("/addRestriction", async (req, res) => {
  try {
    const body = req.body;
  
    const result = await UserModel.findOneAndUpdate(
      { user_id: body.user_id },
      { 
        $addToSet: { 
          [`dietary_restrict.${body.restriction}`]: body.value // add value of restriction to list (use brackets to dynamically render the name)
        } 
      }, 
      { new: true } // Return the updated document
    )
  
    if (result) {
      res.json(result)
    } else {
      // Handle the case where the user is not found
      res.status(404).json({ error: "User not found. Error adding restriction." })
    }  
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// endpoint to remove dietary restriction from user
router.delete("/removeRestriction", async (req, res) => {
  const body = req.body
  try {
    const result = await UserModel.updateOne(
      { "user_id": body.user_id },
      {
        "$pull": {
          [`dietary_restrict.${body.restriction}`]: body.value
        }
      })
    res.send(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// endpoint to retrieve all of user's favorite recipes
router.get("/getFavorites", async (req, res) => {
  try {
    const user_id = req.query.user_id

    const user = await UserModel.findOne({ "user_id": user_id }, { "favorites": 1, "_id": 0 })
    
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const favorites =  user.favorites

    console.log("fav:", favorites)
    res.status(200).json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// endpoint to add recipe to user's favorites
router.put("/addFavorite", async (req, res) => {
  try {
    const body = req.body
    
    // Check if the recipe is already in favorites
    const isRecipeExists = await UserModel.exists({
      user_id: body.user_id,
      'favorites.recipe_id': body.recipe_id,
    })

    if (isRecipeExists) {
      return res.status(400).json({ message: 'Recipe already exists in favorites.' })
    }

    const result = await UserModel.findOneAndUpdate(
      { user_id: body.user_id },
      {
        $push: {
          favorites: {
            recipe_id: body.recipe_id,
            title: body.title,
            image: body.image,
          },
        },
      },
      { new: true } // This option returns the modified document
    )
  
    // Sends data back and ends request
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Endpoint to remove recipe from user's favorites .delete is for deleting existing data
router.delete("/removeFavorite", async (req, res) => {
  // console.log(req.query)
  try {
    const user_id = req.query.user_id
    const recipe = req.query.recipe

    const result = await UserModel.updateOne(
      { "user_id": user_id },
      {
        "$pull": {
          "favorites": {
            "recipe_id": recipe.recipe_id
          }
        }
      })
    res.send(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router