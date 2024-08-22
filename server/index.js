//TODO: Refactor server (a lot)


const express = require('express')
const request = require("request");
const port = 5000

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var app = express();
const cors = require('cors');
const axios = require("axios");
app.use(cors());
global.access_token = ''

app.get('/auth/login', (req, res) => {
    console.log('login')
    var scope = "streaming \
               user-read-email \
               user-read-private"

    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: process.env.BACKEND_URL + "/auth/callback",
        state: state
    })
    console.log("SENDING PARAMMSSS", {
        frontUrl: process.env.BACKEND_URL,
        auth_query_parameters: auth_query_parameters.toString()
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());

});

app.get('/auth/callback', (req, res) => {
    console.log('callback')
    var code = req.query.code;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: `${process.env.BACKEND_URL}/auth/callback`,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            global.access_token = body.access_token;
            res.redirect(`${process.env.FRONTEND_URL}/`)
        }
    });
});

app.get('/auth/token', (req, res) => {
    res.json(
        {
            access_token: global.access_token
        })
})


app.get('/ai', async (req, res) => {
    console.log(
        {
            received: {
                name: req.query.songName,
                artist: req.query.artistName
            }
        }
    )
    const songIntro = await getSongIntro(req.query.songName, req.query.artistName)
    console.log(songIntro)
    const songSpeech = await getSongSpeech(songIntro)
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');

    // Stream the audio data directly to the response
    res.send(songSpeech.data);


})


const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const getSongIntro = (songName, artistName) => {
    return axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        data: {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.',
                },
                {
                    role: 'user',
                    //content: `Give me a very short informative intro of the song and a also short fun fact about "${songName}" by ${artistName}, and end your speech with "This is ${songName}, by ${artistName}"`,
                    content: `Dame una muy, muy breve introducción informativa sobre la canción "${songName}" de ${artistName}, e incluye también un dato curioso corto. Termina tu discurso con "Esta es ${songName}, de ${artistName}"."`,
                },
            ],
        },
    }).then((res) => {
        return res.data.choices[0].message.content
    })
};

const getSongSpeech = async (songIntro) => {
    return axios({
        method: 'post',
        url: 'https://api.openai.com/v1/audio/speech',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        data: {
            model: 'tts-1',
            input: songIntro,
            voice: 'onyx',
            speed: '1.2'
        },
        responseType: 'arraybuffer',
    })
}


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

