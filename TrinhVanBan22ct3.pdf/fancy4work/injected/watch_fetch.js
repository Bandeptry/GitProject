const {fetch: origFetch} = window;
window.fetch = async (...args) => {
  // console.log("fetch called with args:", args);
  const response = await origFetch(...args);
  
  /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */
  response
    .clone()
    .json()
    .then(body => {
        if(response.headers.get('content-type').includes('json')){
            log_fetch(args[0].url, JSON.stringify(body));
        }
        
    })
    .catch(err => {})
  ;
    
  /* the original response can be resolved unmodified: */
  return response;
  
  /* or mock the response: */
//   return {
//     ok: true,
//     status: 200,
//     json: async () => ({
//       userId: 1,
//       id: 1,
//       title: "Mocked!!",
//       completed: false
//     })
//   };
};

function log_fetch(url, body){
    // console.log('log_fetch', url);
    // alert('log_fetch', url)
    let textarea = document.createElement('textarea');
    textarea.style.display = 'none';
    textarea.classList.add('fetch-logger');
    textarea.setAttribute('fetch-url', url);
    textarea.value = body;
    document.body.append(textarea);
}

console.log('injected watch_fetch');