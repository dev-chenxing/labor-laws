const baseUrl = "/labor-laws";

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
			const content = [];
			data[law].content.split("\n").forEach((line) => {
				line = line.trim();
				const index = line.search(/\s/);
				if (index > 0) {
					const label = line.slice(0, index);
					if (/条$/.test(label)) {
						content.push([label,line.slice(index).trim()]);
					}
				}
			});
			indexes[law] = content;
		})
	});

function getMatchIndex(elem, match){
	let m = match;
	let matchIndex = -1;
	let numOfRule = -1;
	let label = false;
	const content = indexes[elem.shorthand];
	for (i in content){
		matchIndex = content[i][0].indexOf(m);
		if (matchIndex != -1) {
			numOfRule = i;
			label = true;
			break;
		}
		matchIndex = content[i][1].indexOf(m);
		if (matchIndex != -1) {
			numOfRule = i;
			break;
		}
	}
	if (matchIndex == -1) {
		m = elem.queryTerms[0];
		for (i in content){
			matchIndex = content[i][0].indexOf(m);
			if (matchIndex != -1) {
				numOfRule = i;
				label = true;
				break;
			}
			matchIndex = content[i][1].indexOf(m);
			if (matchIndex != -1) {
				numOfRule = i;
				break;
			}
		}
	}
	return [m, numOfRule, matchIndex, label];
}

function getMatchSnippet(elem, m) {
	const maxLength = 60;
	const [match, numOfRule, matchIndex, isLabel] = getMatchIndex(elem, m);
	let leftText, middleText, rightText;
	if (numOfRule === -1){
		const start = Math.max(0, matchIndex - (maxLength - match.length) / 2);
		const end = Math.min(elem.content.length, matchIndex + match.length + (maxLength - match.length) / 2);
		leftText = elem.content.slice(start, matchIndex);
		middleText = match;
		rightText = elem.content.slice(matchIndex + match.length, end);
	} else {
		if (isLabel){
			const line = indexes[elem.shorthand][numOfRule][1];
			const end = Math.min(line.length, maxLength);
			leftText = line.slice(0, end);
			middleText = "";
			rightText = "";
		} else{
			const line = indexes[elem.shorthand][numOfRule][1];
			const start = Math.max(0, matchIndex - (maxLength - match.length) / 2);
			const end = Math.min(line.length, matchIndex + match.length + (maxLength - match.length) / 2);
			leftText = line.slice(start, matchIndex);
			middleText = match;
			rightText = line.slice(matchIndex + match.length, end);
		}

	}


	const result = document.createElement("a");
	result.className = "search-result";
	result.href = `${baseUrl}/content/${elem.id}.html#${numOfRule}`;

	const label = document.createElement("b");
	label.style.paddingRight = "1rem";
	label.innerHTML = elem.shorthand;
	result.appendChild(label);

	const sublabel = document.createElement("b");
	sublabel.style.paddingRight = "1rem";
	sublabel.innerHTML = indexes[elem.shorthand][numOfRule][0];
	result.appendChild(sublabel);

	const left = document.createElement("span");
	left.innerHTML = leftText
	result.appendChild(left);
	const middle = document.createElement("b");
	middle.innerHTML = middleText;
	result.appendChild(middle);
	const right = document.createElement("span");
	right.innerHTML = rightText;
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
