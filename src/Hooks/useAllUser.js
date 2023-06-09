import axios from 'axios';
import { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { AuthContext } from '../Components/AuthContext/AuthProvider';
import auth from '../Components/Firebase/Firebase.init.config';



function useAllUser() {
    const [user] = useAuthState(auth);
    const { UserSignOut } = useContext(AuthContext)
    const { data: AllUser = [], refetch, isLoading, isError } = useQuery({
        queryKey: ['UserData',],
        queryFn: async () => {
            try {
                if (user) {
                    axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    const res = await axios.get(`https://nature-world-server-site-tanjimulsabbir.vercel.app/alluser/${user.email}`)
                    if (res.status === 200) {
                        return res.data.data
                    }
                }
            } catch (error) {
                const errorStatus = [401, 403].includes(error.response.data.status);
                if (errorStatus) {
                    UserSignOut()
                }
                else {
                    toast.error(error.response.data.message)
                }
            }

        }

    })

    return [AllUser, isLoading, isError, refetch]
}

export default useAllUser