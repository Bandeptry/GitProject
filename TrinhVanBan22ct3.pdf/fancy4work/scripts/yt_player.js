let yt_video_id = () => {
  let url = new URL(window.location.href);
  return url.searchParams.get('v');
};


let yt_video_size = async (id) => {
  await sleep(500);
  try {
    for (let node of document.querySelectorAll('.html5-video-info-panel-content > div')) {
      if (node.innerText.includes('Optimal Res')) {
        let text = node.innerText;
        let regex = /(.*?)(\d+)x(\d+)(.*?)/igm;
        const matches = Array.from(text.matchAll(regex));
        let width = parseInt(matches[0][2]);
        let height = parseInt(matches[0][3]);
        if(Number.isInteger(width) && Number.isInteger(height)){
          return scale_down({width, height});
        }
      }
    }
  } catch (error) {

  }
  try {
    console.log('failed to parse nerds info. now fetch it');
    let res = await fetch(`https://noembed.com/embed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${id}`);
    let { width, height } = await res.json();
    return scale_down({width, height});
  } catch (error) {
    return { width: 600, height: 350 };
  }
}

function scale_down({width, height}){
  console.log('before', {width, height});
  height = height * (600 / width);
  width = 600;
  let max_height = document.documentElement.clientHeight - 120;
  if(height > max_height){
    width = width * (max_height / height);
    height = max_height;
  }
  console.log('after', {width, height});
  return {width, height}
}

let player_iframe_html = (id, size) => {

  return `
    <!DOCTYPE html>
    <html>
      <body>
        <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
        <div id="player-ui"></div>
    
        <script>
          // 2. This code loads the IFrame Player API code asynchronously.
          var tag = document.createElement('script');
    
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
          // 3. This function creates an <iframe> (and YouTube player)
          //    after the API code downloads.
          var player;
          
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player-ui', {
              width: ${size.width},
              height: ${size.height},
              videoId: '${id}',
              playerVars: {
                'playsinline': 1,
                'iv_load_policy': 3,
                'rel': 0,
                'modestbranding': 1,
                'showinfo': 0
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
              }
            });
          
          }
    
          // 4. The API will call this function when the video player is ready.
          function onPlayerReady(event) {
            event.target.playVideo();
          }
    
          // 5. The API calls this function when the player's state changes.
          //    The function indicates that when playing a video (state=1),
          //    the player should play for six seconds and then stop.
          
          function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING) {
              
            }
          }
          function stopVideo() {
            player.stopVideo();
          }

          window.addEventListener("message", e => {
            // console.log(e.data);
            if(e.data.command == 'seek'){
              player.seekTo(Math.max(0, e.data.to));
            }
          });
        </script>
      </body>
    </html>
    `
}