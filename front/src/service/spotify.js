export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = process.env.REACT_APP_FRONTEND_URL;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

const scopes = ["streaming", "user-read-email", "user-read-private"]

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export const getTokenFromUrl = () => {
    return window.location.hash
        .substring(1)
        .split("&")
        .reduce((initial, item) => {
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
};
