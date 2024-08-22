//TODO: Refactor server (a lot)

const express = require('express')
const request = require("request");
const port = 5000

var app = express();
const cors = require('cors');
const axios = require("axios");
app.use(cors());


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

