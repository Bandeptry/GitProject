
let {fake_more_thumbnails, remove_internal_links, remove_external_links, replaces } = config;

// async function parse(){
//   try {
//     console.log(replaces)
//     let result = await Mercury.parse();
//     if(result == null || result.content == null || result.content.trim() == ''){
//       return {OK: false, message: 'Cannot parse this article'}
//     }
    
//     result.title = transform(result.title);
//     result.excerpt = transform(result.excerpt);

//     return {OK: true, article: result};
//   } catch (error) {
//     return {OK: false, message: error.message};
//   }
// }

function format(content){
  
  let parser = new DOMParser()
  let document = parser.parseFromString(content, 'text/html');

  let a_nodes = get_nodes(document.body, 'A');
  for(let node of a_nodes){
    try {
      
      if(remove_internal_links && node.href.includes(window.location.host)){
        node.removeAttribute('href');
      }
      if(remove_external_links){
        node.removeAttribute('href');
      }

      if(node.querySelector('img') != null){
        node.replaceWith(node.querySelector('img'));
        continue;
      }

      if(node.getAttribute('href') == null){
        let text = node.innerText;
        node.replaceWith(text || '');
      }
    } catch (error) {}
  }

  for(let node of get_nodes(document.body, 'U')){
    try {
      let text = node.innerText;
      node.replaceWith(text || '');
    } catch (error) {}
  }

  let iframes = get_nodes(document.body, 'IFRAME');
  for(let node of iframes){
    try {
      
      let width = node.width || node.style.width;
      let height = node.height || node.style.height;
      node.removeAttribute('style');
      node.removeAttribute('allow');

      if(width == null || width == '' || height == null || height == ''){
        if(node.src.includes('youtube')){
          width = 560;
          height = 315;
        } else if(node.src.includes('twitter')){
          width = 400;
          height = 400;
        }
      }
      if(node.src.includes('youtube')){
        width = 560;
        height = 315;
      }
      node.setAttribute('width', width);
      node.setAttribute('height', height);
      node.setAttribute('allowFullScreen', '');
      if(node.getAttribute('src') == null){
        node.remove();
      }
    } catch (error) {}
  }

  let text_nodes = get_nodes(document.body, '#text');
  for(let node of text_nodes){
    try {
      node.textContent = transform(node.textContent);
    } catch (error) {}
  }

  for(let node of get_nodes(document.body, 'AMP-IMG')){
    try {
      let img = document.createElement('img');
      img.classList.add('alignnone', 'size-large');
      img.src = node.getAttribute('src');
      node.replaceWith(img)
    } catch (error) {}
  }

  for(let node of document.querySelectorAll('picture source')){
    // node.remove();
  }

  for(let node of get_nodes(document.body, 'svg')){
    try {
      node.remove();
    } catch (error) {}
  }

  for(let node of get_nodes(document.body, 'DIV')){
    try {
      if(
        node.querySelector('iframe') != null
        || node.querySelector('img') != null
        || node.querySelector('video') != null
      ) continue;
      if(node.innerText != null && node.innerText.trim() != '') continue;
      node.remove();
    } catch (error) {}
  }
  for(let node of get_nodes(document.body, 'SECTION')){
    try {
      if(
        node.querySelector('iframe') != null
        || node.querySelector('img') != null
        || node.querySelector('video') != null
      ) continue;
      if(node.innerText != null && node.innerText.trim() != '') continue;
      node.remove();
    } catch (error) {}
  }
  for(let node of get_nodes(document.body, 'P')){
    try {
      if(
        node.querySelector('iframe') != null
        || node.querySelector('img') != null
        || node.querySelector('video') != null
      ) continue;
      if(node.innerText != null && node.innerText.trim() != '') continue;
      node.remove();
    } catch (error) {}
  }


  for(let node of get_nodes(document.body, 'IMG')){
    try {
      if(node.getAttribute('width') == 0){
        node.removeAttribute('width');
      }
      if(node.getAttribute('height') == 0){
        node.removeAttribute('height');
      }
      node.removeAttribute('alt');
      if(node.hasAttribute('src')){
        // node.removeAttribute('srcset');
      }

    } catch (error) {}
  }

  for(let node of get_nodes(document.body, 'VIDEO')){
    try {
      if(node.src == null){
        node.remove();
      }

    } catch (error) {}
  }

  let all_nodes = get_nodes(document.body, null);
  for(let node of all_nodes){
    try {
      if(typeof node['removeAttribute'] === 'function' && node.getAttribute('keep-attrs') == null){
        node.removeAttribute('id');
        node.removeAttribute('class');
        node.removeAttribute('style');
      }
      if(node.src != null){
        node.src = node.src;
      }
      if(is_sponsor_node(node)){
        node.remove();
        continue;
      }
      
      if(['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.nodeName)){
        node.remove();
        continue;
      }
    } catch (error) {}
  }

  return document.body.innerHTML;
}

function transform(text){
  if(window.location.host.includes('youtube.')){
    return text;
  }
  
  let another_phrases = [
    '(open in new tab)', 'open in new tab', 'open in a new tab',
    '(opens in new tab)', 'opens in new tab', 'opens in a new tab',
    '()',
  ];
  for(let phrase of another_phrases){
    text = text.split(phrase).join('');
  }

  for(let pair of replaces){
    text = text.split(pair[0]).join(pair[1])
  }

  return text;
}

function un_transform(text){
  for(let pair of replaces){
    text = text.split(pair[1]).join(pair[0])
  }
  return text;
}

function get_image_sources(content){
  let parser = new DOMParser()
  let document = parser.parseFromString(content, 'text/html');
  let sources = [];
  let img_nodes = get_nodes(document.body, 'IMG');
  for(let node of img_nodes){
    let {width, height} = get_image_size(node);
    
    if(width >= 300 || height >= 300){
      if(!sources.includes(node.src)){
        sources.push(node.src);
      }
    }
  }
  return sources.filter(el => el != null);
}

function get_image_size(elm){
  try {
    let {width, height} = elm;
    if(width > 0 && height > 0){
      return {width, height};
    }
    let img_nodes = get_nodes(document.body, 'IMG');
    for(let node of img_nodes){
      if(node.src == elm.src){
        return {width: node.width, height: node.height}
      }
      if(node.srcset != null && node.srcset.includes(elm.src)){
        return {width: node.width, height: node.height};
      }
    }
  
    for(let node of img_nodes){
      let name = basename(elm.src, extname(elm.src));
      if(node.src != null && node.src.includes(name)){
        return {width: node.width, height: node.height};
      }
      if(node.srcset != null && node.srcset.includes(name)){
        return {width: node.width, height: node.height};
      }
    }
  } catch (error) {}

  return {width: -1, height: -1};
}

function get_nodes(parent, node_name){
  let result = [];
  for(let child of parent.childNodes){
    if(node_name){
      //find specific nodeName
      if(child.nodeName == node_name){
        result = [...result, child];
      }
    } else {
      result = [...result, child];
    }
    result = [...result, ...get_nodes(child, node_name)];
  }
  return result;
}

function is_sponsor_node(node){
  if(node == null && node.innerText == null) return false;

  try {
    let words = [
      'read more:',
      'see also:',
      'related:',
      'click here',
      'recommended video',
      'recommended article',
      'anchor:'

    ];
    let node_names = ['P', 'A', 'U', 'SPAN', 'STRONG', 'B'];
    return words.some(el => node.innerText.trim().toLowerCase().startsWith(el)) 
    && node_names.includes(node.nodeName);
  } catch (error) {
    return false;
  }
}
