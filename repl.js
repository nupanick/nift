const readline = require('readline');

class TokenReader {
    constructor(str) {
        /* skip whitespace, then match any of:
         * left or right brace: ( )
         * text literal: "a b\"c() d"
         * symbol with no internal whitespace: foo-bar */
        this._regex = /[\s,]*([()]|"(?:\\.|[^\\"])*"?|[^\s,()"]+)/y
        this._source = str;
        this._match = this._regex.exec(this._source);
    }

    peek() {
        if (!this._match) return null;
        // console.log('peeked at ' + this._match[1]);
        return this._match[1];
    }

    next() {
        if (!this._match) return null;
        const token = this._match[1];
        this._match = this._regex.exec(this._source);
        return token;
    }
}

function tokensToForm(reader) {
    const token = reader.peek();
    if (!token) return null;
    if (token === '(') {
        // read list
        reader.next();
        const children = [];
        while (1) {
            const token = reader.peek();
            if (!token) break; // TODO: missing closing brace warning
            if (token === ')') {
                reader.next();
                break;
            }
            children.push(tokensToForm(reader));
        }
        return children;
    }
    if (token[0] === '"') {
        // read string
        reader.next();
        return token.slice(1, token.length-1);
    }
    reader.next();
    return token;
}

function formToString(form) {
    if (Array.isArray(form)) {
        return `(${form.map(formToString).join(' ')})`;
    }
    else return form;
}

function read(input) {
    const reader = new TokenReader(input);
    const form = tokensToForm(reader);
    console.log(form);
    return form;
}

function evaluate(form) {
    return form;
}

function print(form) {
    return formToString(form);
}

function rep(input) {
    const command = read(input);
    const result = evaluate(command);
    const reply = print(result);
    return reply;
}

/**
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

module.exports = main;
