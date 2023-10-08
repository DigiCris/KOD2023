const checkboxValue = (coin) =>
    `Confirmo que el abono será realizado en ${coin}, utilizando el protocolo ERC20 sobre la red Polygon y asumo la responsabilidad de pérdida de cualquier otra moneda o token abonado a esta dirección por error.`;
const cbu = JSON.parse(localStorage.getItem('bankData')).cbuNumber;
const alias = JSON.parse(localStorage.getItem('bankData')).alias;

export { checkboxValue, cbu, alias };
