const baseUrl = "/dist";

let miniSearch = new MiniSearch({
    fields: ["title", "content"], // fields to index for full-text search
    storeFields: ["title", "content"], // fields to return with search results
});

fetch(`${baseUrl}/js/laws.json`);

let searchInput = (val) => {
    console.log(val);
};
