const worker = new Worker("request.js")

let mode;
let i = 0;

worker.onmessage = (event) =>
{
    let data = event.data
    let type = data.obj_type
    if(data == "done")
    {
        if(i == 0)
        {
            document.getElementById("anim-circle").remove()
            let arrows = document.querySelectorAll(".arrow img")
            arrows.forEach(arrow => {
                arrow.classList.remove("invisible")
            });
        }
    }

}

const createAlbumsGUI = (album,mode) => 
{
    if(mode == "loadList")
    {
        let div = document.createElement("div")
        div.id = album.name
        document.body.appendChild(div)
    }
}

setTimeout(() =>
{
    worker.postMessage("start")    
},1000)