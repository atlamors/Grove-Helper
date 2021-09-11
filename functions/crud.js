'use strict'

const { MongoClient } = require('mongodb')
const { mdbProject, mdbPassword } = require('../config.json')

class CRUD {

	constructor() {
		this.name = 'CRUD'
	}
	
	/**
	 * 
	 * @param {*} project 
	 * @returns 
	 */
	async connect(project) {

		const uri = `mongodb+srv://${mdbProject}:${mdbPassword}@guild-data.sjfjc.mongodb.net/retryWrites=true&w=majority`
		const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
		
		try {
			await mongo.connect()
			return mongo
		} catch (e) {
			console.error(e)
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
			console.error(e)
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
			console.error(e)
		} finally {
			if (r) {
				console.log(`MongoDB successfully read listings, current databases:`)
				r.databases.forEach( db => { console.log(` - ${db.name}`) })
			} else {
				console.log(`${document._id} not found in collection ${collection}.`)
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
			console.error(`${e.name}: ${e.message}`)
		} finally {
			if (r) {
				console.log(`New document created with the _id : ${r.insertedId}.`)
			} else {
				console.log(`Document was unable to be created.`)
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
			console.error(e)
		} finally {
			if (r) {
				console.log(`Returned {${document._id}} from collection ${collection}.`)
				return r
			} else {
				console.log(`${document._id} not found in collection ${collection}.`)
				return null
			}
		}
	}

	/**
	 * 
	 * @param {*} document 
	 * @param {*} collection 
	 */
	async update(document, collection, data) {
		const mongo = this.connect()

		try {
			var r = await mongo.then( mongo => {
				return mongo.db(`bank`).collection(collection).updateOne(document, { $set : data})
			})
			await this.close(mongo)
		} catch (e) {
			console.error(e)
		} finally {
			if (r.matchedCount >= 1 && r.modifiedCount >= 1) {
				console.log(`Updated ${document._id} in collection ${collection}.`)
			} else if ( r.matchedCount >= 1 ) {
				console.log(`No data change detected for ${document._id} in collection ${collection}.`)
			} else {
				console.log(`${document._id} not found in collection ${collection}.`)
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
			console.error(e)
		} finally {
			if (r.deletedCount >= 1) {
				console.log(`Deleted ${document._id} in collection ${collection}.`)
			} else {
				console.log(`${document._id} not found in collection ${collection}.`)
			}
		}
	}

}

module.exports = CRUD
