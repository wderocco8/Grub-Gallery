import food1 from "../assets/spaghetti.jpg"
import food2 from "../assets/food2.jpg"
import food3 from "../assets/food3.jpg"
import food4 from "../assets/food4.jpg"
import food5 from "../assets/food5.jpg"
import food6 from "../assets/food6.jpg"
import privacy from "../assets/privacy.png"
import Axios from "axios"
import { useNavigate } from 'react-router-dom'
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

function Home({ setBrowseMealsList }) {
  const navigate = useNavigate()

  // browseMeals : Perform the API request to find meals 
  const browseMeals = () => {
    // Once data is fetched, navigate to the "APIDataPage"
    try {
      Axios.post(`${BACKEND_API_DOMAIN}/search/browse`)
        .then(response => {
          const apiData = JSON.parse(response.data)
          // Pass the data as state to the "APIDataPage"
          const results = apiData.recipes

          // update browseMealsList
          setBrowseMealsList(results)

          // update localStorage with `browseMealsList` (aka `results`)
          localStorage.setItem('browseMealsList', JSON.stringify(results))

          navigate('/browse/display-results')
        })
    } catch (error) {
      console.log("Error fetching data from backend:", error)
    }
  }

  // viewPrivacyPolicy : routes to our privacy policy
  const viewPrivacyPolicy = () => {
    navigate('privacy-policy')
  }

  
  return (


    <div className="mt-[10%] ml-[40px] mr-[40px]">
  
        {/* creates outter grid for home, grids entries start from topleft to bottom right */}
        <div className="grid grid-cols-2 gap-[5%]">
  
          {/* column 1 */}
          <div className="col-span-1">
            {/* row 1 */}
            <h1 className="font-semibold" style={{ fontSize: '5.5rem' }}>Find. Plan. Eat.</h1>
            {/* row 2 */}
            <div className="text-lg py-6">
              <h2>Discover delectable dishes and seamlessly integrate them into your schedule with Google Calender integration. Elevate your dining experience effortlessly with the Grub Gallery.</h2>
            </div>
            {/* row 3 */}
            <button onClick={browseMeals} className="bg-gray-700 hover:bg-gray-900 text-white py-2 px-5 rounded">
              Browse Meals
            </button>
          </div>
  
  
          {/* column 2 (only 1 row) */}
          <div className="col-span-1">
            <div className="box-border max-w-[800px] rounded-3xl bg-[#B28370] boxShadow ml-auto">
              <div className="grid grid-cols-3 p-9 gap-12">
                <img src={food1} className="min-h-48 rounded-xl" />
                <img src={food2} className="min-h-48 rounded-xl" />
                <img src={food3} className="min-h-48 rounded-xl" />
                <img src={food4} className="min-h-48 rounded-xl" />
                <img src={food5} className="min-h-48 rounded-xl" />
                <img src={food6} className="min-h-48 rounded-xl" />
              </div>
            </div>
          </div>
  
        </div>
  
        <button className="absolute bottom-0 mb-[1rem]" onClick={viewPrivacyPolicy}>
          <div className="flex items-center gap-1">
            <img src={privacy} alt="Privacy Icon" className="h-[15px]" />
            Privacy Policy 
          </div>
        </button>
      </div>

  )
}

export default Home