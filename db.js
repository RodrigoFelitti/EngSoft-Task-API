import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapter = new JSONFile('db.json')
const db = new Low(adapter, {
    users: [],
    tasks: [],
    blacklistedTokens: []
});

export default db;