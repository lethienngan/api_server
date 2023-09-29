const asyncWrapper = async (promise) => {
    try {
        const data = await promise;
        return [data, undefined];
    } catch (error) {
        return [undefined, error];
    }
};
const asyncFetchWrapper = async (url) => {
    try {
        const data = await fetch(url).then((res) => res.json());
        return [data, undefined];
    } catch (error) {
        return [undefined, error];
    }
};
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const AllSettledHandler = (...args) => {
    const values = [];
    const errors = [];
    for (const arg of args) {
        arg.status !== "rejected"
            ? values.push(arg.value)
            : errors.push(arg.reason);
    }
    return [errors, values];
};
module.exports = { asyncWrapper, asyncFetchWrapper, sleep, AllSettledHandler };
