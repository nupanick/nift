const readline = require('readline');

const evaluate = require('./eval');
const print = require('./print');
const read = require('./read');

const environment = {
    '+': { type: 'function', function: (a, b) => ({ 
        type: 'number', 
        number: a.number + b.number, 
    })},
    '-': { type: 'function', function: (a, b) => ({ 
        type: 'number', 
        number: a.number - b.number, 
    })},
    '*': { type: 'function', function: (a, b) => ({ 
        type: 'number', 
        number: a.number * b.number, 
    })},
    '/': { type: 'function', function: (a, b) => ({ 
        type: 'number', 
        number: a.number / b.number | 0, 
    })},
    'infix': { type: 'macro', macro: (a, op, b) => ({
        type: 'list',
        list: [op, a, b] 
    })},
};

function rep(source) {
    const form = read(source);
    const result = evaluate(form, environment);
    return print(result);
}

async function main (in_stream, out_stream) {
    const rl = readline.createInterface({
        input: in_stream,
        output: out_stream,
        prompt: 'nift> ',
    });

    rl.on('line', line => {
        line = line.trim();
        if (line) {
            const answer = rep(line);
            out_stream.write(`${answer}\n`);
        }
        rl.prompt();
    });

    rl.prompt();

    await new Promise(r => rl.once('close', r));
}

if (require.main == module) {
    main(process.stdin, process.stdout);
}

module.exports = main;
