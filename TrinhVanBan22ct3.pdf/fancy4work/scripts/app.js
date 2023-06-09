let html = '';

fetch(chrome.runtime.getURL('scripts/ui.html'))
  .then(res => res.text())
  .then(text => html = text);

let { wordpress_endpoint, username, password, bing_api_key, vercel_links, enable_tldr } = config;
let wp = new WPAPI({
  endpoint: wordpress_endpoint,
  username,
  password
});

let article = {
  title: '',
  excerpt: '',
  content: '',
  images: {}
};
let categories = vercel_links;

let ui_shadow_root;
let MAX_Z_INDEX = 2147483647;
let player_iframe;
let raw_yt_transcript;
let fuse;

chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    if (request.command == 'parse') {
      inject_scripts(['injected/watch_fetch.js']);

      if(window.location.href.includes('youtube.')){
        await show_nerds();
      }
      
      await create_ui();

      article = await parse_article();

      if(window.location.href.includes('youtube.')){
        article.excerpt = '';
        article.title = document.title;
      }

      article.title = transform(article.title);
      article.excerpt = transform(article.excerpt);
      article.content = format(article.content);
      article.images = {};
      

      mount_content();
      console.log(article);
      hide(ui_shadow_root.querySelector('#processing'));

      if(window.location.href.includes('youtube.')){
        raw_yt_transcript = await get_yt_raw_transcript();
        fuse = new Fuse(raw_yt_transcript, {
          keys: ['text'],
          includeScore: true
        });
        await add_yt_interaction();
      }

      try {
        ui_shadow_root.querySelector('#opengraph-image-file').href = get_chosen_images().fb_og;
        ui_shadow_root.querySelector('#ads-image-file').href = get_chosen_images().fb_ad;
      } catch (error) { }
      reset_css();

      console.log({enable_tldr})
      if(enable_tldr){
        let text = un_transform(ui_shadow_root.querySelector('#post-content').innerText);
        article.tldr = await get_tldr(text);
        console.log(article.tldr);
      }

    }
    return true;
  }
);

function reset_css() {
  let styles = [
    ...document.querySelectorAll('style'),
    ...document.querySelectorAll('link')
  ];

  for (let style of styles) {
    if (style.id != 'collage-css') {
      style.remove();
    }
  }
}

function inject_scripts(urls){
  for(let url of urls){
    url = chrome.runtime.getURL(url);
    console.log(url);
    let tag = document.createElement('script');
    tag.classList.add('injected')
    tag.src = url;
    document.head.append(tag);
  }
  
}


async function show_nerds(){
  if(!window.location.host.includes('youtube.')) return;
  try {
    document.querySelector('#movie_player').click();
    right_click(document.querySelector('#movie_player'));
    await sleep(200);
    let menuitem = document.querySelector('.ytp-panel .ytp-menuitem:last-child');
    menuitem.click();
    
    // await sleep(200);
    // document.querySelector('#button-shape button').click();
    // await sleep(200);
    // menuitem = document.querySelector('.ytd-popup-container [role="menuitem"]:last-child');
    // menuitem.click();

    let chapter_btn = document.querySelector('.ytp-chapter-container');
    if(chapter_btn != null){
      await sleep(100);
      chapter_btn.click();
      await sleep(100);
    }

  } catch (error) {
    console.log(error);
  }
}

async function add_yt_interaction(){
  for(let node of ui_shadow_root.querySelectorAll('[data-class="yt-transcript"]')){
    node.addEventListener('click', async () => {
      let auto_seek = (await chrome.storage.local.get(['auto-seek']))['auto-seek'];
      if(!auto_seek) return;

      let text = un_transform(node.innerText);
      let result = fuse.search(text)//.filter(el => el.score < 0.1);
      console.log(result);
      if(result.length > 0 && result.filter(el => el.score == result[0].score).length == 1){
        player_iframe.contentWindow.postMessage({
          command: 'seek', 
          to: Math.floor(result[0].item.start/1000) - 1
        });
      }
    })
  }

  for(let node of document.body.childNodes){
    if(node.getAttribute('id') != 'auto-wp-ui' && !node.classList.contains('fetch-logger') ){
      node.replaceWith('');
    }
  }


}

async function create_ui() {
  for (let script of document.querySelectorAll('script')) {
    if(!script.classList.contains('injected')){
      script.remove();
    }
    
  }

  document.querySelector(':root').style.fontSize = '16px';
  let auto_wp_ui = document.querySelector('#auto-wp-ui');
  if (auto_wp_ui != null) {
    auto_wp_ui.remove();
  }
  auto_wp_ui = document.createElement('div');
  auto_wp_ui.id = 'auto-wp-ui';
  auto_wp_ui.style.zIndex = MAX_Z_INDEX;
  auto_wp_ui.style.position = 'fixed';
  auto_wp_ui.style.inset = 0;
  document.body.style.overflow = 'hidden';
  document.body.append(auto_wp_ui);

  ui_shadow_root = auto_wp_ui.attachShadow({ mode: 'closed' });
  await construct_shadow_root();

  let categories_el = ui_shadow_root.querySelector('#post-categories');
  let categories_el_html = '';
  for (let category of categories) {
    categories_el_html += `
    <div class="my-4 flex flex-row items-center">
      <input id="category_${category.id}" category-id="${category.id}" type="checkbox" class="mr-2 h-4 w-4" />
      <label for="category_${category.id}">${category.name}</label>
    </div>
    `
  }
  categories_el.innerHTML = categories_el_html;

  add_actions();
}

async function construct_shadow_root() {
  let style = document.createElement('style');
  style.textContent = css;
  let wrapper = document.createElement('div');
  wrapper.style.zIndex = 999999;
  wrapper.style.position = 'absolute';
  wrapper.style.inset = 0;
  wrapper.classList.add('bg-slate-100');
  wrapper.innerHTML = html;

  if(window.location.host.includes('youtube.')){
    let container = wrapper.querySelector('#container');
    container.style.justifyContent = 'center';

    let player_iframe_wrapper = document.createElement('div');
    let yt_id = yt_video_id();
    let yt_size = await yt_video_size(yt_id);
    console.log(yt_size)

    player_iframe_wrapper.style.width = yt_size.width + 20 + 'px';
    player_iframe_wrapper.style.height = yt_size.height + 120 + 'px';

    player_iframe = document.createElement('iframe');
    player_iframe.style.width = yt_size.width + 20 + 'px';
    player_iframe.style.flexShrink = 0;
    player_iframe.style.height = yt_size.height + 20 + 'px';
    player_iframe.style.border = 'none';
    player_iframe.src = window.location.href;
    player_iframe.srcdoc = player_iframe_html(yt_id, yt_size);

    player_iframe_wrapper.append(player_iframe);

    let checkbox = document.createElement('input');
    checkbox.addEventListener('change', async () => {
      await chrome.storage.local.set({'auto-seek': checkbox.checked})
    })
    checkbox.setAttribute('type', 'checkbox');
    checkbox.style.margin = '10px';
    checkbox.style.marginTop = '20px';
    checkbox.checked = (await chrome.storage.local.get(['auto-seek']))['auto-seek'];
    checkbox.id = 'auto-seek-checkbox';
    let label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.innerText = 'Auto seek video when click on the transcript';
    player_iframe_wrapper.append(checkbox);
    player_iframe_wrapper.append(label);

    let capture_btn = document.createElement('button');
    capture_btn.innerText = 'Capture screenshot';
    capture_btn.style.float = 'right';
    capture_btn.style.marginTop = '20px';
    capture_btn.style.marginRight = '10px';
    capture_btn.addEventListener('click', async () => {
      let image = await capture_screenshot();
      console.log(image)
    })
    player_iframe_wrapper.append(capture_btn);

    container.insertAdjacentElement('afterbegin', player_iframe_wrapper);

    let editor_ui = container.querySelector('#editor-ui');
  }
  

  ui_shadow_root.append(style);
  ui_shadow_root.append(wrapper);
}

async function capture_screenshot(){
  let {image} = await chrome.runtime.sendMessage({command: 'capture'});
  let blob = data_url_to_blob(image);
  let url = URL.createObjectURL(blob);
  let jimp_obj = await Jimp.read(url);
  let pixel_ratio = window.devicePixelRatio;
  
  let iframe_rect = player_iframe.getBoundingClientRect();
  let video_rect = player_iframe.contentWindow.document.querySelector('#player-ui').getBoundingClientRect();;
  console.log(iframe_rect);
  console.log(video_rect);
  player_iframe.contentWindow.postMessage('good job');
  let rect = {
    x: (iframe_rect.x + video_rect.x + 2)*pixel_ratio,
    y: (iframe_rect.y + video_rect.y + 2)*pixel_ratio,
    width: (video_rect.width - 4)*pixel_ratio,
    height: (video_rect.height - 4)*pixel_ratio
  }
  let cropped = await jimp_obj.crop(rect.x, rect.y, rect.width, rect.height);
  let base64 = await cropped.getBase64Async('image/jpeg');
  blob = data_url_to_blob(base64);
  let compressed = await imageCompression(blob, {maxSizeMB: 3})
  url = URL.createObjectURL(compressed);
  console.log(url);
  await insert_image(url);
}


function destroy_ui() {
  window.location.reload();
  // document.body.style.overflow = 'auto';
  // document.querySelector('#auto-wp-ui').remove();
}

function mount_content() {

  ui_shadow_root.querySelector('#fb-preview-image').style.backgroundImage = `url(${get_chosen_images().fb_og})`;
  ui_shadow_root.querySelector('#fb-preview-title').innerHTML = article.title;
  ui_shadow_root.querySelector('#fb-preview-excerpt').innerHTML = article.excerpt
  ui_shadow_root.querySelector('#post-title').value = article.title;
  ui_shadow_root.querySelector('#post-content').innerHTML = article.content;

}

function add_actions() {
  ui_shadow_root.querySelector('#auto-wp-cancel-btn').addEventListener('click', () => {
    destroy_ui();
  })

  ui_shadow_root.querySelector('#auto-wp-post-btn').addEventListener('click', async () => {
    try {
      await post();
    } catch (error) {
      hide(ui_shadow_root.querySelector('#processing'))
      show(ui_shadow_root.querySelector('#failed'))
      ui_shadow_root.querySelector('#failed p').innerHTML = error.message;
    }
  })


  for(let radio of ui_shadow_root.querySelectorAll('input[name="image-pref"]')){
    radio.addEventListener('click', e => image_pref_changed(e))
  }

  ui_shadow_root.querySelector('#local-single-file-input').addEventListener('change', async (e) => {
    let files = e.target.files;
    if(files.length == 0) return;
    let file = files[0]
    
    let compressed = await imageCompression(new File([file], 'poster.jpg', {type: 'image/jpeg'}), {maxSizeMB: 1})
    let url = URL.createObjectURL(compressed);
    article.images['fb_ad_local_single'] = url;
    article.images['fb_og_local_single'] = url;
    update_ui_with_new_images();

  })

  ui_shadow_root.querySelector('#local-file-input').addEventListener('change', async (e) => {
    if (ui_shadow_root.querySelector('#local-file-input').files.length >= 4) {
      ui_shadow_root.querySelector('#shuffle-btn').setAttribute('disabled', '');
      ui_shadow_root.querySelector('#shuffle-btn').innerText = 'Shuffling...';
      ui_shadow_root.querySelector('#local-file-input').setAttribute('disabled', '');
      await shuffle_local();

      ui_shadow_root.querySelector('#shuffle-btn').innerText = 'Shuffle';
      ui_shadow_root.querySelector('#shuffle-btn').removeAttribute('disabled');
      ui_shadow_root.querySelector('#local-file-input').removeAttribute('disabled');
    } else {
      ui_shadow_root.querySelector('#shuffle-btn').setAttribute('disabled', '');
    }
  })

  ui_shadow_root.querySelector('#shuffle-btn').addEventListener('click', async (e) => {

    ui_shadow_root.querySelector('#shuffle-btn').setAttribute('disabled', '');
    ui_shadow_root.querySelector('#shuffle-btn').innerText = 'Shuffling...';
    ui_shadow_root.querySelector('#local-file-input').setAttribute('disabled', '');
    await shuffle_local();

    ui_shadow_root.querySelector('#shuffle-btn').innerText = 'Shuffle';
    ui_shadow_root.querySelector('#shuffle-btn').removeAttribute('disabled');
    ui_shadow_root.querySelector('#local-file-input').removeAttribute('disabled');
  })

  ui_shadow_root.querySelector('#post-title').addEventListener('input', e => {
    console.log('oninput', e.target.value);
    e.target.value = transform(e.target.value);
    article.title = e.target.value;
    ui_shadow_root.querySelector('#fb-preview-title').innerHTML = article.title;
  })

  ui_shadow_root.querySelector('#copy-title-btn').addEventListener('click', e => {
    navigator.clipboard.writeText(un_transform(article.title));
    let btn = e.target;
    btn.innerHTML = 'Copied ✓';
    setTimeout(() => {
      btn.innerHTML = 'copy raw text'
    }, 2000);
  })

  ui_shadow_root.querySelector('#post-content').addEventListener('paste', (event) => {
    event.preventDefault();

    let paste = (event.clipboardData || window.clipboardData).getData('text/html');
    
    if(paste == null || paste == ''){
      paste = (event.clipboardData || window.clipboardData).getData('text/plain');
      if(paste == null){
        return;
      }
      paste = '<p>' + escape_html(paste) + '</p>';
    }
    paste = format(paste);
    let wrapper_name = paste.includes('<p>') ? 'div' : 'p';
    let wrapper_node = document.createElement(wrapper_name);
    wrapper_node.innerHTML = paste;

    const selection = ui_shadow_root.getSelection();
    console.log(selection);
    if (!selection.rangeCount) return;
    selection.deleteFromDocument();

    selection.getRangeAt(0).insertNode(wrapper_node);
    selection.collapseToEnd();
  });

  ui_shadow_root.querySelector('#copy-post-btn').addEventListener('click', e => {
    navigator.clipboard.writeText(
      un_transform(ui_shadow_root.querySelector('#post-content').innerText)
    );

    let btn = e.target;
    btn.innerHTML = 'Copied ✓';
    setTimeout(() => {
      btn.innerHTML = 'copy raw text'
    }, 2000);
  })

  ui_shadow_root.querySelector('#container').addEventListener('drop', async (event) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for(let item of event.dataTransfer.items){
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if(['image/jpeg', 'image/png','image/webp'].includes(file.type)){
            await insert_image(URL.createObjectURL(file))
          }
        }
      }
    } 
  })
  ui_shadow_root.querySelector('#container').addEventListener('dragover', (event) => {
    event.preventDefault();
  })

  ui_shadow_root.querySelector('#post-content').addEventListener('input', (event) => {
    save_caret_position();
  })

  ui_shadow_root.querySelector('#post-content').addEventListener('focus', (event) => {
    save_caret_position();
  })

  ui_shadow_root.querySelector('#post-content').addEventListener('click', (event) => {
    save_caret_position();
  })

}

function save_caret_position(){
  ui_shadow_root.querySelector('#caret-position')?.remove();
  let selection = ui_shadow_root.getSelection();
  let caret = document.createElement('span');
  caret.id = 'caret-position';
  selection.getRangeAt(0).insertNode(caret);
}


function image_pref_changed(e) {
  let image_pref = e.target.value;

  if (image_pref == 'local') {
      if(ui_shadow_root.querySelector('#local-file-input').files.length >= 4){
        ui_shadow_root.querySelector('#shuffle-btn').removeAttribute('disabled');
      }
      ui_shadow_root.querySelector('#local-file-input').removeAttribute('disabled');
  } else {
      ui_shadow_root.querySelector('#shuffle-btn').setAttribute('disabled', '');
      ui_shadow_root.querySelector('#local-file-input').setAttribute('disabled', '');
  }

  if (image_pref == 'local-single') {
    ui_shadow_root.querySelector('#local-single-file-input').removeAttribute('disabled');
} else {
    ui_shadow_root.querySelector('#local-single-file-input').setAttribute('disabled', '');
}
  update_ui_with_new_images();

}

async function shuffle_local() {
  for (let input of ui_shadow_root.querySelectorAll('input[name="image-pref"]')) {
    input.setAttribute('disabled', true);
  }
  let all_images = Array.from(ui_shadow_root.querySelector('#local-file-input').files)
    .map(file => URL.createObjectURL(file));

  if (all_images.length < 4) return;

  all_images = shuffle(all_images);
  let fake_more_text = '+' + random_int(fake_more_thumbnails.from, fake_more_thumbnails.to)
  let fb_ad = await create_collage(all_images, fake_more_text, 'ads');
  let fb_og = await create_collage(all_images, fake_more_text);
  article.images['fb_ad_local'] = fb_ad;
  article.images['fb_og_local'] = fb_og;

  update_ui_with_new_images();

  for (let input of ui_shadow_root.querySelectorAll('input[name="image-pref"]')) {
    input.removeAttribute('disabled');
  }
}

function update_ui_with_new_images(){
  ui_shadow_root.querySelector('#fb-preview-image').style.backgroundImage = `url(${get_chosen_images().fb_og})`;

  try {
    ui_shadow_root.querySelector('#opengraph-image-file').href = get_chosen_images().fb_og;
    ui_shadow_root.querySelector('#ads-image-file').href = get_chosen_images().fb_ad;
  } catch (error) { }
}

function get_chosen_images() {
  let value = ui_shadow_root.querySelector('input[name="image-pref"]:checked').value;
  if (value == 'local') {
    return { fb_ad: article.images['fb_ad_local'], fb_og: article.images['fb_og_local'] };
  } else if (value == 'local-single') {
    return { fb_ad: article.images['fb_ad_local_single'], fb_og: article.images['fb_og_local_single'] };
  }
}

function assert_post(){
  let {fb_ad, fb_og} = get_chosen_images();
  if(fb_ad == null || fb_og == null){
    alert('missing the cover image');
    return false;
  }
  if(selected_categories().length == 0){
    alert('please select categories');
    return false;
  }
  return true;
}

async function upload_media(html){
  let parser = new DOMParser()
  let document = parser.parseFromString(html, 'text/html');
  for(let node of document.querySelectorAll('img')){
    if(node.src.startsWith('blob:')){
      try {
        let media_file_name = `${(new Date()).getTime()}.jpg`;
        let media_file = await get_file(node.src, media_file_name);
        let media = await wp.media().file(media_file, media_file_name).create({
          title: article.title,
          alt_text: article.title
        });
  
        if (media == null || media.source_url == null) {
          node.remove();
        }
        node.src = media.source_url;
      } catch (error) {
        node.remove();
      }
    }
  }
  return document.body.innerHTML;
}

async function post() {
  
  if(!assert_post()){
    return;
  }
  //show processing
  ui_shadow_root.querySelector('#processing p').innerHTML = "uploading content. it shouldn't take more than a minute";
  ui_shadow_root.querySelector('#processing').style.display = 'flex';


  article.content = ui_shadow_root.querySelector('#post-content').innerHTML
    .split('<div>').join('').split('</div>').join('');

  article.content = await upload_media(article.content);
  article.title = transform(article.title);


  let media_file_name = `${(new Date()).getTime()}.jpg`;

  let media_file = await get_file(get_chosen_images().fb_og, media_file_name);
  let media = await wp.media().file(media_file, media_file_name).create({
    title: article.title,
    alt_text: article.title
  });

  let post = {
    title: article.title,
    content: article.content,
    excerpt: article.tldr || article.excerpt,
    featured_media: media.id,
    categories: selected_categories(),
    status: 'publish',
    slug: `${un_transform(article.title)}-${username}}-${(new Date()).getTime()}`
  }
  if (post.categories.length == 0) {
    delete post.categories;
  }

  wp.posts().create(post).then(async function (res) {
    // "response" will hold all properties of your newly-created post,
    // including the unique `id` the post was assigned on creation
    console.log(res);
    try {
      write();
    } catch (error) { 
      console.log(error)
    }

    try {
      for (let category of vercel_links.filter(el => res.categories.includes(el.id))) {
        let link = '';
        if(!is_empty(category.vercel)){
          link += category.vercel + res.slug + ' \n'
        }
        if(!is_empty(category.netlify)){
          link += category.netlify + res.slug + ' \n'
        }
        link += 'by ' + username;
        
        let list_id = category.trello.id;
        let file = await get_file(get_chosen_images().fb_ad, `${(new Date()).getTime()}.jpg`);
        await create_new_card({ list_id, title: un_transform(post.title), link, file })

      }
    } catch (error) {
      console.log(error);
    }

    hide(ui_shadow_root.querySelector('#processing'))
    show(ui_shadow_root.querySelector('#processed'))
    ui_shadow_root.querySelector('#processed a').href = res.link;

    //lazy update tldr
    if(article.tldr != null){
      wp.posts().id(res.id).update({
        excerpt: article.tldr
      }).then(function( response ) {
          console.log('lazy update tldr');
      })
    }

  }).catch(error => {
    hide(ui_shadow_root.querySelector('#processing'))
    show(ui_shadow_root.querySelector('#failed'))
    ui_shadow_root.querySelector('#failed p').innerHTML = error.message;
  })
}

function selected_categories() {

  let cats = [];
  for (let checkbox of ui_shadow_root.querySelectorAll('#post-categories input[type="checkbox"]')) {
    if (checkbox.checked) {
      cats.push(checkbox.getAttribute('category-id'));
    }
  }
  return cats;
}


function show(elm) {
  if (elm.classList.contains('flex')) {
    elm.style.setProperty("display", "flex");

  } else if (elm.classList.contains('inline-block')) {
    elm.style.setProperty("display", "inline-block");

  } else if (elm.classList.contains('inline')) {
    elm.style.setProperty("display", "inline");

  } else {
    elm.style.setProperty("display", "block");
  }
}
function hide(elm) {
  elm.style.setProperty('display', 'none');
}


async function insert_image(url){
  let img = document.createElement('img');
  img.classList.add('alignnone', 'size-large');
  img.src = url
  let p = document.createElement('p');
  p.append(img);
  for(let selector of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', '> div']){
    for(let node of ui_shadow_root.querySelectorAll(`#post-content ${selector}`)){
      let caret = ui_shadow_root.querySelector('#caret-position');
      if(node.contains(caret)){
        node.insertAdjacentElement('afterend', p);
        return;
      }
    }
  }
  ui_shadow_root.querySelector('#post-content').insertAdjacentElement('beforeend', p);

}
async function add_backup_image(content, backup_image) {
  try {
    let parser = new DOMParser()
    let document = parser.parseFromString(content, 'text/html');
    let images = document.querySelectorAll('img');
    if (images == null || images.length <= 2) {

      let media_file_name = `${(new Date()).getTime()}.jpg`;
      let media_file = await get_file(backup_image, media_file_name);
      let media = await wp.media().file(media_file, media_file_name).create({
        title: article.title,
        alt_text: article.title
      });

      if (media == null || media.source_url == null) {
        return content;
      }

      let img = document.createElement('img');
      img.classList.add('alignnone', 'size-large');
      img.src = media.source_url;
      let p = document.createElement('p');
      p.append(img);
      document.body.prepend(p)
    }

    return document.body.outerHTML;

  } catch (error) {
    return content;
  }
}

async function get_tldr(text){
  try {
    let {data} = await chrome.runtime.sendMessage({
      command: 'rest', data: {
          url: 'https://xwriter.space/api/summarize',
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'auth': secret_key
          },
          data: {text},
          type: 'json'
      }
    })
    let {tldr} = data;
    if(tldr == null || tldr.trim() == ''){
      return null;
    } else {
      return 'tldr; ' + tldr;
    }
  } catch (error) {
    return '';
  }
}

async function parse_article() {
  let article = await Mercury.parse();

  let host = window.location.host;
  if (typeof custom_parsers[host] == 'function') {
    console.log('running custom_parser on ', host);
    let content = await custom_parsers[host]();
    if (content != null && content.trim() != '') {
      article.content = content;
    }
  }
  console.log(article);
  return article;
}
