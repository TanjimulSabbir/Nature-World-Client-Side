import axios from 'axios';
import React, { useContext } from 'react'
import { useAuthState, } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { AuthContext } from '../../Components/AuthContext/AuthProvider';
import auth from '../../Components/Firebase/Firebase.init.config';
import PageLoading from '../../Components/Shared/Loading/Loading';
import useAllUser from '../../Hooks/useAllUser';


const AllUser = () => {
    const [user] = useAuthState(auth);
    const [AllUser, isLoading, refetch] = useAllUser();
    const { UserSignOut } = useContext(AuthContext);

    const handleDelete = async (email) => {
        const confirmDelete = window.confirm('Are you want to Delete this user?')
        try {
            if (!confirmDelete) {
                return;
            }
            axios.defaults.headers.common['authorization'] =
                `Bearer ${localStorage.getItem('accessToken')}`;
            const res = await axios.delete(`https://nature-world-server-site-tanjimulsabbir.vercel.app/alluser/${user?.email}`, { data: { email } });
            if (res.status === 200) {
                toast.success(res.data.message)
                return refetch();
            }
        } catch (error) {
            const errorStatus = [401, 403].includes(error.response.data.status);
            if (errorStatus) {
                UserSignOut()
            }
            else { toast.error(error.response.data.message) }
        }

    }
    if (isLoading) {
        return <PageLoading></PageLoading>
    }

    if (!AllUser?.length) {
        return <h1 className='h-screen font-diplayFair font-bold bg-blue-200 flex justify-center items-center'>No User Found</h1>
    }
    return (
        <div className='py-10'>
            <div className="mx-10 mid-lg:mx-0">
                <h1 className='headingM pb-4 text-black'>All User</h1>
                <table className="table overflow-x-auto w-full border rounded-lg">
                    <thead>
                        <tr>
                            <td className='font-bold'>Serial</td>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    {
                        AllUser && AllUser.map(((User, index) => {
                            const ActiveUser = <div className="indicator">
                                <span className="indicator-item w-2 h-2 bg-green-500 rounded-full">
                                </span>
                                <div className="grid bg-gray-100 shadow-2xl place-items-center px-3 
                                rounded">{User.email}</div>
                            </div>
                            return (<tbody>
                                <tr>
                                    <td className='border-b font-bold'>{index + 1}</td>
                                    <td className='border-b'>{User.name}</td>
                                    <td className='border-b'>
                                        {User.email === user?.email ? ActiveUser : User.email}</td>
                                    <td className='border-b' onClick={() => handleDelete(User?.email)}>
                                        <button className='btn btn-sm bg-red-600 text-black border-none'>Delete</button></td>
                                </tr>
                            </tbody>)
                        }))
                    }
                </table>
            </div>
        </div>
    )
}

export default AllUser