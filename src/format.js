import { readFileSync, writeFileSync } from "fs";

const filename = "./最高人民法院关于审理劳动争议案件适用法律问题的解释（一）.mdx";
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
					let chapter = line.match(/^第(.*)章\s/)
					let section = line.match(/^第(.*)节\s/)
					let article = line.match(/^第(.*)条\s/)
					if (article) {
							line = line.replace(article[0], `**${article[0].trim()}** `)
					} else if (section) {
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
