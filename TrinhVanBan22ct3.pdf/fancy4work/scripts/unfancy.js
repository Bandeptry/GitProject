
let fancy_font = {
    'ᴛ': 't',
    'υ': 'u',
    'п': 'n',
    'ⱪ': 'k',
    'м': 'm'
};



function fancify(text){
    let keys = Object.keys(fancy_font).sort((a, b) => a.length - b.length);

    for(let key of keys){
        text = text.split(key).join(fancy_font[key]);
    }
    return text;
}



function textNodesUnder(el){
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}


let nodes = textNodesUnder(document.body);

for(let node of nodes){
    node.nodeValue = fancify(node.nodeValue);
}
console.log('unfancing')
