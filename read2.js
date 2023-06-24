function* tokenizer(source) {
    // Skip whitespace, then match one of:
    // - special character: ( ) $ @ ' :
    // - string literal: "a b\"c() d"
    // - word: foo-bar
    const re = /[\s,]*([:'()@$]|"(?:\\.|[^\\"])*"?|[^\s,:'"()@$]+)/y
    let match = re.exec(source);
    while (match) {
        yield match[1];
        match = re.exec(source);
    }
}

function nextForm(tokens) {
    const { value: t, done } = tokens.next();
    if (done) {
        return { type: 'nil' };
    }

    // Table
    if (t === '(') {
        const entries = [];
        while (true) {
            const item = nextForm(tokens);
            if (item.type === '_END_LIST') break;
            if (item.type === 'nil') {
                // TODO: Error! Missing closing brace!
                break;
            }
            entries.push(item);
        }
        return { type: 'table', entries };
    }
    if (t === ')') return { type: '_END_LIST' };

    // Bind Expression
    if (t === ':') {
        const key = nextForm(tokens);
        const value = nextForm(tokens);
        return { type: 'bind', key, value };
    }

    // Quote Expression
    if (t === "'") {
        const expr = nextForm(tokens);
        return { type: 'quote', expr };
    }

    // Eval Expression
    if (t === '$') {
        const expr = nextForm(tokens);
        return { type: 'eval', expr };
    }

    // Expansion Expression
    if (t === '@') {
        const expr = nextForm(tokens);
        return { type: 'expansion', expr };
    }

    // String
    if (t[0] === '"') return {
        type: 'string',
        string: t.slice(1, t.length-1),
    };

    // Number
    if (/[0-9]/.test(t[0])) return {
        type: 'number',
        // HACK: Let JS handle it for now.
        number: Number(t),
    }

    // Symbol
    return { type: 'symbol', symbol: t };
}

function read(source) {
    // Implicit parens around root element
    const tokens = tokenizer(`(${source})`);
    return nextForm(tokens);
}

module.exports = read;