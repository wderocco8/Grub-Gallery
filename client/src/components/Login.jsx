// import { jwtDecode } from 'jwt-decode';
import { signInWithGoogle, handleSignOut } from "../Firebase"
import Axios from 'axios'
import checkmark from "../assets/checkmark.png"
import foodsafety from "../assets/food-safety.png"
const BACKEND_API_DOMAIN = import.meta.env.VITE_BACKEND_API_DOMAIN

function Login({ isAuthenticated }) {

    // handleSignIn : calls signInWithGoogle function from Firebase.js and sends user to backend
    const handleSignIn = async () => {
        try {
            // if google auth fails (jump to error catch)
            const { result } = await signInWithGoogle();
            if (result) {
                // body: object of data being sent to backend endpoint
                const body = {
                    name: result.displayName,
                    email: result.email,
                    user_id: result.uid
                };


                // Call backend's MongoDB 'createUsers' endpoint to create the user
                Axios.post(`${BACKEND_API_DOMAIN}/users/createUser`, body)
                    .then((response) => {
                        console.log("Create User API call response: ", response);
                    })
                    .catch((error) => {
                        console.log("Error making Axios post request:", error);
                    });
            }

        } catch (error) {
            console.log("Error handling sign in:", error);
        }
    };


    return (
        // center entire div on screen
        <div className='flex justify-center items-center h-screen'>

            <div className="flex justify-center items-center gap-[150px]">
                {/* Column 1 */}
                <div className='flex flex-col gap-[30px] items-center mr-auto'>
                    <img src={foodsafety} className="max-w-[250px]" />


                    {/* Main Content */}
                    <h1 className="text-[34px] font-semibold">Find healthy and trusted recipes</h1>

                    {/* Checkmarks and Text */}
                    <div className="flex flex-col gap-[20px] text-[24px]">
                        <div className="flex items-center mb-4">
                            <img src={checkmark} className="h-8 pr-5" />
                            <h1>Find your favorite meals and recipes</h1>
                        </div>
                        <div className="flex items-center mb-4">
                            <img src={checkmark} className="h-8 pr-5" />
                            <h1>Filter suggestions for allergens, macros...</h1>
                        </div>
                        <div className="flex items-center">
                            <img src={checkmark} className="h-8 pr-5" />
                            <h1>
                                Instantly save recipes with{' '}
                                <a href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noopener noreferrer" className="underline">
                                    Google Calendar
                                </a>
                            </h1>
                        </div>
                    </div>

                </div>


                {/* Column 2 */}
                <div className="flex justify-center items-center box-border h-[500px] w-[600px] min-w-[400px] rounded-3xl bg-[#B28370] boxShadow">
                    {/* Sign Out Button */}
                    {isAuthenticated ?
                        <button className="google-btn w-60 " onClick={handleSignOut}>
                            Sign Out
                        </button>
                        :
                        <div className='flex flex-col gap-[50px] text-white'>
                            <div className='flex flex-col gap-[20px] mt-[80px] ml-[50px] mr-[50px]'>
                                <h1 className="text-[40px] font-semibold">Sign up or log in</h1>
                                <p className="text-[20px]">Login below to start utilizing GrubGallery’s advanced features (e.g. Google Calendar, personalized meal suggestions...)</p>
                            </div>

                            <button className="google-btn mb-4 md:mb-0 ml-auto mr-auto" onClick={handleSignIn}>
                                Sign in with Google
                            </button>
                        </div>
                    }
                </div>

            </div>
        </div>

    )
}

export default Login