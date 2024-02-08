import { MongoClient } from 'mongodb';

export async function insertMany(config: any, data: any[], dbName: string, collectionName: string) {
    const client = await MongoClient.connect(config.mongodb.url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertMany(data);
    client.close();
}

export async function clearCollection(config: any, dbName: string, collectionName: string) {
    const client = await MongoClient.connect(config.mongodb.url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    client.close();
}

export async function fetchCollection(config: any, dbName: string, collectionName: string) {
    const client = await MongoClient.connect(config.mongodb.url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const res = await collection.find().toArray();
    client.close();

    return res;
}