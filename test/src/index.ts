const tests = [
    './pipeline.test',
    './mergeAdapter.test'
];

const res = {
    success: 0,
    failure: 0
};

tests.forEach(test => {
    try {
        require(test);
        res.success++;
    }
    catch (e) {
        console.error(e);
        res.failure++;
    }
});

console.log(res);