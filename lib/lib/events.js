const Config = require("../../config");
const { findSwitch } = require('./mongoDB');
const eventSwitch = findSwitch();
const axios = require("axios");
async function getBuffer(url, options) {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
		    	},
	 		...options,
			responseType: 'arraybuffer'
    	})
   	return res.data
    	} catch (err) {
		return err
	}
}

   /**
    * Group Chnages Notification
    * Available for public use
    */
exports.eventListner = async (groupAction, anyaV2) => {
  try {
    const eventSwitch = await findSwitch();
   if (!eventSwitch.events) return;
   try {
     var groupProfile = await anyaV2.profilePictureUrl(event.id, 'image');
   } catch {
     var groupProfile = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg';
     }
  if (groupAction[0].announce == true) return anyaV2.sendMessage(groupAction[0].id, {
        image: { url: groupProfile },
        caption: "*✅ Action:* Group Closed\n*✨ Desc:* _No one can now send messages in this group, exept group admins._",
      });
   if (groupAction[0].announce == false) return anyaV2.sendMessage(groupAction[0].id, {
        image: { url: groupProfile },
        caption: "*✅ Action:* Group Opened\n*✨ Desc:* _Anyone can send messages in this group now._",
      });
   if (groupAction[0].restrict == true) return anyaV2.sendMessage(groupAction[0].id, {
        image: { url: groupProfile },
        caption: "*✅ Action:* Group Edit Restricted\n*✨ Desc:* _No one can change this group's information now, except group admins._",
      });
   if (groupAction[0].restrict == false) {
      anyaV2.sendMessage(groupAction[0].id, {
        image: { url: groupProfile },
        caption: "*✅ Action:* Group Edit Un-restricted\n*✨ Desc:* _Anyone can edit group's information now._",
      });
    } else {
      anyaV2.sendMessage(groupAction[0].id, {
        image: { url: groupProfile },
        caption: `*✅ Action:* Group Subject Changed\n*✨ New Name:* ${groupAction[0].subject}`,
      });
    }
    } catch (error) {
    console.error("Error:", error);
  }
}

  

exports.eventListner2 = async (event, anyaV2) => {
  try {
  const eventSwitch = await findSwitch();
  const users = event.participants;
  try {
   var ppuser = await anyaV2.profilePictureUrl(users[0], 'image')
  } catch {
   var ppuser = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg' };
  try {
   var ppgroup = await anyaV2.profilePictureUrl(event.id, 'image')
  } catch {
   var ppgroup = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg' };
  if (event.action === 'promote') {
  if (eventSwitch.promote) return anyaV2.sendMessage(event.id, {
           caption: Config.promote.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa),
           image: await getBuffer(ppuser),
           headerType: 4,
           mentions: [users[0]]          
        });
   } else if (event.action === 'demote') {
  if (eventSwitch.demote) return anyaV2.sendMessage(event.id, {
           caption: Config.demote.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa),
           image: await getBuffer(ppuser),
           headerType: 4,
           mentions: [users[0]]          
        });
  } else if (event.action === 'add') {
  if (eventSwitch.welcome) return anyaV2.sendMessage(event.id, {
           caption: Config.welcome.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa).replace('$membersth', metadata.participants.length + 'th'),
           image: await getBuffer(ppuser),
           headerType: 4,
           mentions: [users[0]]          
        });
  } else if (event.action === 'remove') {
  if (eventSwitch.goodbye) return anyaV2.sendMessage(event.id, {
           caption: Config.left.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa).replace('$membersth', metadata.participants.length + 'th'),
           image: await getBuffer(ppuser),
           headerType: 4,
           mentions: [users[0]]          
        });
     }
       } catch (error) {
    console.error("Error:", error);
  }
}

