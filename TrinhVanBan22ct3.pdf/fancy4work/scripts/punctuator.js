async function punctuator(lines, lang) {
    try {
        

        let {data} = await chrome.runtime.sendMessage({
            command: 'rest', data: {
                url: 'https://xwriter.space/api/punctuate',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'auth': secret_key
                },
                data: {text: lines.join('\n'), lang},
                type: 'json'
            }
        })
        console.log(data);
        let result = data.sents
            .map(line => line.trim().replaceAll(/\[(.*?)\]/gm, ''))
            .filter(line => line.length > 1)

        return result;
    } catch (error) {
        console.log(error)
        let error_text = error.message
        return ['[CANNOT PUNCTUATE THE TRANSCRIPT.\nPLEASE CONTACT THE DEVELOPER]\n', error_text + '\n', ...lines];
    }
}

function split_sentences(text) {
    let result = [];
    let regex = new RegExp(".{0,}?(?:\\.|!|\\?)(?:(?=\\ [A-Z0-9])|$)", "g");
    let match;
    while ((match = regex.exec(text)) != null) {
        // javascript RegExp has a bug when the match has length 0
        if (match.index === regex.lastIndex) {
            ++regex.lastIndex;
        }
        result.push(match[0]);
    }
    return result;
}