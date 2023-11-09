const { proto, getContentType } = require('@queenanya/baileys');

exports.smsg = (anyaV2, pika, storage) => {
    if (!pika) return pika
    let M = proto.WebMessageInfo
    if (pika.key) {
        pika.id = pika.key.id
        pika.isBaileys = pika.id.startsWith('BAE5') && pika.id.length === 16
        pika.chat = pika.key.remoteJid
        pika.fromMe = pika.key.fromMe
        pika.isGroup = pika.chat.endsWith('@g.us')
        pika.sender = anyaV2.decodeJid(pika.fromMe && anyaV2.user.id || pika.participant || pika.key.participant || pika.chat || '')
        if (pika.isGroup) pika.participant = anyaV2.decodeJid(pika.key.participant) || ''
    }
    if (pika.message) {
        pika.mtype = getContentType(pika.message)
        pika.msg = (pika.mtype == 'viewOnceMessage' ? pika.message[pika.mtype].message[getContentType(pika.message[pika.mtype].message)] : pika.message[pika.mtype])
        pika.body = pika.message.conversation || pika.msg.caption || pika.msg.text || (pika.mtype == 'listResponseMessage') && pika.msg.singleSelectReply.selectedRowId || (pika.mtype == 'buttonsResponseMessage') && pika.msg.selectedButtonId || (pika.mtype == 'viewOnceMessage') && pika.msg.caption || pika.text
        let quoted = pika.quoted = pika.msg.contextInfo ? pika.msg.contextInfo.quotedMessage : null
        pika.mentionedJid = pika.msg.contextInfo ? pika.msg.contextInfo.mentionedJid : []
        if (pika.quoted) {
            let type = getContentType(quoted)
			pika.quoted = pika.quoted[type]
            if (['productMessage'].includes(type)) {
				type = getContentType(pika.quoted)
				pika.quoted = pika.quoted[type]
			}
            if (typeof pika.quoted === 'string') pika.quoted = {
				text: pika.quoted
			}
            pika.quoted.mtype = type
            pika.quoted.id = pika.msg.contextInfo.stanzaId
			pika.quoted.chat = pika.msg.contextInfo.remoteJid || pika.chat
            pika.quoted.isBaileys = pika.quoted.id ? pika.quoted.id.startsWith('BAE5') && pika.quoted.id.length === 16 : false
			pika.quoted.sender = anyaV2.decodeJid(pika.msg.contextInfo.participant)
			pika.quoted.fromMe = pika.quoted.sender === (anyaV2.user && anyaV2.user.id)
            pika.quoted.text = pika.quoted.text || pika.quoted.caption || pika.quoted.conversation || pika.quoted.contentText || pika.quoted.selectedDisplayText || pika.quoted.title || ''
			pika.quoted.mentionedJid = pika.msg.contextInfo ? pika.msg.contextInfo.mentionedJid : []
            pika.getQuotedObj = pika.getQuotedMessage = async () => {
			if (!pika.quoted.id) return false
			let q = await storage.loadMessage(pika.chat, pika.quoted.id, anyaV2)
 			return exports.smsg(anyaV2, q, storage)
            }
            let vM = pika.quoted.fakeObj = M.fromObject({
                key: {
                    remoteJid: pika.quoted.chat,
                    fromMe: pika.quoted.fromMe,
                    id: pika.quoted.id
                },
                message: quoted,
                ...(pika.isGroup ? { participant: pika.quoted.sender } : {})
            })
       pika.quoted.delete = () => anyaV2.sendMessage(pika.quoted.chat, { delete: vM.key })
       pika.quoted.download = () => anyaV2.downloadMediaMessage(pika.quoted)
        }
    }
    if (pika.msg.url) pika.download = () => anyaV2.downloadMediaMessage(pika.msg)
    pika.text = pika.msg.text || pika.msg.caption || pika.message.conversation || pika.msg.contentText || pika.msg.selectedDisplayText || pika.msg.title || ''
    pika.reply = (text, options = {}) => anyaV2.sendMessage(pika.chat, { text: text, mentions: options.mentions }, { quoted:pika })
    pika.react = (emoji) => anyaV2.sendMessage(pika.chat, { react: { text: emoji, key: pika.key } })
    pika.edit = (text, key, options = {}) => anyaV2.sendMessage(pika.chat, { text: text, mentions: options.mentions, edit: key })
    pika.delete = (key) => anyaV2.sendMessage(pika.chat, { delete: key })
  	pika.copy = () => exports.smsg(anyaV2, M.fromObject(M.toObject(pika)))
	  pika.copyNForward = (jid = pika.chat, forceForward = false, options = {}) => anyaV2.copyNForward(jid, pika, forceForward, options)
    return pika
};
