async function create_new_ad({caption, url, filename, file, page_id}) {
    try {
        let body = new FormData();
        body.append('file', file);
        body.append('caption', caption);
        body.append('url', url);
        body.append('page_id', page_id);
        body.append('filename', filename);

        console.log(body)

        await fetch('http://localhost:3000/api/create_fb_post', {
            method: 'POST',
            headers: {auth: secret_key},
            body: body
        })

    } catch (error) {
        console.log(error)
    }
}