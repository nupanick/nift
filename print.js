function print(form) {
    // List
    if (Array.isArray(form)) {
        return `(${form.map(formToString).join(' ')})`;
    }

    // String
    if (typeof form == 'string') {
        return `"${form}"`;
    }

    // Number
    if (typeof form == 'number') {
        return form.toString();
    }

    // Symbol
    if (form && form.symbol) {
        return form.symbol;
    }

    // Function
    if (form && form.function) {
        return `Function ${form.function.toString()}`;
    }

    throw Error(`Unknown form: ${form}`);
}

module.exports = print;
