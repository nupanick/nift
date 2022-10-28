function* tokenizer(source) {
    /* skip whitespace, then match any of:
    * left or right brace: ( )
    * text literal: "a b\"c() d"
    * symbol with no internal whitespace: foo-bar */
    const re = /[\s,]*([()]|"(?:\\.|[^\\"])*"?|[^\s,()"]+)/y
    let match = re.exec(source);
    while(match) {
        yield match[1];
        match = re.exec(source);
    }
}

function nextForm(tokens) {
    const { value: t, done } = tokens.next();
    if (done) { 
        return { type: 'nil' };
    }

    // List
    if (t == '(') {
        const list = [];
        while (true) {
            const item = nextForm(tokens);
            if (item.type == '_END_LIST') break;
            if (item.type == 'nil') {
                // TODO: Error! Missing closing brace!
                break;
            }
            list.push(item);
        }
        return { type: 'list', list }
    }
    if (t == ')') return { type: '_END_LIST' }

    // String
    if (t[0] == '"') return {
        type: 'string',
        string: t.slice(1, t.length-1), 
    }

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
    const tokens = tokenizer(source);
    return nextForm(tokens);
}

module.exports = read;
