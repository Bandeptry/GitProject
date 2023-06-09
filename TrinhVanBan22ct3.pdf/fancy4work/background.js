chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.command == 'fetch') {
            console.log(request.url)
            fetch(request.url)
                .then(res => res.blob())
                .then(blob => blob_base64url(blob))
                .then(base64_url => sendResponse({ base64_url }))
                .catch((error) => {
                    console.log(error);
                    sendResponse(null);
                });

            return true;
        }
        if (request.command == 'capture') {
            chrome.tabs.captureVisibleTab(
                null,
                { format: 'jpeg', quality: 100 }
            ).then(image => {
                sendResponse({ image })
            })
            return true;
        }
        if (request.command == 'rest') {

            let r = request.data;
            construct_body(r.data, r.body_type)
            .then(body => {
                console.log(body)
                fetch(r.url, {
                    method: r.method,
                    headers: r.headers,
                    body: body
                })
                .then(res => {
                    if (r.type == 'json') {
                        return res.json();
                    }
                    if (r.type == 'text') {
                        return res.text();
                    }
                    return res.blob();
                })
                .then(data => {
                    console.log(data)
                    sendResponse({ data });
                });
            })
            
            return true;
        }

        if (request.package == 'article') {
            console.log(request);
            let article = request.data;
            // document.querySelector('#content').innerHTML = article.content;
            // document.querySelector('#collage').src = article.opengraph;
            // fetch(article.opengraph)
            // .then(res => res.blob())
            // .then(blob => console.log(blob));
        }

    }
);

const blob_base64url = blob => new Promise((resolve, reject) => {
    console.log(blob)
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'].includes(blob.type)) {
        reject('invalid file type');
    }
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
    };
    reader.onerror = () => {
        console.log('failed to read blob');
        reject('failed to read blob')
    }
});



chrome.action.onClicked.addListener(async (tab) => {

    await chrome.tabs.sendMessage(tab.id, { command: 'parse' });

});

async function construct_body(data, type){
    return new Promise(async (resolve, reject) => {
        if(type == 'form_data'){
            let form = new FormData();
            for(let key of Object.keys(data)){
                if(typeof data[key] == 'string' && data[key].startsWith('blob:')){
                    form.append(key, await get_file(data[key], ''))
                } else {
                    form.append(key, data[key]);
                }
            }
            return resolve(form);
        } else if(typeof data == 'object') {
            return resolve(JSON.stringify(data))
        } else {
            return resolve(data);
        }
    })
    
}


async function get_file(url, name, defaultType = 'image/jpeg') {
    console.log('get_file', url);
    try {
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], name || `${(new Date()).getTime()}.jpg`, {
        type: defaultType,
      });
    } catch (error) {
      return null;
    }
  }