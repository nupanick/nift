const add = {
    type: 'function',
    function: (a, b) => ({
        type: 'number',
        number: a.number + b.number,
    }),
};

const sub = {
    type: 'function',
    function: (a, b) => ({
        type: 'number',
        number: a.number - b.number,
    }),
};

const mul = {
    type: 'function',
    function: (a, b) => ({
        type: 'number',
        number: a.number * b.number,
    }),
};

const div = {
    type: 'function',
    function: (a, b) => ({
        type: 'number',
        number: a.number / b.number | 0,
    }),
};

module.exports = { add, sub, mul, div };
