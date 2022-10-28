const printers = {
    list: f => `(${f.list.map(print).join(' ')})`,
    string: f => `"${f.string}"`,
    number: f => f.number.toString(),
    symbol: f => f.symbol,
    function: f => `Function ${f.function.toString()}`,
}

function print(form) {
    const printer = printers[form.type];
    if (!printer) throw Error(`No printer for ${form.type}.`);
    return printer(form);
}

module.exports = print;
