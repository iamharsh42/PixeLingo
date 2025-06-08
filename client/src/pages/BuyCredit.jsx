import React,{useContext, useEffect} from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js';

const BuyCredit = () => {

  const{user, backendUrl, loadCreditsData, token, setShowLogin}=useContext(AppContext)

  const navigate = useNavigate()

  const initPay = async(order)=>{
       
  }

  // const paymentRazorpay = async(planId)=>{
  //         try{

  //           if(!user){
  //             setShowLogin(true)
  //           }

  //           const {data}=await axios.post(backendUrl + 'api/user/pay-razor', {planId},{headers:{token}})

  //           if(data.success){
  //             initPay(data.order)
  //           }

  //         }catch(error){
  //           toast.error(error.message)
  //         }
  // }

  
  // stripe integration

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

const handlePayment = async (amount) => {
  try {
    toast.info("Redirecting to Stripe...");

    const stripe = await stripePromise;

    const response = await axios.post(
      `${backendUrl}/api/payment/create-checkout-session`,
      { amount },
      {
        headers: { token }
      }
    );

    console.log("Stripe response:", response.data);

    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id
    });

    if (result.error) {
      toast.error(result.error.message);
    }
  } catch (err) {
    toast.error("Something went wrong!");
    console.error(err);
  }
};

// new code

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const amount = query.get('amount');

    if (sessionId && amount && user) {
      axios
        .post(`${backendUrl}/api/payment/verify-session`, { sessionId })
        .then((res) => {
          if (res.data.success && res.data.paymentStatus === "paid") {
            console.log("Calling addCredits with amount:", amount);
            return axios.post(
              `${backendUrl}/api/payment/add-credits`,
              { amount: Number(amount) },
              { headers: { token } }
            );
          } else {
            throw new Error("Payment not successful");
          }
        })
        .then((res) => {
          toast.success("Credits added successfully!");
          loadCreditsData(); // refresh credits in UI
          navigate('/buy', { replace: true }); // clean up URL
        })
        .catch((err) => {
          toast.error("Payment verification failed!");
          navigate('/buy', { replace: true });
        });
    }
  }, [user, backendUrl, token, loadCreditsData, navigate]);


  return (
    <motion.div 
     initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index)=>(
            <div key={index}
            className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'
            >
              <img width={100} src={assets.logo_icon}/>
              <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
              <p className='text-sm'>{item.desc}</p>
              <p className='mt-6'>
                <span className='text-3xl font-medium'>${item.price}</span> / {item.credits} credits</p>
                <button onClick={()=>{
                  handlePayment(item.price)
                }} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{user? 'Purchase':'Get Started'}</button>

            </div>
        ))}
      </div>
      
    </motion.div>
  )
}

export default BuyCredit
