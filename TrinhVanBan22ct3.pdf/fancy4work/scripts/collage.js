//type: default og for opengraph size
//use type=ads for fb ads

document.head.insertAdjacentHTML('beforeend', `<style id="collage-css">${collage_css}</style>`);

async function create_collage(sources, more_text, type='og'){
    try {
        let collage_elm = document.querySelector('#collage');
        if(collage_elm){
            collage_elm.remove();
        }

        collage_elm = document.createElement('div');
        collage_elm.id = 'collage';
        collage_elm.classList.add('awp-collage');

        if(type == 'ads'){
            collage_elm.classList.add('awp-ads');
        }

        for(let src of sources){
            try {
                let brick = document.createElement('div');
                brick.classList.add('awp-brick');
                // let {base64_url} = await chrome.runtime.sendMessage({command: 'fetch', url: src});
                
                brick.style.backgroundImage = `url(${src})`;
                collage_elm.append(brick);
                if(collage_elm.querySelectorAll('.awp-brick').length >= 4){
                    break;
                }
            } catch (error) {
                console.log(error);
            }
        }
        if(more_text){
            let more = document.createElement('div');
            more.classList.add('awp-more');
            more.innerHTML = `<div style="margin-top:-0px;">${more_text}</div>`;
            collage_elm.append(more);
        }
        document.body.append(collage_elm);

        let canvas = await html2canvas(document.querySelector("#collage"), {scale: 1});
        let blob = await new Promise(resolve => canvas.toBlob(resolve));

        let maxSizeMB = type == 'ads' ? 3 : 1;
        let compressed = await imageCompression(new File([blob], 'collage.jpg', {type: 'image/jpeg'}), {maxSizeMB})
        return URL.createObjectURL(compressed);

    } catch (error) {
        console.log(error)
        return null;
    }
}

function create_canvas({width, height}){
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}