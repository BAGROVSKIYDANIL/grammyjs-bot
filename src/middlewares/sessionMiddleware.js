const {session} = require('grammy')
const {FileAdapter} = require('@grammyjs/storage-file')

const storage = new FileAdapter({
    dir: 'sessions',
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data), 
})

const sessionMiddleware = session({
    initial: () => ({}),
    storage: storage,
});
module.exports = { sessionMiddleware };