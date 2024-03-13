import { MongoClient } from 'mongodb';

export async function insertMany(url: string, data: any[], dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.insertMany(data);
    client.close();
}

export async function clearCollection(url: string, dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    client.close();
}

export async function fetchCollection(url: string, dbName: string, collectionName: string) {
    const client = await MongoClient.connect(url)

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const res = await collection.find().toArray();
    client.close();

    return res;
}