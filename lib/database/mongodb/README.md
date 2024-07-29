# Queen Anya v2 🎀

Welcome to the Queen Anya v2 project, managed by [`@PikaBotz`](https://github.com/PikaBotz).

[![GitHub stars](https://img.shields.io/github/stars/PikaBotz/anya_v2-MD?style=social)](https://github.com/PikaBotz/anya_v2-MD/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PikaBotz/anya_v2-MD?style=social)](https://github.com/PikaBotz/anya_v2-MD/network/members)

## Project Details

- **Creation Date:** `December 22, 2022, 01:55:10 PM`
- **Project Status:** Maintained ✔️

## Overview

Queen Anya v2 is a JavaScript project built on the commonjs (Node.js) platform. The codebase leverages the Baileys library (as of 2024).

### How To Create A Database ⁉️

1. Import `mongoose` nodejs module.

   ```javascript
   const mongoose = require('mongoose');

2. Create a mongoose structure `Schema`.

   ```javascript
   const Schema = new mongoose.Schema({
       id: { type: String, required: true, unique: true }, // This Id string is compulsory for flexible data modifications
   
       /**
        * How to create a Boolean object:
        * Put a Boolean type on `default` parameter for a default upload object
        */
        ban: { type: Boolean, default: false },

       /**
        * How to create a String object:
        * Put a String on `default` parameter for a default upload
        */
        name: { type: String, default: "unknown" },

       /**
        * How to create a Number object:
        * Put a Number int on `default` parameter for a default upload
        */
        age: { type: Number, default: 69 },

        /**
         * How to create an Array object:
         */
        groups: [{ type: String }]
   });

3. Export the `Schema`.

   ```javascript
   /**
    * Put a collection name String, it's compulsory l
    * For example here I'm putting "user" here as a collection name
   */
   const User = mongoose.model("user", Schema);
   module.exports = { User };

### How To Fetch And Modify This Database ⁉️

1. Import `The Database` from the mongodb directory

   ```javascript
   // For example, I'm importing `User` database from `./database/mongodb` directory here
   const { User } = require('./database/mongodb');

2. Fetch collection data from mongodb

   ```javascript
   /**
   * There are two fetch techniques:
   * 1. For fetching multiple items from a collection.
   * 2. For fetching a single item from a collection.
   *
   * When fetching multiple items, use the specific data id. For example, 
   * I'm using my number because I inserted the data with this id.
   */

   // Fetching multiple items
   const user = await User.findOne({ id: "91881107xxxx" }) || await new User({ id: "91881107xxxx" }).save();
   console.log(user);

   // Fetching a single item
   const bot = await Bot.findOne({ id: 'anyabot' }) || await new Bot({ id: 'anyabot' }).save(); 
   // Here, I used "anyabot" because the collection's name is "anybot".
   console.log(bot);

3. How to modify a `multi collection database`.

   ```javascript
   // For example, modifying user's `ban` Boolean to `true`
   await User.findOneAndUpdate({ id: "91881107xxxx" }, { $set: { ban: true } }, { new: true });
   // Same goes for String, Boolean and Number
   
4. How to modify a `single collection database`.
 
   ```javascript
   // For example, modifying `react` Boolean to `false`
   await Bot.updateOne({ id: "anyabot" }, { react: false });
   // Here I used "Bot" because it's schema's name is "Bot"
   // Same goes for String, Boolean and Number

5. How to `add` a string in an `Array` in single and multi collection database

   ```javascript
   // In a multi collection database:
   const data = "1234@g.us";
   const user = await User.findOne({ id: "91881107xxxx" }) || await new User({ id: "91881107xxxx" }).save();
   user.groups.push(data);
   await user.save();

   // In a single collection database:
   const data = "91690090xxxx";
   const bot = await Bot.findOne({ id: 'anyabot' }) || await new Bot({ id: 'anyabot' }).save(); 
   bot.modlist.push(data);
   await bot.save();
   
6. How to `delete` a string in an `Array` in single and multi collection database

    ```javascript
   // In a multi collection database:
   const data = "1234@g.us";
   const user = await User.findOne({ id: "91881107xxxx" }) || await new User({ id: "91881107xxxx" }).save();
   user.groups.splice(data, 1);
   await user.save();

   // In a single collection database:
   const data = "91690090xxxx";
   const bot = await Bot.findOne({ id: 'anyabot' }) || await new Bot({ id: 'anyabot' }).save(); 
   bot.modlist.splice(data, 1);
   await bot.save();
      
## License

This project is licensed under the [`MIT License`](LICENSE).

Feel free to star ⭐ and fork 🍴 this repository to show your support!
