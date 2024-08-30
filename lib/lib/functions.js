const {
    proto,
    getContentType,
    WAMessageProto
} = require('@queenanya/baileys');

/**
 * Serialize Message
 * @param {WAconnection} anyaV2 
 * @param {Object} pika 
 * @param {store} store 
 */
exports.smsg = async (anyaV2, pika, store) => {
    if (!pika) return pika;

    const M = proto.WebMessageInfo;
    const botIdentifiers = ['BAES', 'BAE5', '3EBO', '3EB0', 'ANYAWEB', 'SHIZOWEB'];

    if (pika.key) {
        pika.id = pika.key.id;
        const checkBot = (uid) => botIdentifiers.some(id => uid.startsWith(id) || uid.includes(id)) && uid.length >= 12;
        const cbot = checkBot(pika.id);
        pika.isBot = cbot;
        pika.isBaileys = cbot;
        pika.chat = pika.key.remoteJid;
        pika.fromMe = pika.key.fromMe;
        pika.isGroup = pika.chat.endsWith('@g.us');
        pika.isPrivate = pika.chat.endsWith('@s.whatsapp.net');
        pika.isChannel = pika.chat.endsWith('@newsletter');
        pika.sender = anyaV2.decodeJid((pika.fromMe ? anyaV2.user.id : pika.participant || pika.key.participant) || pika.chat || '');
        if (pika.isGroup) pika.participant = anyaV2.decodeJid(pika.key.participant) || '';
    }

    if (pika.message) {
        pika.mtype = getContentType(pika.message);
        pika.msg = (pika.mtype === 'viewOnceMessage' ? pika.message[pika.mtype].message[getContentType(pika.message[pika.mtype].message)] : pika.message[pika.mtype]);

        try {
            pika.body = pika.mtype === 'conversation' ? pika.message.conversation :
                        pika.mtype === 'imageMessage' ? (pika.message.imageMessage.caption || '') :
                        pika.mtype === 'videoMessage' ? (pika.message.videoMessage.caption || '') :
                        pika.mtype === 'extendedTextMessage' ? (pika.message.extendedTextMessage.text || '') :
                        pika.mtype === 'buttonsResponseMessage' ? pika.message.buttonsResponseMessage.selectedButtonId :
                        pika.mtype === 'listResponseMessage' ? pika.message.listResponseMessage.singleSelectReply.selectedRowId :
                        pika.mtype === 'interactiveResponseMessage' ? JSON.parse(pika.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id :
                        pika.mtype === 'templateButtonReplyMessage' ? pika.message.templateButtonReplyMessage.selectedId :
                        pika.mtype === 'messageContextInfo' ? (pika.message.buttonsResponseMessage?.selectedButtonId ||
                                                             pika.message.listResponseMessage?.singleSelectReply.selectedRowId ||
                                                             pika.text) :
                        pika.mtype === 'viewOnceMessageV2' ? (pika.message.viewOnceMessageV2.message.imageMessage ? pika.message.viewOnceMessageV2.message.imageMessage.caption || '' :
                                                             pika.message.viewOnceMessageV2.message.videoMessage ? pika.message.viewOnceMessageV2.message.videoMessage.caption || '' : '') : '';
            if (pika.mtype === 'viewOnceMessageV2') {
                pika.viewOnceMessageType = pika.message.viewOnceMessageV2.message.imageMessage ? "imageMedia" : "videoMedia";
            }
        } catch {
            pika.body = false;
        }

        let quoted = pika.quoted = pika.msg.contextInfo ? pika.msg.contextInfo.quotedMessage : null;
        pika.mentionedJid = pika.msg?.contextInfo?.mentionedJid || [];
        if (pika.quoted) {
            let type = getContentType(quoted);
            pika.quoted = pika.quoted[type];
            if (typeof pika.quoted === 'string') pika.quoted = { text: pika.quoted };
            if (!quoted.viewOnceMessageV2) {
                pika.quoted.mtype = type;
                pika.quoted.id = pika.msg.contextInfo.stanzaId;
                pika.quoted.chat = pika.msg.contextInfo.remoteJid || pika.chat;
                const cqbot = checkBot(pika.quoted.id);
                pika.quoted.isBot = cqbot;
                pika.quoted.isBaileys = cqbot;
                pika.quoted.sender = anyaV2.decodeJid(pika.msg.contextInfo.participant);
                pika.quoted.fromMe = pika.quoted.sender === (anyaV2.user && anyaV2.user.id);
                pika.quoted.text = pika.quoted.text || pika.quoted.caption || pika.quoted.conversation || pika.quoted.contentText || pika.quoted.selectedDisplayText || pika.quoted.title || '';
                pika.quoted.mentionedJid = pika.msg?.contextInfo?.mentionedJid || [];

                pika.getQuotedObj = pika.getQuotedMessage = async () => {
                    if (!pika.quoted.id) return false;
                    let q = await store.loadMessage(pika.chat, pika.quoted.id, anyaV2);
                    return exports.smsg(anyaV2, q, store);
                };

                let vM = pika.quoted.fakeObj = M.fromObject({
                    key: {
                        remoteJid: pika.quoted.chat,
                        fromMe: pika.quoted.fromMe,
                        id: pika.quoted.id
                    },
                    message: quoted,
                    ...(pika.isGroup ? { participant: pika.quoted.sender } : {})
                });

                pika.quoted.delete = async () => await anyaV2.sendMessage(pika.chat, { delete: key });

                pika.forwardMessage = (jid, forceForward = true, options = {}) =>
                    anyaV2.copyNForward(jid, vM, forceForward, { contextInfo: { isForwarded: false } }, options);

                pika.quoted.download = () => anyaV2.downloadMediaMessage(pika.quoted);
             }
          }
        }
        pika.text = pika.msg.text || pika.msg.caption || pika.message.conversation || pika.msg.contentText || pika.msg.selectedDisplayText || pika.msg.title || '';

        pika.copy = () => exports.smsg(anyaV2, M.fromObject(M.toObject(pika)));

        pika.copyNForward = (jid = pika.chat, forceForward, options = {}) =>
            anyaV2.copyNForward(jid, pika, forceForward, options);

        pika.reply = async (text, options = {}) => {
            const ui = await UI.findOne({ id: "userInterface" }) || (await new UI({ id: "userInterface" }).save());
            const contextInfo = {
                mentionedJid: options.mentions || [],
                forwardingScore: 999,
                isForwarded: options.forwarded !== undefined ? options.forwarded : true
            };
            if (ui.reply === 1) {
                anyaV2.sendMessage(pika.chat, { text: text, mentions: options.mentions }, { quoted: pika });
            } else if (ui.reply === 2) {
                anyaV2.sendMessage(pika.chat, { text: text, mentions: options.mentions, contextInfo: contextInfo }, { quoted: pika });
            } else if (ui.reply === 3) {
                await anyaV2.sendMessage(pika.chat, {
                    text: text,
                    mentions: options.mentions,
                    contextInfo: {
                        mentionedJid: options.mentions,
                        externalAdReply: {
                            renderLargerThumbnail: true,
                            title: Config.botname,
                            mediaType: 1,
                            thumbnail: await getBuffer(Config.imageUrl),
                            mediaUrl: Config.groupLink,
                            sourceUrl: Config.groupLink,
                        }
                    }
                }, { quoted: pika });
            } else if (ui.reply === 4) {
                await anyaV2.sendMessage(pika.chat, {
                    text: text,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        mentionedJid: options.mentions,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: Config.botname,
                            newsletterJid: "120363193293157965@newsletter",
                        },
                        externalAdReply: {
                            showAdAttribution: true,
                            title: Config.ownername,
                            body: Config.botname,
                            thumbnailUrl: Config.imageUrl,
                            sourceUrl: Config.socialLink,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: pika });
            } else if (ui.reply === 5) {
                await anyaV2.relayMessage(pika.chat, {
                    requestPaymentMessage: {
                        currencyCodeIso4217: 'INR',
                        amount1000: '69000',
                        requestFrom: pika.sender,
                        noteMessage: {
                            extendedTextMessage: {
                                text: text,
                                contextInfo: {
                                    mentionedJid: options.mentions,
                                    externalAdReply: {
                                        showAdAttribution: true
                                    }
                                }
                            }
                        }
                    }
                }, { quoted: pika });
            }
        };

        pika.react = (emoji) => anyaV2.sendMessage(pika.chat, { react: { text: emoji, key: pika.key } });

        pika.edit = (text, key, options = {}) =>
            anyaV2.sendMessage(pika.chat, { text: text, mentions: options.mentions, edit: key });

        pika.keyMsg = async (text) => {
            const key = await anyaV2.sendMessage(pika.chat, { text: text }, { quoted: pika });
            return key;
        };


        pika.download = () => anyaV2.downloadMediaMessage(pika.msg);
        
        pika.deleteMsg = (key) => anyaV2.sendMessage(pika.chat, { delete: key });
        
        pika.sendContact = (name, info, number) => {
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${info};\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            anyaV2.sendMessage(pika.chat, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: pika });
        };

    return pika;
};
