let {trello_key, trello_token} = config;

async function create_new_card({list_id, title, link, file}){
    if(is_empty(trello_key) || is_empty(trello_token) || is_empty(list_id)){
        console.log('skip posting to trello');
        return;
    }

    let params = new URLSearchParams({
        key: trello_key,
        token: trello_token,
        name: title,
        desc: link,
        idList: list_id,
        pos: 'top'
    })
    let body = new FormData();
    body.append('fileSource', file);

    let res = await fetch('https://api.trello.com/1/cards?' + params, {
        method: 'POST',
        body: body
    })
    let card = await res.json();
    return card;
}