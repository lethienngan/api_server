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

module.exports = { asyncWrapper, asyncFetchWrapper };
