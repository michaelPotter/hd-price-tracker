export function object2Labels(o: Record<string, any>) {
	return Object.keys(o).map(k => k + '="' + o[k] + '"').join(' ');
}
