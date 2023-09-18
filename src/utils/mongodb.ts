import { MongoClient } from 'mongodb';
import { config } from '../config/config';

const url = `${config.mongodb.url}`;

export async function insertMany(data: any[], dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertMany(data);
    client.close();
}

export async function clearCollection(dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    client.close();
}