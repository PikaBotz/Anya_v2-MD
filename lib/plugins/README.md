# Queen Anya v2 🎀

Welcome to the Queen Anya v2 project, managed by [`@PikaBotz`](https://github.com/PikaBotz).

[![GitHub stars](https://img.shields.io/github/stars/PikaBotz/anya_v2-MD?style=social)](https://github.com/PikaBotz/anya_v2-MD/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/PikaBotz/anya_v2-MD?style=social)](https://github.com/PikaBotz/anya_v2-MD/network/members)

## Project Details

- **Creation Date:** `December 22, 2022, 01:55:10 PM`
- **Project Status:** Maintained ✔️

## Overview

Queen Anya v2 is a JavaScript project built on the commonjs (Node.js) platform. The codebase leverages the Baileys library (as of 2024).

## Acknowledgments

A special thanks to all contributors and supporters who have been part of this project!

## Get Started

To explore or contribute to Queen Anya v2, visit the [`GitHub repository`](https://github.com/PikaBotz/anya_v2-MD).
### How To Create Plugins ⁉️

1. Import `anya` from the `plugins.js` file.

   ```javascript
   const { anya } = require(`../lib/plugins`); // or simply use "../lib" path for a shortcut

2. Implement parameters such as `name`, `alias (optional)`, `react (optional)`, `need (optional)`, `category`, `desc`, `cooldown (optional)`, `rule (optional)`, and finally `filename` in the `anya` module.

   ```javascript
   const { anya } = require(`../lib/plugins`); // or simply use "../lib" path for a shortcut

   anya({
             name: "sticker", // {String} name of the plugin
             alias: ['s', 'stick'], // {Array} alias for the plugin (optional, don't include this parameter if there's no alias)
             react: "🌌", // {Emoji} reaction emoji for the plugin (optional, don't include this parameter if there's no command reaction needed)
             need: "image", // {String} needed parameter for the plugin to display on the menu/list message (optional, don't include this parameter if you don't want to display the needed params or it doesn't need any param)
             category: "convert", // {String} category of the plugin command
             desc: "Convert Images/Videos Into Stickers", // {String} description of the plugin command
             cooldown: 3, // {Number} cooldown timer in seconds for the command (optional, don't include this parameter if you want to use the default cooldown timer from the config.js file)
            /** rules
             *
             * rule: 0,
             * - everyone will able to use this command everywhere
             *
             * rule: 1,
             * - only owner can use this command everywhere
             *
             * rule: 2,
             * - only owner and group admins can use this command in the group
             *
             * rule: 3,
             * - only owner and group admins can use this command while bot is also an admin in the group
             *
             * rule: 4,
             * - everyone will be able to use this command but only in private chat
             *
             * rule: 5,
             * - everyone will be able to use this command but only in group chats
             *
             * rule: 6,
             * - only owner will be able to use this command but in group chats
             *
             * rule: 7,
             * - only owner will be able to use this command but only in private chat
             *
             */     
             rule: 0, // {Number} access rule for the command (optional, don't include this parameter if you want to use the default rule 0)
             filename: __filename // {String} compulsory parameter
   }, async (anyaV2, pika, { args, prefix, command }) => {
       /**
        * logic of the plugin
        */
   });

## License

This project is licensed under the [`MIT License`](LICENSE).

Feel free to star ⭐ and fork 🍴 this repository to show your support!
