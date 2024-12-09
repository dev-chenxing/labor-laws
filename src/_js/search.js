const baseUrl = "/dist";

const segmenter =
	Intl.Segmenter && new Intl.Segmenter("zh", { granularity: "word" });
let miniSearch = new MiniSearch({
	fields: ["title", "content"],
	storeFields: ["shorthand", "content"],
	processTerm: (term) => {
		if (!segmenter) return term;
		const tokens = [];
		for (const seg of segmenter.segment(term)) {
			tokens.push(seg.segment);
		}
		return tokens;
		},
});

fetch(`${baseUrl}/js/laws.json`)
.then(res => res.json())
.then(function(data) {
	miniSearch.addAll(data)});

function getMatchSnippet(elem, maxLength = 52){
	const match = elem.queryTerms[0];
	const matchIndex = elem.content.indexOf(match);
	const start = Math.max(0, matchIndex - (maxLength - match.length)/2);
	const end = Math.min(elem.content.length, matchIndex + match.length + (maxLength - match.length)/2);

	const result = document.createElement("div");

	const label = document.createElement("b");
	label.style.paddingRight = "1rem";
	label.innerHTML = elem.shorthand;
	result.appendChild(label);
	const left = document.createElement("span");
	left.innerHTML = elem.content.slice(start, matchIndex);
	result.appendChild(left);
	const middle = document.createElement("b");
	middle.innerHTML = match;
	result.appendChild(middle);
	const right = document.createElement("span");
	right.innerHTML = elem.content.slice(matchIndex+match.length, end);;
	result.appendChild(right);

	return result;
}

let searchInput = (val) => {
	if (val.length >= 2) {
		output = document.getElementById("search-result");
		output.innerHTML = "";
		res = miniSearch.search(val,{prefix: true});
		if (res.length > 0) {
			output.style.display = "block";
			for (elem of res) {
				const snippet = getMatchSnippet(elem);
				output.appendChild(snippet);
			}
		} else {
			output.style.display = "none";
			output.innerHTML = "";
		}
	}
};
