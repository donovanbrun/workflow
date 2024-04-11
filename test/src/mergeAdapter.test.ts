import assert from "assert";
import { MergeAdapter } from "workflow.io";

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
    },
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

export async function testMergeAdapter() {
    const mergeAdapter = new MergeAdapter([
        (data) => input,
        (data) => input
    ])

    const output = await mergeAdapter.process([]);
    assert.deepEqual(output, expectedOutput);
}