import Axios from 'axios'
import { useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN



function UpdateProfile({ isAuthenticated, restrictionsList, setRestrictionsList }) {
    // exclusion : used to keep track of the specific `exclusion` the user is targeting in the form
    const [exclusion, setExclusion] = useState('')
    // exclusionValue : used to keep track of the specific `exclusion` the user is targeting in the form
    const [exclusionValue, setExclusionValue] = useState('')
    // exclusionValuesMap : used to keep track of possible values based on which exclusion has been selected
    const [exclusionValuesMap, setExclusionValuesMap] = useState([])

    // specification : used to keep track of the specific `specification` the user is targeting in the form
    const [specification, setSpecification] = useState('')

    // exclusionMap : hashmap of all exclusion-value pairings
    const exclusionMap = {
        "diet" : ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP', 'Whole30'],
        "intolerances" : ['Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'],
        "cuisine" : ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],
        "excludeCusine" : ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],
        "maxReadyTime" : [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]        // values in minutes
    }

    // Mapping exclusionMap keys to an array of MenuItem objects
    const exclusionMenuItems = Object.keys(exclusionMap).map((key) => (
        <MenuItem key={key} value={key}>
            {key}
        </MenuItem>
    ))

    
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
    }
    // update `exclusionValue` onClick
    const handleExclusionValueChange = (event) => {
        setExclusionValue(event.target.value)
    }

    // update `specification` onClick
    const handleSpecificationChange = (event) => {
        setSpecification(event.target.value)
    }

    const addRestriction = (event) => {

    }
    return (
        // center entire div on screen
        <div className='flex items-center h-screen'>

            <div className="flex justify-center items-center gap-[150px]">


                {/* Column 1 */}
                <div className="flex justify-center box-border h-[500px] w-[420px] min-w-[400px] rounded-3xl bg-[#B28370] text-white boxShadow">
                    <h1 className="text-[40px] mt-[20px] font-semibold">Your Restrictions</h1>
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

                        <button onClick={addRestriction} className="bg-gray-700 hover:bg-gray-900 text-white px-5 h-[55px] rounded">
                            Add Exclusion
                        </button>
                    </div>

                    {/* Specifications form */}

                </div>

            </div>
        </div>

    )
}

export default UpdateProfile