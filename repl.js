const readline = require('readline');

const evaluate = require('./eval');
const print = require('./print');
const read = require('./read');

const environment = {
    '+': { function: (a, b) => a + b },
    '-': { function: (a, b) => a - b },
    '*': { function: (a, b) => a * b },
    '/': { function: (a, b) => (a / b) | 0 },
    'infix': { macro: (a, op, b) => [op, a, b] },
}

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
