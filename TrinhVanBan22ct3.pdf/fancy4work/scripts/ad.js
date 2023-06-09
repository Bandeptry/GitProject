async function create_new_ad({caption, url, filename, file, page_id}) {
    try {
        let body = {
            file: URL.createObjectURL(file),
            caption,
            url,
            page_id,
            filename
        }

        await chrome.runtime.sendMessage({
            command: 'rest', data: {
                url: 'https://xwriter.space/api/create_ad',
                method: 'POST',
                headers: {
                    'auth': secret_key
                },
                data: body,
                body_type: 'form_data',
                type: 'json'
            }
        })

    } catch (error) {
        console.log(error)
    }
}