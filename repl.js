const readline = require('readline');

/**
 * @param {string} str
 */
function nextToken(str) {
    /* skip whitespace, then match any of:
     * left or right brace: ( )
     * text literal: "a b\"c() d"
     * symbol with no internal whitespace: foo-bar */
    const pattern = /[\s,]*([()]|"(?:\\.|[^\\"])*"?|[^\s()"]*)(.*)/
    const [_, token, remainder] = str.match(pattern);
    return { token, remainder };
}

function read(input) {
    return input;
}

function evaluate(input) {
    return input;
}

function print(input) {
    return input;
}

function rep(input) {
    const command = read(input);
    const result = evaluate(command);
    const reply = print(result);
    return reply;
}

/**
 * 
 * @param {ReadableStream} input 
 * @param {WritableStream} output 
 */
function main(input, output) {
    const rl = readline.createInterface({
        input, output, prompt: 'user> ',
    });

    rl.on('line', line => {
        const answer = rep(line);
        output.write(answer + '\n');
        rl.prompt();
    });
    
    const done = new Promise(resolve => {
        rl.once('close', resolve);
    });

    rl.prompt();
    return done;
}

if (require.main === module)
{
    main(process.stdin, process.stdout);
}

main.nextToken = nextToken;
module.exports = main;
