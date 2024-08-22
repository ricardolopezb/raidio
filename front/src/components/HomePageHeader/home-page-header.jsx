import React from "react";
import './home-page-header.css';
import LogoutButton from "../LogoutButton/logout-button";
import {useRadioControlStore} from "../../store/radio-control-store";

const HomePageHeader = () => {
    const radioStatus = useRadioControlStore(state => state.radioStatus);

    return (
        <div className={'home-page-header'}>
            <div className={'title'}>Playlists</div>
            <div className={'status-info'}>Raidio Status: {radioStatus}</div>
            <LogoutButton/>
        </div>
    )
}

export default HomePageHeader;
