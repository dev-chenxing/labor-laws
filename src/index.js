import { readFileSync, writeFileSync } from "fs";

const filename = "./1-original.mdx";
let mdx = readFileSync(filename, "utf-8");

let title;
let lines = mdx.split("\n").map((line, index) => {
	line = line.trim();
	if (index==0){
		title = line;
		line = `# ${line}`
	} else {
        let section = line.match(/^第(.*)条 /)
        if (section) {
            line = line.replace(section[0], `**${section[0].trim()}** `)
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

writeFileSync("./1.mdx", mdx, {
	flag: "w",
});
