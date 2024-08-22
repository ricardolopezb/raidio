import {useEffect, useState} from "react";
import axios from "axios";
import {useAuthStore} from "../store/auth-store";

export const useGetUserPlaylists = (token) => {
    const setToken = useAuthStore(state => state.setToken);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data: response} = await axios.get(
                    'https://api.spotify.com/v1/me/playlists',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setData(response);
            } catch (error) {
                if(error.response.status === 401) {
                    setToken('');
                }
                console.error(error)
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return {data, loading};

}
