const Config = require("../../config");
const { findSwitch } = require('./mongoDB');
const eventSwitch = findSwitch();

   /**
    * Group Chnages Notification
    * Available for public use
    */
exports.eventListner = async (groupAction, anyaV2) => {
  try {
    const eventSwitch = await findSwitch();
   if (!eventSwitch.events) return;
   try {
     var groupProfile = await anyaV2.profilePictureUrl(groupAction[0].id, 'image');
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

exports.eventListner2 = async (groupEvent, anyaV2) => {
  try {
  const eventSwitch = await findSwitch();
  const metadata = await anyaV2.groupMetadata(groupEvent.id);
  const users = groupEvent.participants;
  try {
   var ppuser = await anyaV2.profilePictureUrl(users[0], 'image')
  } catch {
   var ppuser = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg' };
  try {
   var ppgroup = await anyaV2.profilePictureUrl(groupEvent.id, 'image')
  } catch {
   var ppgroup = 'https://i.ibb.co/ZKKSZHT/Picsart-23-06-24-13-36-01-843.jpg' };
  if (groupEvent.action === 'promote') {
  if (eventSwitch.promote) return await anyaV2.sendMessage(groupEvent.id, {
           image: { url: ppuser },
           caption: Config.promote.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa),
           mentions: [users[0]]          
        });
   } else if (groupEvent.action === 'demote') {
  if (eventSwitch.demote) return await anyaV2.sendMessage(groupEvent.id, {
           image: { url: ppuser },
           caption: Config.demote.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa),
           mentions: [users[0]]          
        });
  } else if (groupEvent.action === 'add') {
  if (eventSwitch.welcome) return await anyaV2.sendMessage(groupEvent.id, {
           image: { url: ppuser },
           caption: Config.welcome.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa).replace('$membersth', metadata.participants.length + 'th'),
           mentions: [users[0]]          
        });
  } else if (groupEvent.action === 'remove') {
  if (eventSwitch.goodbye) return await anyaV2.sendMessage(groupEvent.id, {
           image: { url: ppuser },
           caption: Config.left.replace('$user', users[0].split("@")[0]).replace('$prefix ', prefa).replace('$membersth', metadata.participants.length + 'th'),
            mentions: [users[0]]          
        });
     }
       } catch (error) {
//    console.error("Error:", error);
  }
}

