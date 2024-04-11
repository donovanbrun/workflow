import assert from 'assert';
import { Pipeline } from 'workflow.io';

const input = [
    {
        title: "Product 1",
        price: 100,
        discountPercentage: 10,
        rating: 4.5
    },
    {
        title: "Product 2",
        price: 200,
        discountPercentage: 20,
        rating: 4.7
    },
    {
        title: "Product 3",
        price: 300,
        discountPercentage: 30,
        rating: 4.8
    }
];

const expectedOutput = [
    {
        id: 0,
        title: "Product 1",
        price: 100,
        realPrice: 90,
        rating: 4.5
    },
    {
        id: 1,
        title: "Product 2",
        price: 200,
        realPrice: 160,
        rating: 4.7
    },
    {
        id: 2,
        title: "Product 3",
        price: 300,
        realPrice: 210,
        rating: 4.8
    }
];

export async function testPipeline() {
    const pipeline = Pipeline.create([
        (data) => data.map((d, i) => {
            return {
                title: d.title,
                price: d.price,
                realPrice: Math.floor(d.price * (1 - d.discountPercentage / 100)),
                rating: d.rating
            }
        }),
        (data: any[]) => data.map((d, i) => {
            return {
                id: i,
                ...d
            }
        }),
    ]);

    const output = await pipeline.process(input);
    assert.deepEqual(output, expectedOutput);
}
