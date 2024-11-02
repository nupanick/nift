const printers = {
    function: f => `Function ${f.function.toString()}`,
    list: f => `(${f.list.map(print).join(' ')})`,
    nil: f => 'NIL',
    number: f => f.number.toString(),
    string: f => `"${f.string}"`,
    symbol: f => f.symbol,
}

function print(form) {
    const printer = printers[form.type];
    if (!printer) throw Error(`No printer for ${form.type}.`);
    return printer(form);
}

module.exports = print;
