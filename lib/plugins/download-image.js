exports.cmdName = () => {
  return {
    name: ['image'],
    alias: ['img','pic','image'],
    category: "download",
    desc: "Get 5 high quality images of the given search term."
  };
}

exports.getCommand = async (text, anyaV2, pika) => {
    require('../../config');
    const { get } = require('axios');
    const { load } = require('cheerio');
    const { sleep } = require('../lib/myfunc');
    if (!text) return pika.reply("Enter a search term to proceed!");
    await pika.react("🖼️");
    pika.reply("Here are 5 results for the matching search term!");
    try {
        const pic = await pinterest(text);
        if (pic.length > 0) {
            for (let i = 0; i < pic.length; i++) {
                await anyaV2.sendMessage(pika.chat, {
                    image: { url: pic[i] },
                    headerType: 4
                });
                await sleep(100);
            }
        } else {
            pika.reply("No pictures available for the search term.");
        }
    } catch {
        pika.reply(message.error);
    }
}

async function pinterest(query) {
    const headers = {
        'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
        'cookie': '_auth=1; _b="AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg="; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFVzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1V4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpBYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3UKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE4cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnS1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
    };
    const url = `https://ar.pinterest.com/search/pins/?autologin=true&q=${query}`;
    const response = await get(url, { headers: headers });
    const results = [];
    const $ = load(response.data);
    $('img').each(function () {
        results.push($(this).attr('src'));
    });
    return results;
}
