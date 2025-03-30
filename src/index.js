import { readFileSync, writeFileSync } from "fs";

const filename = "./1-original.mdx";
let mdx = readFileSync(filename, "utf-8");

let lines = mdx.split("\n").map((line) => {
    return line.trim();
});
const title = lines[0];

const frontmatter = `---
layout: "@layouts/LawLayout.astro"
title: ${title}
---
`;

mdx = frontmatter + lines.join("\n");

writeFileSync("./1.mdx", mdx, {
    flag: "w",
});
