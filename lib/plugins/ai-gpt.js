exports.cmdName = () => ({
  name: ['gpt'],
  category: "ai",
  need: "query",
  alias: ['chatgpt', 'ai'],
  desc: "World's most intelligent human-level thinking AI developed by OpenAI."
});

exports.getCommand = async (text, anyaV2, command, pika) => {
  if (!text) return pika.reply(`Please provide some text or quote a message to get a response.`);
  await pika.react("🗣️");
  const proceed = await anyaV2.sendMessage(pika.chat, { text: "📶 Getting response..." }, { quoted: pika });
  try {
    const response = await gpt(text);
    if (response) {
      pika.edit("*AI:* " + response, proceed.key);
    } else {
      pika.edit("❌ No valid response found.", proceed.key);
    }
  } catch (error) {
    console.error(error);
    pika.edit("❌ An error occurred while getting the response.", proceed.key);
  }
};

async function gpt(query) {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const response = await fetch("https://forward.free-chat.asia/v1/chat/completions", {
      method: "POST",
      headers: {
        "Origin": "https://anse.free-chat.asia",
        "Referer": "https://anse.free-chat.asia/",
        "Authorization": "Bearer undefined",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: query }],
        model: "gpt-3.5-turbo-16k",
        temperature: 0.7,
//        max_tokens: 4096,
        stream: false
      })
    });
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Invalid JSON response:", text);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
