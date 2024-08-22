import React from 'react';
import {useAuthStore} from "../../store/auth-store";
import axios from "axios";
import {usePlaybackStore} from "../../store/playback-store";
import './playlist.css';

const Playlist = (props) => {
    const token = useAuthStore(state => state.spotify_token);
    const setQueueUris = usePlaybackStore(state => state.setQueueUris);
    const currentPlaylist = usePlaybackStore(state => state.currentPlaylist);
    const setCurrentPlaylist = usePlaybackStore(state => state.setCurrentPlaylist);
    const style = 'playlist-item';
    const notFoundImage = "https://cdn.dribbble.com/userupload/8726277/file/still-90096ae0b20436af7d475737af5b86e5.gif?resize=400x0"

    const isSelected = () => {
        return currentPlaylist === props.id;
    }

    const getPlaylistTracks = async () => {
        axios.get(`https://api.spotify.com/v1/playlists/${props.id}?fields=tracks(items(track(uri)))`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
            const uris = getUris(res.data);
            setQueueUris(uris);
            setCurrentPlaylist(props.id);
        })
    }

    const getUris = (data) => {
        if (!data || !data.tracks || !data.tracks.items) return [];
        return data.tracks.items.map(item => item.track.uri);
    }

    return (
        <div key={props.id} className={isSelected() ? style + ' selected' : style} onClick={getPlaylistTracks}>
            <img
                src={props.images?.[0].url || notFoundImage}
                height={'180px'}
                width={'180px'}
                alt={props.name}
                style={{borderRadius: '10px'}}
            />
            <div className={'playlist-name'}>{props.name}</div>
        </div>
    );
};

export default Playlist;
