import { readFileSync, writeFileSync } from "fs";

const filename = "./劳动部办公厅对《关于临时工等问题的请示》的复函.mdx";
let mdx = readFileSync(filename, "utf-8");

let title;
let linebreak = true;
let lines = mdx.split("\n").map((line, index) => {
	line = line.trim();
	if (index==0){
		title = line;
		line = `# ${line}`
	} else {
				if (line === "") linebreak = false;
				else {
					let chapter = line.match(/^第(.*)章\s/) || line.match(/^序言/)
					let section = line.match(/^第(.*)节\s/)
					let article = line.match(/^第(.*)条\s/)
					let ol = line.match(/^\d+[\.．]/)
					if (article) {
							line = line.replace(article[0], `**${article[0].trim()}** `)
					} else if (ol) {
						line = line.replace(/^(\d+)[\.．]/, "**第$1条** ")
					}  else if (section) {
						line = `### ${line}`
					}  else if (chapter) {
						line = `## ${line}`
					}
					if (linebreak) {
						line = "\n" + line;
					} else {
						linebreak = true
					}
				}
		}
	return line;
});

const frontmatter = `---
layout: "@layouts/LawLayout.astro"
title: ${title}
---
`;

mdx = frontmatter + lines.join("\n");

writeFileSync(filename, mdx, {
	flag: "w",
});
