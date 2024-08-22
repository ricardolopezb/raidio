import {useEffect, useState} from "react";
import SpotifyWebPlayer from "react-spotify-web-playback";
import {usePlaybackStore} from "../../store/playback-store";
import ShuffleButton from "../ShuffleButton/shuffle-button";
import {useRadioControlStore} from "../../store/radio-control-store";


const Player = (props) => {
        const songsBetweenRadio = 2;

        const queueUris = usePlaybackStore(state => state.queueUris);
        const setQueueUris = usePlaybackStore(state => state.setQueueUris);
        const setRadioStatus = useRadioControlStore(state => state.setRadioStatus);

        const [play, setPlay] = useState(false);
        const [player, setPlayer] = useState(null);
        const [currentTrack, setCurrentTrack] = useState({id: '', name: '', artists: [{name: ''}]});
        const [songsUntilRadio, setSongsUntilRadio] = useState(songsBetweenRadio);
        const [radioToPlay, setRadioToPlay] = useState(null);
        const [playbackState, setPlaybackState] = useState(null);
        const [isRadioPlaying, setIsRadioPlaying] = useState(false);


        const playRadio = (currentUri) => {
            if (radioToPlay) {
                setIsRadioPlaying(true);
                player.pause().then(() => {
                    radioToPlay.addEventListener('ended', () => {
                        setIsRadioPlaying(false);
                        setRadioToPlay(null)
                        setPlay(true);
                        setRadioStatus("IDLE")
                    })

                    radioToPlay.play()
                    setRadioStatus("PLAYING")
                    const indexOfCurrentUri = queueUris.indexOf(currentUri);
                    setQueueUris(queueUris.slice(indexOfCurrentUri - 1))
                })
            }
        }

        const preloadRadio = async (songName, artistName) => {
            console.log("Preloading radio for: ", songName, artistName)
            setRadioStatus("LOADING")
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/ai?songName=${encodeURIComponent(songName)}&artistName=${encodeURIComponent(artistName)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                setRadioToPlay(new Audio(audioUrl))
                console.log("Next Radio ready to play!")
                setRadioStatus("READY")

            } catch (error) {
                console.error('Error preloading audio:', error);
                setRadioStatus("ERROR")
            }
        }


        const handleSongChange = () => {
            if (!playbackState) return;
            if (currentTrack.id === playbackState.track_window.current_track.id) return;

            setCurrentTrack(playbackState.track_window.current_track);
            const nextTrack = playbackState.track_window.next_tracks[0];
            if (songsUntilRadio === 0) {
                console.log("Radio time!")
                setSongsUntilRadio(songsBetweenRadio);
                playRadio(nextTrack.uri);
            } else if (songsUntilRadio === 1) {
                const songName = nextTrack.name
                const artistName = nextTrack.artists[0].name
                preloadRadio(songName, artistName);
                setSongsUntilRadio(prevValue => prevValue - 1);
            } else {
                setSongsUntilRadio(prevValue => prevValue - 1);
            }

        }

        useEffect(() => {
            if (queueUris.length > 0 && !isRadioPlaying && player)
                setPlay(true);
        }, [queueUris]);

        useEffect(() => {
            handleSongChange()
        }, [playbackState]);

        useEffect(() => {
            if (player) player.addListener('player_state_changed', setPlaybackState);
        }, [player]);


        return (
            <div style={{position: 'sticky', top: '100%'}}>
                {!isRadioPlaying && (<><SpotifyWebPlayer
                        token={props.token}
                        components={{
                            rightButton: (
                                <ShuffleButton/>
                            )
                        }}
                        getPlayer={player => setPlayer(player)}
                        play={play}
                        uris={queueUris}
                        styles={{
                            activeColor: '#fff',
                            bgColor: '#333',
                            color: '#fff',
                            loaderColor: '#fff',
                            sliderColor: '#1cb954',
                            trackArtistColor: '#ccc',
                            trackNameColor: '#fff',
                            height: 100,
                        }}
                    />
                    </>
                )}
            </div>

        );
    }
;

export default Player;
