import Axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import listRestrictions from '../functions/listRestrictions'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

function UpdateProfile({ user, isAuthenticated, restrictions, setRestrictions }) {
    // restrictionChips : array of chips for each restriction (updated w/ `restricitons`)
    const [restrictionChips, setRestrictionChips] = useState([])

    // Mapping exclusionMap keys to an array of MenuItem objects
    const [exclusionMenuItems, setExclusionMenuItems] = useState([])

    // update `restrictionChips` each time `restrictions` changes
    useEffect(() => {
        // set restriciton Chips
        setRestrictionChips(Object.keys(restrictions).flatMap((key) => {
            const values = restrictions[key]
            // ensure that values is a non-empty array
            if (Array.isArray(values) && values.length > 0) {
            return values.map((value, index) => (
                <Chip
                    key={key + value}
                    label={`${key} : ${value}`}
                    onDelete={() => removeRestriction(key, value)}
                    style={{ backgroundColor: '#E1E1E1' }}
                />
            ))
            
            } else {
                return []
            }
        }
        ))

        // set menu items for exclusions
        setExclusionMenuItems(Object.keys(exclusionMap).map((key) => {
            // maxReadyTime exception (can only have 1)
            if (isAuthenticated && !(key == "maxReadyTime" && restrictions.maxReadyTime.length > 0)) {
                return (
                    <MenuItem key={key} value={key}>
                        {key}
                    </MenuItem>
                )
            } else {
                return null
            }
        }))

    }, [restrictions])

    // exclusion : used to keep track of the specific `exclusion` the user is targeting in the form
    const [exclusion, setExclusion] = useState('')
    // exclusionValue : used to keep track of the specific `exclusion` the user is targeting in the form
    const [exclusionValue, setExclusionValue] = useState('')
    // exclusionValuesMap : used to keep track of possible values based on which exclusion has been selected
    const [exclusionValuesMap, setExclusionValuesMap] = useState([])
    
    // specification : used to keep track of the specific `specification` the user is targeting in the form
    const [specification, setSpecification] = useState('')
    // specificationValue : used to keep track of the specific `specification` the user is targeting in the form
    const [specificationValue, setSpecificationValue] = useState('')

    // exclusionMap : hashmap of all exclusion-value pairings
    const exclusionMap = {
        "diet" : ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP', 'Whole30'],
        "intolerances" : ['Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'],
        "cuisine" : ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],
        "excludeCuisine" : ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],
        "maxReadyTime" : [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]        // values in minutes
    }

    
    // update `exclusion` onClick
    const handleExclusionChange = (event) => {
        const exclusionKey = event.target.value
        setExclusion(exclusionKey)
        setExclusionValue('')
        setExclusionValuesMap(exclusionMap[exclusionKey]?.map((key) => (
            <MenuItem key={key} value={key}>
                {key}
            </MenuItem>
        )))
        // TO BE COMPLETED : method for settng exclusionValues that only are not already covered (slightly broken code)
        // setExclusionValuesMap(exclusionMap[exclusionKey]?.map((key) => {
        //     if (!restrictions[exclusionKey].includes(key)) {
        //         return (
        //             <MenuItem key={key} value={key}>
        //                 {key}
        //             </MenuItem>
        //         )
        //     } else {
        //         return null
        //     }
        // }))
    }
    // update `exclusionValue` onClick
    const handleExclusionValueChange = (event) => {
        setExclusionValue(event.target.value)
    }

    // update `specification` onClick
    const handleSpecificationChange = (event) => {
        setSpecification(event.target.value)
    }

    // addRestriction : takes in `isExclusion=true` if we are adding an exclusion .... makes backend request
    const addRestriction = (isExclusion) => {
        try {
            // error handling : if form not filled properly
            if (isExclusion && !(exclusion && exclusionValue)) {
                alert("Please select both `exclusion` and `selections`!")
                return
            } else if (!isExclusion && !(specification && specificationValue)) {
                alert("Please select both `specification` and `selections`!")
                return
            }

            // body : object of data being sent to backend endpoint
            const body = {
                user_id: user.uid,
                restriction: isExclusion ? exclusion : specification,
                value: isExclusion ? exclusionValue : specificationValue
            }

            Axios.put(`${BACKEND_API_DOMAIN}/users/addRestriction`, body)
                .then((response) => {
                    // call listRestrictions to ensure the `restrictions` state is up-to-date with database
                    listRestrictions(user, isAuthenticated, setRestrictions)

                    // update variables
                    if (isExclusion) {
                        setExclusion('')
                        setExclusionValue('')
                    } else {
                        setSpecification('')
                        setSpecificationValue('')
                    }
                    console.log("Add restriction api call repsonse: " + response)
                }).catch((error) => {
                    console.error('Error adding restriction:', error)
                })
        } catch (error) {
            console.error('Error updating restrictions in backend:', error)
        }
    }

    // addRestriction : takes in `isExclusion=true` if we are adding an exclusion .... makes backend request
    const removeRestriction = (restriction, value) => {
        try {
            console.log("clicked", restriction, value)
            // body : object of data being sent to backend endpoint
            const body = {
                params: {
                    user_id: user.uid,
                    restriction: restriction,
                    value: value
                }
            }

            Axios.delete(`${BACKEND_API_DOMAIN}/users/removeRestriction`, body)
                .then((response) => {
                    // call listRestrictions to ensure the `restrictions` state is up-to-date with database
                    listRestrictions(user, isAuthenticated, setRestrictions)

                    console.log("Remove restriction api call repsonse: " + response)
                }).catch((error) => {
                    console.error('Error adding restriction:', error)
                })
        } catch (error) {
            console.error('Error updating restrictions in backend:', error)
        }
    }
    
    return (
        // center entire div on screen
        <div className='flex items-center h-screen'>
            {isAuthenticated ? 
                <div className="flex justify-center items-center gap-[150px]">


                    {/* Column 1 */}
                    <div className="flex flex-col items-center gap-[20px] box-border overflow-auto min-h-[400px] max-h-[401px] w-[420px] min-w-[400px] ml-[50px] rounded-3xl bg-[#B28370] text-white boxShadow">
                        <h1 className="text-[40px] mt-[20px] font-semibold">Your Restrictions</h1>
                        {/* Restrictions chips */}
                        <div className='relative z-10 flex justify-center flex-wrap gap-[5px] mb-[20px]' >
                            {restrictionChips}
                        </div>

                    </div>

                    {/* Column 2 */}
                    <div className='flex flex-col gap-[30px] items-left'>
                        {/* Exclusions form */}
                        <h1 className="text-[30px] mt-[20px] font-semibold">Exlusions:</h1>
                        <div className='flex items-center'>
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="select-exclusion-key">exclusion</InputLabel>
                                <Select
                                    labelId="select-exclusion-key-label"
                                    id="select-exclusion-key"
                                    value={exclusion}
                                    onChange={handleExclusionChange}
                                    autoWidth
                                    label="exclusion"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {exclusionMenuItems}
                                </Select>
                            </FormControl>
                            
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="select-exclusion-value">selections</InputLabel>
                                <Select
                                    labelId="select-exclusion-value-label"
                                    id="select-exclusion-value"
                                    value={exclusionValue}
                                    onChange={handleExclusionValueChange}
                                    autoWidth
                                    label="exclusionValue"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {exclusionValuesMap}
                                </Select>
                            </FormControl>

                            <button onClick={() => addRestriction(true)} className="bg-gray-700 hover:bg-gray-900 text-white px-5 h-[55px] rounded">
                                Add Exclusion
                            </button>
                        </div>

                        {/* Specifications form (TO BE COMPLETED) */}

                    </div>

                </div>
                : 
                <div className='flex flex-col items-center mt-[200px] mb-auto ml-auto mr-auto'>
                    <h1 className="text-[40px] mt-[20px] font-semibold">Please login to edit your profile!</h1>
                    <Link to={'/login'} className="flex items-center justify-center bg-gray-700 hover:bg-gray-900 text-white h-[40px] w-[100px] rounded">
                        Login
                    </Link>
                </div>
            }

        </div>

    )
}

export default UpdateProfile