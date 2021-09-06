/**
 * Grove Helper
 */

global.__root = __dirname

require('./core/deploy-mongo.js')
require('./core/deploy-functions.js')
require('./core/deploy-discord.js')
require('./core/deploy-commands.js')