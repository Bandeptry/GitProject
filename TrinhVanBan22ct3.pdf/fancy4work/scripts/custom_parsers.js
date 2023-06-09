let custom_parsers = {
    'www.bbcearth.com': bbcearth,
    'bbcearth.com': bbcearth,
    'www.treehugger.com': treehugger,
    'treehugger.com': treehugger,
    'www.nhm.ac.uk': nhm,
    'nhm.ac.uk': nhm,
    'www.cnet.com': cnet,
    'cnet.com': cnet,
    'eartharchives.org': eartharchives,
    'www.eartharchives.org': eartharchives,
    'nationalgeographic.com': natgeo,
    'www.nationalgeographic.com': natgeo,
    'thecollector.com': thecollector,
    'www.thecollector.com': thecollector,
    'interestingengineering.com': inengineer,
    'www.interestingengineering.com': inengineer,
    'fieldmuseum.org': fieldmuseum,
    'www.fieldmuseum.org': fieldmuseum,
    'sciencealert.com': sciencealert,
    'www.sciencealert.com': sciencealert,
    'quantamagazine.org': quantamagazine,
    'www.quantamagazine.org': quantamagazine,
    'discovery.com': discovery,
    'www.discovery.com': discovery,
    'bbc.com': bbc,
    'www.bbc.com': bbc,
    'listverse.com': listverse,
    'www.listverse.com': listverse,
    'en.wikipedia.org': wikipedia,
    'ocean.si.edu': oceansi,
    'www.ocean.si.edu': oceansi,
    'explorethearchive.com': explorethearchive,
    'www.explorethearchive.com': explorethearchive,
    'australian.museum': australian_museum,
    'www.australian.museum': australian_museum,
    'brisbanetimes.com.au': brisbanetimes,
    'www.brisbanetimes.com.au': brisbanetimes,
    'fishki.net': fishki,
    'www.fishki.net': fishki,
    'youtube.com': youtube,
    'www.youtube.com': youtube,
    'designboom.com': designboom,
    'www.designboom.com': designboom,
    'boredpanda.com': boredpanda,
    'www.boredpanda.com': boredpanda
}

function bbcearth(){
    try {
        let parser = new DOMParser();
        let doc = parser.parseFromString(document.querySelector('main').innerHTML, 'text/html');

        let unwanted_selectors = [
            'sup',
            '.social-share',
            '.content-hero',
            '.article-continues-below',
            '.more-on-auto-section',
            '[data-type="paragraph--social_share"]',
            '[data-type="paragraph--earth_repeating_content_block"]',
            '.parallax-section',
            '[data-type="paragraph--doubleclick_advertising"]'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function treehugger(){
    try {
        let parser = new DOMParser();
        let doc = parser.parseFromString(document.querySelector('article').innerHTML, 'text/html');

        let unwanted_selectors = [
            '.article-header',
            '.article-post-header',
            '.article-left-rail',
            '.article-post-content',
            '.article-right-rail',
            '.mntl-inline-citation'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function nhm(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.discover-image').innerHTML;
        html += document.querySelector('.article--introduction').innerHTML;
        html += document.querySelector('.article--content').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            '.read-link'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function cnet(){
    try {
        let parser = new DOMParser();
        let html = '';
        if(document.querySelector('#article-body')){
            html += document.querySelector('.c-head_hero').innerHTML;
            html += document.querySelector('#article-body').innerHTML;

        } else if(document.querySelector('.c-galleryVertical')){
            html += document.querySelector('.c-galleryVertical').innerHTML;
            
        } else {
            return null;
        }
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            '[section="read_more"]'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function eartharchives(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.article-wrapper > img:first-child').outerHTML;
        html += document.querySelector('article').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            '.aside',
            '.image-credit',
            '.author-card-small',
            '.tags',
            '.share',
            '.fb-comments',
            '.top-stories-card',
            'br'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


async function natgeo(){
    try {
        for(let node of document.querySelectorAll('.Truncate__Button')){
            node.click();
            node.remove();
        }

        await sleep(500);

        let parser = new DOMParser();
        let html = '';

        try {
            html += document.querySelector('.Article__Wrapper .CopyrightImage figure').outerHTML;
        } catch (error) {}

        try {
            html += document.querySelector('.Article__Headline').innerHTML;
        } catch (error) {}

        try {
            html += document.querySelector('.LeadMedia__Image').innerHTML;
        } catch (error) {}

        try {
            html += document.querySelector('.Caption__Text').innerHTML;
        } catch (error) {}

        html += document.querySelector('.Article__Content').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        for(let node of doc.querySelectorAll('.Caption__Text .RichText strong')){
            if(node.innerText.trim().toLowerCase() == 'left'){
                node.innerText = 'Top';
            }
            if(node.innerText.trim().toLowerCase() == 'right'){
                node.innerText = 'Bottom';
            }
        }

        let unwanted_selectors = [
            '.InsertedAd',
            '.Image__Copyright'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function thecollector(){
    try {
        let parser = new DOMParser();
        let html = '';
        if(document.querySelector('.article-head p')){
            html += document.querySelector('.article-head p').outerHTML;
        }
        html += document.querySelector('.article-post').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            'img[aria-hidden="true"]',
            '.author-top',
            '.collector-adthrive-contentads',
            '.CTA',
            '.readnext-card',
            '.share1Container',
            '.author-details',
            'br'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


function inengineer(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('article').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            '[class^="Review"]',
            '[class^="BigAd"]',
            '#recommended-video',
            '#newletter-scroll-most',
            '[class^="Stroke_stroked"]',
            '[aria-label="breadcrumb"]',
            '[class^="CommentSection"]',
            '#foryou-dataid',
            '[class^="MoreStories"]',
            'br'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


function fieldmuseum(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.blog-page .container').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        let tags = doc.querySelector('#tag-label');
        if(tags){
            tags.parentElement.remove();
        }

        let unwanted_selectors = [
            '.blog-page__header-backboard',
            '.sr-only'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


function sciencealert(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('article').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        
        let unwanted_selectors = [
            'h1',
            '[class^="Purch"]',
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


function quantamagazine(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('#postBody').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        
        let unwanted_selectors = [
            '.post__title__wrapper',
            '.post__footer',
            '.newsletter',
            '.post__category',
            '.comments',
            '[class^="post__sidebar"]',
            '.screen-reader-text',
            '.abstractions',
            '.hide-on-print'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function discovery(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.article-content').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        
        let unwanted_selectors = [
            '.assetTitle',
            '.attribution',
            '.tags',
            '.publishDate',
            '.socialSharing',
            '.o-ImageEmbed__a-Credit',
            '.m-SlideContainer__a-Title'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


function bbc(){
    try {
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('article').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        
        let unwanted_selectors = [
            '.article__author-unit',
            '.article-body-native-ad',
            '.article__end'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


async function listverse(){
    try {
        let parser = new DOMParser();
        for(let node of document.querySelectorAll('div.play')){
            node.click();
        }
        await sleep(1000);
        
        let html = '';
        html += document.querySelector('#articlecontentonly').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        for(let node of doc.querySelectorAll('h2 span')){
            let text = node.innerHTML;
            console.log(text)
            node.innerHTML = text + '. ';
        }
        for(let node of doc.querySelectorAll('.itemheading')){
            let number = node.querySelector('.itemnumber').innerHTML;
            let text = node.querySelector('.itemtitle').innerHTML;
            let h2 = doc.createElement('h2');
            h2.innerText = number + '. ' + text;
            node.replaceWith(h2);
        }

        let unwanted_selectors = [
            '.swp_social_panel',
            'sup',
            '.crp_related',
            '.swp-content-locator',
            '.fact-checked',
            '.sharing',
            '.promote'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

async  function wikipedia(){
    try {
        
        let parser = new DOMParser();
        let html = '';
        html += (await Mercury.parse()).content;
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            'sup'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


function oceansi(){
    try {
        let parser = new DOMParser();
        let html = '';
        try {
            html += document.querySelector('.topic-header img').outerHTML;
        } catch (error) {}
        html += document.querySelector('.overview--introduction').innerHTML;
        for(let node of document.querySelectorAll('.overview--overview-section')){
            html += node.innerHTML;
        }
        
        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            'nav',
            'sup',
            '.overview__introduction-header',
            '.author',
            '.side-overview'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}



async function explorethearchive(){
    try {
        
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.SingleArticlePage').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');

        for(let node of doc.querySelectorAll('figcaption')){
            node.innerHTML = node.innerText;
        }
        for(let node of doc.querySelectorAll('.header')){
            let h2 = doc.createElement('h2');
            h2.innerText = node.innerText;
            node.replaceWith(h2);
        }

        let unwanted_selectors = [
            'sup',
            '.caption-text img',
            '.newsLettetPb',
            '.breadcrumbs',
            'h1',
            '.single-article-info',
            '.related-link',
            '.manualad',
            '.nativoincontent',
            '.tagsContainer',
            '#pubexchange_below_content'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


async function australian_museum(){
    try {
        
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.basic-page__primary').innerHTML;
        let doc = parser.parseFromString(html, 'text/html');
        
        let unwanted_selectors = [
            'sup',
            'footer',
            'nav',
            'hr',
            'figure button',
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


async function brisbanetimes(){
    try {
        
        let parser = new DOMParser();
        let html = '';
        for(let node of document.querySelectorAll('[data-testid="body-content"]')){
            html += node.innerHTML;
        }
        let doc = parser.parseFromString(html, 'text/html');
        
        let unwanted_selectors = [
            'sup',
            'footer',
            'nav',
            'hr',
            'figure button',
            '.noPrint'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


async function fishki(){
    try {
        
        let parser = new DOMParser();
        let html = '';
        html += document.querySelector('.post_content').innerHTML;

        let doc = parser.parseFromString(html, 'text/html');

        for(let video_wrapper of doc.querySelectorAll('.video-js')){
            let video = video_wrapper.querySelector('video');
            video_wrapper.innerHTML = video.outerHTML;
        }
        for(let node of doc.querySelectorAll('video')){
            if(node.src == null || node.src == ''){
                try {
                    node.src = node.querySelector('source').src;
                    node.setAttribute('controls', true);
                } catch (error) {}
            }
        }
        
        let unwanted_selectors = [
            'sup',
            'footer',
            'nav',
            'hr',
            'figure button',
            '.noPrint',
            '.content__tags',
            '.content__icons',
            'script',
            '.gallery-button-popup-div',
            '.content__figure__share',
            '[id^="yandex_rtb"]',
            '.source',
            '.similar-text-links-head',
            '.similar-text-links',
            '.button_add_community',
            '.preview_tag',
            '.rate_vue',
            '.partner-posts',
            '.fishki-video-frame',
            '.vjs-poster',
            '.vjs-text-track-display',
            '.vjs-loading-spinner',
            '.vjs-big-play-button',
            '.vjs-control-bar',
            '.vjs-error-display',
            '.vjs-caption-settings',
            '.ima-ad-container'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}


async function youtube(){
    try {
        
        let parser = new DOMParser();
        let html = '';
        
        let transcript = await get_yt_raw_transcript();
        console.log('here is your transcript')
        console.log(transcript)

        let chapters = await get_chapters();
        console.log(chapters)
        
        //merge chapters with transcript
        for(let i = 0; i < chapters.length; i++){
            let chapter = chapters[i];

            for(let j = 0; j < transcript.length; j++){
                let transcript_item = transcript[j];

                if(chapter.start <= transcript_item.start){
                    transcript.splice(j, 0, {
                        type: chapter.type,
                        start: chapter.start,
                        text: `~~~${i}~~~`
                    });
                    break;
                }
            }
        }
        console.log(transcript)
        transcript = transcript.map(elm => elm.text.trim().replaceAll(/\[(.*?)\]/gm, ''));

        let lang = 'en';
        if(is_vi(transcript.join('\n'))){
            lang = 'vi';
        }
        transcript = await punctuator(transcript, lang);

        for(let line of transcript){
            try {
                for(let item of split_transcript_line(line)){
                    let match = item.match(/~~~(\d+)~~~/);
                    if(match == null){
                        html += `<p data-class="yt-transcript">${item}</p>`;
                    } else {
                        let chapter = chapters[parseInt(match[1])];

                        html += `<${chapter.type} data-class="yt-transcript-chapter-heading">
                                ${chapter.text}
                            </${chapter.type}>`;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        html += `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${yt_video_id()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        \n`;

        let doc = parser.parseFromString(html, 'text/html');

        let unwanted_selectors = [
            
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

async function get_yt_raw_transcript(){
    // let textarea = await wait_for_elm('textarea.fetch-logger[fetch-url*="www.youtube.com/youtubei/v1/get_transcript"]');
    //let transcript = JSON.parse(textarea.value).actions[0].updateEngagementPanelAction.content.transcriptRenderer.content.transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer.initialSegments;
    // transcript = transcript.map(elm => {
    //     let obj = elm.transcriptSegmentRenderer;
    //     if(obj != null){
    //         return {
    //             text: obj.snippet.runs.map(item => item.text).join(' '),
    //             start: parseInt(obj.startMs),
    //             end: parseInt(obj.endMs)
    //         }
    //     }
    // })

    let {data} = await chrome.runtime.sendMessage({
        command: 'rest', data: {
            url: 'https://xwriter.space/api/transcript',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'auth': secret_key,
                'yt_id': yt_video_id()
            },
            type: 'json'
        }
    })
    let {transcript} = data;
    console.log({transcript})
    
    return transcript.filter(elm => elm != null);
}

async function get_chapters(){
    let offset = 0;
    let container = document.querySelector('[panel-target-id="engagement-panel-macro-markers-description-chapters"]');
    if(container == null){
        container = document.querySelector('[panel-target-id="engagement-panel-macro-markers-auto-chapters"]');
        offset = -500;
    }
    if(container == null) return [];
    let results = [];
    for(let node of container.querySelectorAll('ytd-macro-markers-list-item-renderer')){
        try {
            let a_node = node.querySelector('a');
            let url = new URL(a_node.href);
            let start = parseInt(url.searchParams.get('t').split('s'))*1000 + offset;
            let text = node.querySelector('h4').innerText.trim();
            results.push({
                text,
                start,
                type: 'h2'
            })

        } catch (error) {
            console.log(error)
        }
    }
    return results;
}

function split_transcript_line(line){
    let matches = line.matchAll(/~~~(\d+)~~~/g);

    let result = [];
    let curr_pos = 0;
    for(let match of matches){
        result.push(line.slice(curr_pos, match.index))
        result.push(line.slice(match.index, match.index + match[0].length));
        curr_pos = match.index + match[0].length;
    }
    result.push(line.slice(curr_pos));
    result = result
    .map(el => el.replace(/^(\.|\?|!)\s/, '').trim())
    .filter(el => !['.', '?', '!', ''].includes(el))
    
    result = [
        ...result.filter(el => /~~~(\d+)~~~/.test(el)),
        capitalize(result.filter(el => !/~~~(\d+)~~~/.test(el)).join(' '))
    ]
    return result;
}

function is_vi(text){
    text = text.toLowerCase();
    let found = 0;
    for(let char of ['ă', 'â', 'ô', 'ơ', 'ư', 'ê']){
        found += (text.split(char).length - 1);
    }
    console.log({found})
    if(found > 20){
        return true;
    } else {
        false;
    }
}


async function designboom(){
    try {
        
        let parser = new DOMParser();
        let html = '';

        try {
            html += document.querySelector('#db-hero iframe').outerHTML;
        } catch (error) {}

        try {
            html += document.querySelector('#db-hero picture').outerHTML;
        } catch (error) {}

        html += document.querySelector('#db-main').outerHTML;

        let doc = parser.parseFromString(html, 'text/html');

        for(let node of doc.querySelectorAll('p')){
            let br = node.querySelector('br');
            let img = node.querySelector('img');
            if(br != null && img != null){
                br.remove();
                node.append(document.createElement('br'));
                node.append(document.createElement('br'));
            }
        }
        
        let unwanted_selectors = [
            'sup',
            'footer',
            'nav',
            'hr',
            '#main-sidebar',
            '.post-author-box',
            '#post-author-box',
            '#block-tags',
            '.block--padded',
            '.block--highlights',
            '.company-info',
            '.pikker-badge'
            
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

async function boredpanda(){
    try {
        
        let parser = new DOMParser();
        let html = '';

        try {
            html += `<p>${document.querySelector('.open-list-post-description').innerText}</p>`;
    
            for(node of document.querySelectorAll('.open-list-item')){
                try {
                    let needed = '';
                    let header = node.querySelector('.open-list-header');
                    needed += `<h2>${header.innerText}</h2>`;
                    needed += node.querySelector('.shareable-post-image img')?.outerHTML || '';
    
                    let avatar = node.querySelector('.comment-author-image img')?.src;
                    let author = node.querySelector('.comment-block .comment-author')?.innerText || '';
                    let comment = node.querySelector('.comment-block [itemprop="text"]')?.innerText || '';
                    let upvotes = node.querySelector('.vote-panel .points')?.getAttribute('data-points') || '';
    
                    needed += `
                    <p keep-attrs class="no-br" style="display: flex;border: 2px gray solid;margin-top:5px;margin-bottom:30px;max-width:700px;padding:5px;">
                        <img keep-attrs src="${avatar}" style="width:30px;height:30px;flex-grow: 0;flex-shrink: 0;object-fit: cover;overflow: hidden;">
                        <span keep-attrs style="display:block;margin-left:10px;flex-grow: 1;">
                            <b keep-attrs style="display:block">${author}</b>
                            <span keep-attrs style="display:block">${comment}</span>
                            <span keep-attrs style="display:block">▲ <b>${upvotes}</b> ▼</span>
                        </span>
                    </p>
                    `
                    html += needed;
                } catch (error) {}
            }
        } catch (error) {
            html += document.querySelector('.post-content').innerHTML
        }

        let doc = parser.parseFromString(html, 'text/html');
        
        let unwanted_selectors = [
            'sup',
            'footer',
            'nav',
            'hr',
            '.post-ads',
            '.post-footer'
        ]
        remove_unwanted_selectors(unwanted_selectors, doc);
        return doc.body.innerHTML;
    } catch (error) {
        console.log(error)
        return '';
    }
}

function remove_unwanted_selectors(unwanted_selectors, doc){
    for(let selector of unwanted_selectors){
        for(let node of doc.querySelectorAll(selector)){
            node.remove();
        }
    }
}
