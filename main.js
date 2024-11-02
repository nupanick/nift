import { Readable, Writable } from 'node:stream';

function rep(query) {
    return query;
}

/**
 * @param {string} chunk 
 * @param {Writable} writable
 */
function writeAsync(writable, chunk) {
    return new Promise((resolve) => {
        if (writable.write(chunk)) {
            resolve();
            return;
        }
        function cb(err) {
            if (err == null || err == undefined) {
                resolve();
            } else {
                reject(err);
            }
        }
        writable.once('drain', cb);
    });
}

/**
 * @param {Readable} input 
 * @param {Writable} output 
*/
async function runScript(input, output) {
    input.setEncoding('utf-8');
    while (true) {
        /** @type {string | null} */
        const chunk = input.read();
        if (chunk === null) break;
        await writeAsync(output, chunk);
    }
}

/**
 * @param {Readable} input 
 * @param {Writable} output 
*/
async function main(args, input, output) {
    const write = (what) => writeAsync(output, what);

    if (args.length === 1) {
        await write('insert demo here');
        return;
    }

    if (args[1] === '-i') {
        input.setEncoding('utf-8');
        // figure out stdin mode later
        if (query === null) return;
        await write(rep(query));
        return;
    }

    if (args[1] === '-e') {
        const query = args[2];
        if (!query) {
            write('usage: main -- -e <query>');
            return;
        }
        await write(rep(query));
    }
}

import { fileURLToPath } from 'url';
if (fileURLToPath(import.meta.url) === process.argv[1]) {
    main(process.argv.slice(1), process.stdin, process.stdout);
}
