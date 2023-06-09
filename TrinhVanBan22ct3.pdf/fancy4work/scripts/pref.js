(async () => {
    let auto_seek = (await chrome.storage.local.get(['auto-seek']))['auto-seek'];
    if(auto_seek == null){
        console.log({auto_seek});
        await chrome.storage.local.set({'auto-seek': true})
    }
})()