import React, {useEffect} from 'react';
import Home from './pages/Home/home'
import Login from './pages/Login/login'
import {useAuthStore} from "./store/auth-store";
import {getTokenFromUrl} from "./service/spotify";

function App() {
    const token = useAuthStore(state => state.spotify_token);
    const setToken = useAuthStore(state => state.setToken);

    useEffect(() => {
        const hash = getTokenFromUrl();
        window.location.hash = "";
        const receivedToken = hash.access_token;

        if (receivedToken) {
            setToken(receivedToken);
        }
    }, []);

    useEffect(() => {
    }, [token])

    return (
        <>
            {(token === '') ? <Login/> : <Home token={token}/>}
        </>
    );
}

export default App;
