const baseUrl = "/dist";

const segmenter = Intl.Segmenter && new Intl.Segmenter("zh", { granularity: "word" });
let miniSearch = new MiniSearch({
	fields: ["content"],
	storeFields: ["shorthand", "content", "id"],
	processTerm: (term) => {
		if (!segmenter) return term;
		const tokens = [];
		for (const seg of segmenter.segment(term)) {
			tokens.push(seg.segment);
		}
		return tokens;
	},
});

const indexes = {};
fetch(`${baseUrl}/js/laws.json`)
	.then((res) => res.json())
	.then(function (data) {
		const laws = Object.keys(data);
		miniSearch.addAll(laws.map((law) => {
			return { shorthand: law, ...data[law] };
		}));
		laws.forEach((law)=> {
			const content = {};
			data[law].content.split("\n").forEach((line) =>  {
				line = line.trim();
				const index = line.search(/\s/);
				if (index > 0) {
					const label = line.slice(0, index);
					if (/条$/.test(label)) {
							const num = chinese_parseInt(label.match(/^第(.*?)条$/)[1]);
							content[num] = line.slice(index).trim();
					}
				}
			});
			indexes[law] = content;
		})
	});
	
function getMatchIndex(elem, match){
	let m = match;
	let matchIndex = elem.content.indexOf(m);
	if (matchIndex == -1) {
		m = elem.queryTerms[0];
		matchIndex = elem.content.indexOf(m);
	}
	return [m, 1, matchIndex];
}

function getMatchSnippet(elem, m) {
	const maxLength = 52;
	const [match, numOfRule, matchIndex] = getMatchIndex(elem, m);
	
	const start = Math.max(0, matchIndex - (maxLength - match.length) / 2);
	const end = Math.min(elem.content.length, matchIndex + match.length + (maxLength - match.length) / 2);

	const result = document.createElement("a");
	result.className = "search-result";
	result.href = `${baseUrl}/content/${elem.id}.html`;

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
	right.innerHTML = elem.content.slice(matchIndex + match.length, end);
	result.appendChild(right);

	return result;
}

let searchInput = (val) => {
	const output = document.getElementById("search-results");
	if (val.length >= 2) {
		output.innerHTML = "";
		res = miniSearch.search(val, { prefix: true });
		if (res.length > 0) {
			output.style.display = "block";
			for (elem of res) {
				const snippet = getMatchSnippet(elem, val);
				if (snippet) output.appendChild(snippet);
			}
		} else {
			output.style.display = "none";
			output.innerHTML = "";
		}
	} else {
		output.style.display = "none";
		output.innerHTML = "";
	}
};
