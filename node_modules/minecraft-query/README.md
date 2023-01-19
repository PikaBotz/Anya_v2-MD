# query
A Node.js implementation of Minecraft's query protocol

# Installation
`npm install minecraft-query`
#

# Prerequisites
You will first have to configure your server to recieve queries from clients.<br>
To do so, set the `enable-query` flag to `true` in your `server.properties` file and then set the `query.port` flag as you wish. <br>
The configuration should look like this<br>
```
...
enable-query=true
query.port=<1-65535>
...
```

# Example use
```
const Query = require("minecraft-query");

const q = new Query({host: 'localhost', port: 9630, timeout: 7500});

q.fullStat()
  .then(success => {

    console.log(success);

    return q.basicStat()

  })

  .then(success => {

    console.log(success);

    q.close();

  })
```
#

# API
*class* `Query({host, port, timeout})`<br>
##### Arguments:
* `host`: the address of the server
* `port`: the query port of the server
* `timeout`: handshake timeout in ms (default 5000)

It returns a Query instance.<br>
#

`Query#basicStat()`<br>
##### Arguments: 
* none

A promise that returns an object that corresponds to the [basic stat query type](https://wiki.vg/Query#Basic_stat).
The object should look like this:
```
{ 
  motd: 'MOTD here',
  gametype: 'SMP',
  map: 'world',
  online_players: '0',
  max_players: '20' 
}
```
#
`Query#close()`
##### Arguments: 
* none

It ends the connection
#
`Query#fullStat()`
##### Arguments: 
* none

A promise that returns an object that corresponds to the [full stat query type](https://wiki.vg/Query#Full_stat).
The object should look like this:
```
{ 
  motd: 'MOTD here',
  gametype: 'SMP',
  game_id: 'MINECRAFT',
  version: '1.14.2',
  plugins: 'Paper on 1.14.2-R0.1-SNAPSHOT',
  map: 'world',
  online_players: '4',
  max_players: '20',
  port: '9630',
  players: ['macca_ferri', 'player1', 'notch', 'jeb'] 
}
```
