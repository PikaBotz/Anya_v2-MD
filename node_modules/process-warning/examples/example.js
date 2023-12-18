'use strict'

const warning = require('..')()

warning.create('DeprecationWarning', 'CUSTDEP001', 'This is a deprecation warning')

warning.emit('CUSTDEP001')
