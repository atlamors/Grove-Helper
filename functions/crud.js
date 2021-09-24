'use strict'

const date = require('date-and-time')
const { MongoClient } = require('mongodb')
const { mdbProject, mdbPassword } = require('../config.json')

class CRUD {

	constructor() {
		this.name = 'CRUD'
		this.date = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss:SSSZ')
	}
	
	/**
	 * 
	 * @returns 
	 */
	async connect() {
		const uri = `mongodb+srv://${mdbProject}:${mdbPassword}@guild-data.sjfjc.mongodb.net/retryWrites=true&w=majority`
		const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
		
		try {
			await mongo.connect()
			return mongo
		} catch (e) {
			console.error(`${this.date} | ${e}`)
		}
	}

	/**
	 * 
	 * @param {*} mongo 
	 */
	async close(mongo) {
		try {
			await mongo.then( mongo => { mongo.close() })
		} catch (e) {
			console.error(`${this.date} | ${e}`)
		}
	}

	/**
	 * 
	 */
	async listdb() {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db().admin().listDatabases()
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.listdb()
		} finally {
			if (r) {
				console.log(`${this.date} | MongoDB successfully read listings, current databases:`)
				r.databases.forEach( db => { console.log(` - ${db.name}`) })
			} else {
				console.log(`${this.date} | ${document._id} not found in collection ${collection}.`)
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 */
	async create(document, collection) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).insertOne(document)
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.create(document, collection)
		} finally {
			if (r) {
				console.log(`${this.date} | New document created with the _id : ${r.insertedId}.`)
			} else {
				console.log(`${this.date} | Document was unable to be created.`)
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 * @returns 
	 */
	async read(document, collection) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).findOne(document)
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.read(document, collection)
		} finally {
			if (r) {
				console.log(`${this.date} | Returned {${document._id}} from collection ${collection}.`)
				return r
			} else {
				console.log(`${this.date} | ${document._id} not found in collection ${collection}.`)
				return null
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 * @param {*} data 
	 */
	async update(document, collection, data) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).updateOne(document, { $set : data})
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.update(document, collection, data)
		} finally {
			if (r.matchedCount >= 1 && r.modifiedCount >= 1) {
				console.log(`${this.date} | Updated {${document._id}} in collection ${collection}.`)
			} else if ( r.matchedCount >= 1 ) {
				console.log(`${this.date} | No data change detected for {${document._id}} in collection ${collection}.`)
			} else {
				console.log(`${this.date} | ${document._id} not found in collection ${collection}.`)
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 * @param {*} data 
	 * @param {*} options 
	 */
	async upsert(document, collection, data, options) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).updateOne(document, { [options.operator] : data }, { upsert: true })
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.upsert(document, collection, data, options)
		} finally {
			if (r.modifiedCount >= 1) {
				console.log(`${this.date} | Upserted {${document._id}} in collection ${collection}.`)
			} else {
				console.log(`${this.date} | ${document._id} not found in collection ${collection}.`)
			}
		}
	}
	
	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 */
	async delete(document, collection) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).deleteOne(document)
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.delete(document, collection)
		} finally {
			if (r.deletedCount >= 1) {
				console.log(`${this.date} | Deleted {${document._id}} in collection ${collection}.`)
			} else {
				console.log(`${this.date} | ${document._id} not found in collection ${collection}.`)
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 * @returns 
	 */
	async check(document, collection) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).countDocuments({_id: document._id}, { limit: 1 })
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
			this.check(document, collection)
		} finally {
			if (r) {
				console.log(`${this.date} | Verified {${document._id}} from collection ${collection}.`)
				return r
			} else {
				console.log(`${this.date} | ${document._id} not found in collection ${collection}.`)
				return null
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 * @returns 
	 */
	async readMany(documents, collection, dates) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).find(documents, { date: dates }).toArray()
			})
			await this.close(mongo)
		} catch (e) {
			console.error(`${this.date} | ${e}`)
		} finally {
			if (r) {
				console.log(`${this.date} | Returned documents from collection ${collection}.`)
				return r
			} else {
				console.log(`${this.date} | No documents found in collection ${collection}.`)
				return null
			}
		}
	}

	/**
	 * 
	 * @param {*} collection 
	 * @returns 
	 */
		 async readAll(collection) {
			const mongo = this.connect()
	
			try {
				var r = await mongo.then( mongo => {
					return mongo.db(`bank`).collection(collection).find({}).toArray()
				})
				await this.close(mongo)
			} catch (e) {
				console.error(`${this.date} | ${e}`)
			} finally {
				if (r) {
					console.log(`${this.date} | Returned all documents from collection ${collection}.`)
					return r
				} else {
					console.log(`${this.date} | No documents found in collection ${collection}.`)
					return null
				}
			}
		}

}

module.exports = CRUD
