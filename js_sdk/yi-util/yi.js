function clone(r) {
	switch (r) {
		case void 0:
			return;
		case null:
			return null;
		default:
			return JSON.parse(JSON.stringify(r))
	}
}

function debounce(r, t) {
	let n = null;
	return function(...e) {
		n && clearTimeout(n), n = setTimeout(() => r(...e), t)
	}
}

function throttle(r, t) {
	let n = null;
	return function(...e) {
		n || (n = setTimeout(() => {
			r(...e), n = null
		}, t))
	}
}

function composeQueryString(r, t = !0) {
	return t ? Object.keys(r).map(t => `${encodeURIComponent(t)}=${encodeURIComponent(r[t])}`).join("&") : Object.keys(
		r).map(t => `${t}=${r[t]}`).join("&")
}

function parseQueryString(r) {
	let t = r.split("?");
	return (t.length > 1 ? t[1] : t[0]).split("&").reduce((r, t) => {
		let [n, e] = t.split("=");
		return r[n] = decodeURIComponent(e), r
	}, {})
}

function randomString(r = 20, t = !1) {
	let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklnmopqrstuvwxyz123456789";
	t && (n += "!$%&*@#_~");
	let e = n.length,
		o = "";
	for (let t = 0; t < r; t++) o += n.charAt(Math.floor(Math.random() * e));
	return o
}

function numberArray(r, t = 0) {
	let n = [],
		e = t;
	for (let t = 0; t < r; t++) n.push(e), e++;
	return n
}

function uniqueArray(r) {
	return r.filter((r, t, n) => n.indexOf(r) === t)
}

function last(r) {
	if ("string" == typeof r) return r.slice(-1);
	if ("number" == typeof r) return r.toString().slice(-1);
	if (Array.isArray(r)) return r[r.length - 1]; {
		let t = Object.values(r);
		return t[t.length - 1]
	}
}

function random(r, t) {
	return Math.floor(Math.random() * (t - r + 1)) + r
}

function inRange(r, t, n) {
	return r > t && r < n
}

function sort(r, t = "asc") {
	return "string" == typeof r ? "asc" === t ? r.split("").sort().join("") : r.split("").sort().reverse().join("") :
		Array.isArray(r) ? r.sort((r, n) => (r = r.toString().charAt(0), n = n.toString().charAt(0), "asc" === t ? r
			.localeCompare(n) : n.localeCompare(r))) : r
}
export default {
	inRange: inRange,
	randomString: randomString,
	numberArray: numberArray,
	debounce: debounce,
	throttle: throttle,
	clone: clone,
	last: last,
	random: random,
	uniqueArray: uniqueArray,
	sort: sort,
	composeQueryString: composeQueryString,
	parseQueryString: parseQueryString
};