const { anya, commands } = require('./commands')
console.log(anya)
module.exports = {
  anya,
  commands,
  myfunc: require('./myfunc'),
//  plugin: require('./plugins'),
  stylish: require('./stylish-font'),
  similar: require('./similar'),
  urlFix: require('./mongoUrlFix'),
  grpEvent: require('./group-event')
}
