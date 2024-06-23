const { command , isPrivate , getBuffer, getJson, isUrl, extractUrlFromMessage } = require("../lib");
const fetch = require("node-fetch");
const ytdl = require("ytdl-core")
const { CAPTION } = require("../config");
const axios = require("axios");
const cheerio = require('cheerio')
const X = require("../config");
const { prepareWAMessageMedia } = require('@whiskeysockets/baileys')
const Spotify = require('spotifydl-core').default
const spotify = new Spotify({
    clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
    clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009',
})


command(
    {
        pattern: "song",
        fromMe: isPrivate,
        desc: "Song Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!match) return await message.sendMessage("*_Need Song Name Or Url_*");
var res = await axios.get(`https://api-viper-x.koyeb.app/api/song?name=${match}`)
var song = res.data
await message.client.sendMessage(message.jid, { text: `*_Downloading ${song.data.title}_*` },{ quoted: message})
const zeta = await (await fetch(`${song.data.downloadUrl}`)).buffer()
await message.client.sendMessage(message.jid, { audio :zeta,  mimetype:"audio/mpeg" }, {quoted: message })
    }
    );

// ZETA BRO //

command(
    {
        pattern: "video",
        fromMe: isPrivate,
        desc: "Yt Video Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!match) return await message.sendMessage("*_Need a Video Name_*");
let {result} = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/yt_video?search=${match}`);
await message.client.sendMessage(message.jid, { text: `*_Downloading ${result.title}_*` },{ quoted: message})
return await message.sendFromUrl(result.url, { caption: `*${result.title}*` }, {quoted: message })
    });

// Zeta-XD 

command(
    {
        pattern: "yta",
        fromMe: isPrivate,
        desc: "YouTube song Downloader",
        type: "downloader",
    },
    async (message, match, client) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!isUrl(match)) return await message.reply("*_Need YouTube Url_*");
let Ytd = await ytmp3(match);
await message.client.sendMessage(message.jid, {audio: Ytd.buffer, mimetype: "audio/mpeg"}, { quoted: message }, "audio");
});

async function ytmp3(url) {
    try {
        const {
            videoDetails
        } = await ytdl.getInfo(url, {
            lang: "id"
        });

        const stream = ytdl(url, {
            filter: "audioonly",
            quality: "highestaudio"
        });
        const chunks = [];

        stream.on("data", (chunk) => {
            chunks.push(chunk);
        });

        await new Promise((resolve, reject) => {
            stream.on("end", resolve);
            stream.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);

        return {
            meta: {
                title: videoDetails.title,
                channel: videoDetails.author.name,
                seconds: videoDetails.lengthSeconds,
                description: videoDetails.description,
                image: videoDetails.thumbnails.slice(-1)[0].url,
            },
            buffer: buffer,
            size: buffer.length,
        };
    } catch (error) {
        throw error;
    }
};

// ZETA BRO //

command(
    {
        pattern: "ytv",
        fromMe: isPrivate,
        desc: "YouTube Video Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!isUrl(match)) return await message.reply("*_Need YouTube Url_*");
let Ytd = await ytmp4(match, "134");
await message.sendFromUrl(Ytd.videoUrl, { caption: (X.CAPTION) }, {quoted: message })
});

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedDuration = [];

    if (hours > 0) {
        formattedDuration.push(`${hours} hour`);
    }

    if (minutes > 0) {
        formattedDuration.push(`${minutes} minute`);
    }

    if (remainingSeconds > 0) {
        formattedDuration.push(`${remainingSeconds} second`);
    }

    return formattedDuration.join(' ');
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function ytmp4(query, quality = 134) {
    try {
        const videoInfo = await ytdl.getInfo(query, {
            lang: 'id'
        });
        const format = ytdl.chooseFormat(videoInfo.formats, {
            format: quality,
            filter: 'videoandaudio'
        })
        let response = await fetch(format.url, {
            method: 'HEAD'
        });
        let contentLength = response.headers.get('content-length');
        let fileSizeInBytes = parseInt(contentLength);
        return {
            title: videoInfo.videoDetails.title,
            thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
            date: videoInfo.videoDetails.publishDate,
            duration: formatDuration(videoInfo.videoDetails.lengthSeconds),
            channel: videoInfo.videoDetails.ownerChannelName,
            quality: format.qualityLabel,
            contentLength: formatBytes(fileSizeInBytes),
            description: videoInfo.videoDetails.description,
            videoUrl: format.url
        }
    } catch (error) {
        throw error
    }
}

// Zeta-XD 

async function spdl(ur)
{
let res = await axios.get(ur);
await client.sendMessage(message.jid, { audio: { url: res.data.result.url }, mimetype: "audio/mpeg" });
}

command(
  {
    pattern: "spotify",
    fromMe: isPrivate,
    desc: "download spotify song/playlist",
    type: "downloader",
  },
  async (message, match, m, client) => {
  try{
  if (!match) return await message.reply("*provide a spotify track/playlist/album url*");
  if (!match.includes("spotify")) return await message.reply("*provide a valid spotify url*");
if (match.includes("https://open.spotify.com/playlist/")) {
let { tracks } = await spotify.getPlaylist(match);
let op = []
tracks.map(async (u) => {
op.push(`https://api.maher-zubair.tech/download/spotify?url=https://open.spotify.com/track/${u}`)
})

for (let i = 0; i < op.length; i++) {
await spdl(op[i])
}
} else if (match.includes("https://open.spotify.com/album/")) {
let { tracks } = await spotify.getAlbum(match);
let op = []
tracks.map(async (u) => {
op.push(`https://api.maher-zubair.tech/download/spotify?url=https://open.spotify.com/track/${u}`)
})

for (let i = 0; i < op.length; i++) {
await spdl(op[i])
}
} else {
await spdl(`https://api.maher-zubair.tech/download/spotify?url=https://open.spotify.com/track/${match}`)
}
}catch (error) {
return await message.reply("*download failed*")
}
})


command(
    {
        pattern: "pinterest",
        fromMe: isPrivate,
        desc: "Pinterest Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!isUrl(match)) return await message.sendMessage("*_Need Pinterest Url_*");
var {result} = await getJson(`https://api.lokiser.xyz/api/pinterestdl?link=${match}`)
await message.sendFromUrl(result.LokiXer.url,{ caption: (X.CAPTION) }, {quoted: message})
    }
    );

command(
    {
        pattern: "gitdl",
        fromMe: isPrivate,
        desc: "Repository Downloader",
        type: "downloader",
    },
    async (message, match, client) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
if (!isUrl(match)) return await message.reply("*_Need A Repo Url_*")
let user = match.split("/")[3];
let repo = match.split("/")[4];
let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
await message.reply("*_Downloading_*")

await message.client.sendMessage(message.jid,{ document :{ url: url }, fileName: repo , mimetype: "application/zip"}, {quoted: message });
})

command(
    {
        pattern: "tbox",
        fromMe: isPrivate,
        desc: "terabox Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
    	match = match || message.reply_message.text
   if (!match)return message.reply(`*_Need Terabox Link_*\n*Nb:- Please provide link less than 100MB*`)
let zeta = await getJson(`https://terabox-app.vercel.app/api?data=${match}`);
return await message.sendFromUrl(zeta.direct_link, { caption: (X.CAPTION)})
});

command(
    {
        pattern: "xvd",
        fromMe: true,
        desc: "xv Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!match) return await message.sendMessage("*_Need a xv Link_*");
var sex = await fetch(`https://raganork-network.vercel.app/api/xvideos/download?url=${match}`);
        var fek = await sex.json();

        await message.client.sendMessage(message.jid,{video:{ url: fek.url }, caption: (𝐗.CAPTION)}, {quoted : message})
    }
    );
    
command(
    {
        pattern: "upload",
        fromMe: isPrivate,
        desc: "Downloads & uploads media from raw URL",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
match = match || m.quoted.text;
if (!match)return message.reply(`*_Need a imgur/graph Link_*`)
return await message.sendFromUrl(match, { caption: (X.CAPTION) }, {quoted: message})
});

command(
    {
        pattern: "mediafire",
        fromMe: isPrivate,
        desc: "Mediafire Downloader",
        type: "downloader",
    },
    async (message, match) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
        if (!match) return await message.sendMessage("*_Need A Mediafire Url_*");
const mediafiredownload = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const response = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const name = seplit[5]
mime = name.split('.')
mime = mime[1]
response.push({ name, mime, size, link })
return response
}
var zeta = await mediafiredownload(`${match}`)
await message.client.sendMessage(message.jid, { text: `*_Downloading ${zeta[0]['name']}_*\n\n*size : ${zeta[0]['size']}*\n` },{ quoted: message});
await message.client.sendMessage(message.jid, { document :{ url: zeta[0]['link'] }, fileName: zeta[0]['name'] , mimetype: zeta[0]['mime'] }, {quoted: message })
}
);

command(
    {
        pattern: "dalle",
        fromMe: isPrivate,
        desc: "ai image generator",
        type: "downloader",
    },
    async (message, match, m) => {
    if(process.cwd() !== "/root/zeta") return message.reply("use og version myra https://github.com/Kingbadan321/Zeta-XD");
	if(!match) return await message.reply(`*_Need A Text_*\n*eg:- .dalle a modified gtr in garage*`);
await message.sendFromUrl(`https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=${match}`, {caption: (X.CAPTION)})
});
