const { MongoClient } = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://grove-helper:6TiHLJQqVZUMdi9N@guild-data.sjfjc.mongodb.net/guild-data?retryWrites=true&w=majority";


    const mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await mongo.connect();

        // Make the appropriate DB calls
        await  listDatabases(mongo);

    } catch (e) {
        console.error(e);
    } finally {
        await mongo.close();
    }
}

async function listDatabases(mongo){
    databasesList = await mongo.db().admin().listDatabases();

    console.log("MongoDB connection successfull, current databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);
