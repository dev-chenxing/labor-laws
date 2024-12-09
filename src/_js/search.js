const baseUrl = "/dist";

let miniSearch = new MiniSearch({
	fields: ["title", "content"],
	storeFields: ["title","content"]
});

fetch(`${baseUrl}/js/laws.json`)
.then(res => res.json())
.then(function(data) {
	miniSearch.addAll(data)});


let searchInput = (val) => {
	if (val.length >= 2) {
		output = document.getElementById("search-result");
		output.innerHTML = "";
		res = miniSearch.search(val,{prefix: true});
		if (res.length > 0) {
			output.style.display = "block";
			for (elem of res) {
				result = document.createElement("div");
				result.innerHTML = elem.title;
				output.appendChild(result);
			}
		} else {
			output.style.display = "none";
		}
	}
};
