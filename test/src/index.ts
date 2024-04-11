import { testPipeline } from './pipeline.test';
import { testMergeAdapter } from './mergeAdapter.test';

const tests = [
    testPipeline,
    testMergeAdapter
];

const res = {
    success: 0,
    failure: 0
};

const promises = Promise.all(
    tests.map(async test => {
        try {
            await test();
            res.success++;
        }
        catch (e) {
            console.error(e);
            res.failure++;
        }
    })
);

promises
    .then(() => {
        console.log(res);
    })
    .catch(() => {
        console.error(res);
        process.exitCode = 1;
    });