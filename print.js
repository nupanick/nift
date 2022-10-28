function print(form) {
    if (form.type == 'list') return `(${form.list.map(print).join(' ')})`;
    if (form.type == 'string') return `"${form.string}"`;
    if (form.type == 'number') return form.number.toString();
    if (form.type == 'symbol') return form.symbol;
    if (form.type == 'function') return `Function ${form.function.toString()}`;
    throw Error(`Unknown form: ${JSON.stringify(form)}`);
}
module.exports = print;
