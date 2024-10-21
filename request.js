const clientId = "CLIENT_ID"
const clientSecret = "CLIENT_SECRET"
const authString = btoa(clientId + ':' + clientSecret)
let resultAlbums;

async function _getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', 
    {
        method: 'POST',
        body: new URLSearchParams(
        {
            'grant_type': 'client_credentials',
        }),
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + authString
        },
    });
    let resp = await response.json()
    return resp.access_token
}

async function _getAlbum(access_token,offset) 
{
    let url = "https://api.spotify.com/v1/artists/6qqNVTkY8uBg9cP3Jd7DAH/albums"
    url += "?limit=1"
    url += "&include_groups=single,appears_on,album,compilation"
    url += "&offset=" + offset
    url += "&market=IT"
    const response = await fetch(url, {
        method: "GET",
        headers:
        {
            'Authorization': 'Bearer ' + access_token
        }
    });
    let resp = await response.json()
    return resp.items[0];
}

async function _getTracks(access_token,album_id)
{
    let url = "https://api.spotify.com/v1/albums/" + album_id + "/tracks"
    url += "?limit=50"
    url += "&offset=0"
    url += "&market=IT"
    const response = await fetch(url,{
        method: "GET",
        headers:
        {
            "Authorization": "Bearer " + access_token
        }
    })
    let resp = await response.json()
    return resp.items;
}

function returnAlbum(album)
{
    let result = {
        "obj_type": "album",
        "name": album.name,
        "type": album.album_type,
        "id": album.id,
        "artists": album.artists,
        "image": album.images.at(0),
        "release_date": album.release_date
    }
    return result;
}

function returnTrack(track)
{
    let result = {
        "obj_type": "track",
        "name": track.name,
        "duration": track.duration_ms / 1000,
        "artists": track.artists,
        "id": track.id
    }
    return result;
}

let i = 0
let tracks;

const returnFullAlbum = (index) =>
{
    _getToken().then(token =>
    {
        _getAlbum(token,index).then(album =>
        {
            _getTracks(token,album.id).then(tracks =>
            {
                let j = 0
                for(j = 0; j < tracks.length; j++)
                {
                    self.postMessage(returnTrack(tracks.at(j)))
                    if(j == tracks.length - 1)
                    {
                        self.postMessage("done")
                    }
                }
            })
            self.postMessage(returnAlbum(album))
        })
    })
}

self.onmessage = (message) =>
{
    let data = message.data
    if(data == "start")
    {
        i = 0
        returnFullAlbum(i)
    }
}