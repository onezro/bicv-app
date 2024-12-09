const regexMcid = /^MCID\d+$/; //MCID
const regexFeed = /^F\d+$/; //feed
const regexMaterial = /^R\d+$/; //R物料
const regexClear = /-CLEAR-/
const regexOper = /^OP\d+$/


export const stringType = (str) => {
	if (regexMcid.test(str)) {
		return 'Mcid';
	} else if (regexFeed.test(str)) {
		return 'Feed';
	} else if (regexMaterial.test(str)) {
		// console.log(str);
		return 'Material';
	} else if (regexClear.test(str)) {
		return 'CLEAR';
	} else if (regexOper.test(str)) {
		return 'OPER';
	} else {
		return 'none';
	}

}