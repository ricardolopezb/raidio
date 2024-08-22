import React from 'react';
import './logout-button.css';
import {useAuthStore} from "../../store/auth-store";

const LogoutButton = () => {
    const setToken = useAuthStore(state => state.setToken);

    const handleLogout = () => {
        setToken('');
    }

    return (
        <div className={'logout-button'} onClick={handleLogout}>Log out</div>
    );
};

export default LogoutButton;
