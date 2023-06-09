import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../AuthContext/AuthProvider'
import auth from '../Firebase/Firebase.init.config'

export const DBContext = createContext()

const UserDBProvider = ({ children }) => {
    const [user] = useAuthState(auth);
    const { UserSignOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || '/';
    // When auth user change his/her user_name, then AllUser's database will be also Update
    const UpdateDBUser = async (UserData) => {
        try {
            axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            const response = await axios.put(`https://tourist-booking-server.vercel.app/alluser/${user?.email}`, { UserData })
            if (response.status === 201) {
                toast.success(response.data.message)
                navigate(from, { replace: true })
            }
        } catch (error) {
            const errorStatus = [401, 403].includes(error.response.data.status);
            if (errorStatus) {
                UserSignOut()
            }
            else { toast.error(error.response.data.message) }
        }
    }
    const AddBooking = async (UserData) => {
        if (!user) {
            return toast("No User Logged In")
        }
        if (!UserData) {
            return toast("No Data Found")
        }
        try {
            axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            const response = await axios.post(`https://nature-world-server-site-tanjimulsabbir.vercel.app/booking/${user.email}`, { UserData })
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            const errorStatus = [401, 403].includes(error.response.data.status);
            if (errorStatus) {
                return UserSignOut()
            }
            else { toast.error(error.message) }
        }
    }

    // Booking Delete from Booking_Form
    const BookingDelete = async ({ id, title }) => {
        const conformDelete = window.confirm("Are you sure to Delete this Booking?");
        if (!conformDelete) {
            return toast('😍')
        }
        try {
            axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            const response = await axios.delete(`https://nature-world-server-site-tanjimulsabbir.vercel.app/booking/${user?.email}`,
                { data: { id: id } })
            if (response.status === 200) {
                toast.success(`${title} Deleted Successfully`);
                return <Navigate state={{ from: location }} replace />
            }
        } catch (error) {
            const errorStatus = [401, 403].includes(error.response.data.status);
            if (errorStatus) {
                return UserSignOut()
            }
            else { toast.error(error.response.data.message) }
        }
    }
    // Boooking Cart
    const BookingCart = async (AllBooking) => {
        const [isOpen, setIsOpen] = useState(false)
        let TotalItems = 0;
        const TotalPrice = await AllBooking?.reduce((total, product, i) => {
            const price = parseFloat(product.price.split('$')[1]);
            const quantity = parseFloat(product.Quantity);
            TotalItems = TotalItems + quantity
            const TotalPrice = total + price * quantity
            return TotalPrice;
        }, 0)

        return (
            <div className='dropdown drop-shadow dropdown-end z-50' onClick={() => setIsOpen(!isOpen)}>
                <label tabIndex={0} className="btn-circle shadow-lg cursor-pointer border-none">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span className="badge badge-sm indicator-item">{AllBooking?.length}</span>
                    </div>
                </label>

                <div tabIndex={0} className={`card dropdown-content text-black bg-green-600 shadow-2xl rounded-box w-64 ${isOpen ? "block" : "hidden"}`}>
                    <div className="card-body">
                        <h2 className="card-title font-lato font-bold">{AllBooking.length} {AllBooking.length > 1 && 'items' || 'item'}</h2>
                        <p className='font-openSans '>Your Total Amount is ${TotalPrice}.</p>
                        <p className='font-openSans '>You have Added to Cart {AllBooking.length} Product {AllBooking.length > 1 && 's'} and Total {TotalItems} Product Items.</p>
                    </div>
                </div>
            </div>
        )
    }
    const ProvidingFunction = { UpdateDBUser, BookingDelete, BookingCart, AddBooking }
    return (
        <DBContext.Provider value={ProvidingFunction}>
            {children}
        </DBContext.Provider>
    )
}

export default UserDBProvider