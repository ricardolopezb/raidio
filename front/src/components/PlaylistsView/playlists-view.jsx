import React from 'react';
import {useGetUserPlaylists} from "../../hooks/useGetUserPlaylists";
import {useAuthStore} from "../../store/auth-store";
import Playlist from "../Playlist/playlist";
import './playlists-view.css';


export default function PlaylistsView() {
    const token = useAuthStore(state => state.spotify_token);
    const {data, loading} = useGetUserPlaylists(token);

    return (
        <div>
            {loading ? <h1>Loading...</h1> : (
                <div className={'playlist-grid'}>
                    {data?.items.map((playlist) => (
                        <Playlist key={playlist.id} id={playlist.id} name={playlist.name} images={playlist.images}/>
                    ))}
                </div>
            )}
        </div>
    )

}






