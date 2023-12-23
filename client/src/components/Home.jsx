import food1 from "../assets/spaghetti.jpg"
import food2 from "../assets/food2.jpg"
import food3 from "../assets/food3.jpg"
import food4 from "../assets/food4.jpg"
import food5 from "../assets/food5.jpg"
import food6 from "../assets/food6.jpg"
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
    <div className="flex flex-col">

      <div className="grid grid-cols-2 gap-y-6 relative top-[150px] mr-[50px]"> {/* creates outter grid for home, grids entries start from topleft to bottom right */}

        {/* first outter grid entry */}
        <h1 className="text-8xl font-semibold px-10">Find. Plan. Eat.</h1>
        <div className="row-span-4">

          {/* second outter grid entry */}
          <div className="box-border h-[500px] w-[800px] rounded-3xl bg-[#B28370] boxShadow ml-auto mr-[20px]">
            <div className="grid grid-cols-3 p-9 gap-12">
              <img src={food1} className="h-48 rounded-xl" />
              <img src={food2} className="h-48 rounded-xl" />
              <img src={food3} className="h-48 rounded-xl" />
              <img src={food4} className="h-48 rounded-xl" />
              <img src={food5} className="h-48 rounded-xl" />
              <img src={food6} className="h-48 rounded-xl" />
            </div>
          </div>
        </div>

        {/* third outter grid entry */}
        <div className="px-10 text-lg py-6">
          <h2>Discover delectable dishes and seamlessly integrate them into your schedule with Google Calender integration. Elevate your dining experience effortlessly with the Grub Gallery.</h2>
        </div>

        {/* fourth outter grid entry */}
        <div className="px-10">
          <button onClick={browseMeals} className="bg-gray-700 hover:bg-gray-900 text-white py-2 px-5 rounded">
            Browse Meals
          </button>
        </div>
      </div>

      {/* NOTE: this is hard-coded for now -> will eventually modify this entire component to make it dynamic... */}
      <button className="mt-[170px] mr-auto ml-[40px]" onClick={viewPrivacyPolicy}>Privacy Policy</button>

    </div>
  )
}

export default Home