'use strict';

class Deposit {

    constructor() {
        this.name = 'Deposit';
    }
    /**
     * [reactionPermissions description]
     * @param  {[type]} user    [description]
     * @return {[type]}         [description]
     */
    confirmReaction(user, guildMembers, reaction, embedMessage) {

        const member = guildMembers.fetch(user.id).then( member => {

            /**
             * [if description]
             * @param  {[object]} member  member object recieved from members .fetch, .then check roles cache for role
             * @return {[type]}         [description]
             */
            if ( member.roles.cache.has('883400308447916053') ) {

                console.log(`Approved! ${user.tag} has permissions.`)

                if ( reaction.emoji.name === '👍' ) {
                    embedMessage.reactions.cache.get('❌').remove()
                } else if ( reaction.emoji.name === '❌' ) {
                    embedMessage.reactions.cache.get('👍').remove()
                }

                reaction.users.remove(user.id);

            } else {
                console.log(`${user.tag} does not have permissions.`)
                reaction.users.remove(user.id);
            }
        });

    }

}

module.exports = Deposit;
