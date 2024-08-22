import React from 'react';
import Button from "../../components/Button/button";
import './login.css';
import {loginUrl} from "../../service/spotify";


function Login() {

    return (
        <div className={'login-page-container'}>
            <div className={'main-form'}>
                <div className={'form-title text'}>
                    Raidio
                </div>
                {/*<div className={'form-title text'}>*/}
                {/*    {import.meta.env.MODE}*/}
                {/*</div>*/}
                <Button hrefUrl={loginUrl} text={"Login with Spotify"}/>
            </div>
        </div>
    );
}

export default Login;
