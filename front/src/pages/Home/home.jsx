import React from 'react';
import Player from "../../components/Player/player";
import PlaylistsView from "../../components/PlaylistsView/playlists-view";
import './home.css';
import HomePageHeader from "../../components/HomePageHeader/home-page-header";

function Home(props) {

    return (
        <div className={'page-container'}>
            <div className={'page-body'}>
                <HomePageHeader/>
                <PlaylistsView/>
            </div>

            <Player token={props.token}/>
        </div>
    );

}

export default Home
