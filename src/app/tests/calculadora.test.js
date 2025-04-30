const calculadora = require("../../models/calculadora.js");
test("soma de dois numeros", () => {
	expect(calculadora.somar(2, 2)).toBe(4);
});
