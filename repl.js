import { fileURLToPath } from 'url';
import * as readline from 'node:readline';

function read(input) {
    return input;
}

function evaluate(input) {
    return input;
}

function print(input) {
    return input;
}

export function rep(input) {
    const command = read(input);
    const result = evaluate(command);
    const reply = print(result);
    return reply;
}

async function main(stream_in, stream_out) {
    const rl = readline.createInterface(stream_in, stream_out);
    while (1) {
        const query = await new Promise(res => rl.question('user> ', res));
        const response = rep(query);
        rl.write(response + '\n');
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main(process.stdin, process.stdout);
}
