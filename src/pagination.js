import { readFileSync, writeFileSync } from "fs";

const file = "./1.mdx";
const fileIndex = file.match(/\.\/(\d)\.mdx/)[1]
const nextFileIndex = Number(fileIndex)+1
const nextFile = file.replace(fileIndex, nextFileIndex)
let mdx1 = readFileSync(file, "utf-8");
let mdx2 = readFileSync(nextFile, "utf-8")

let frontmatter = mdx2.match(/---([^]*)---/)[1].trim().split("\n").map((line)=> {return line.split(": ")})
let title2 = frontmatter.find((item)=> {if (item[0] === "title") return true })[1]

const paginationLink = `
<div class="border-t py-2 my-2">
  <a class="flex flex-col no-underline items-end" href="./2">
    <span>下一页  </span>
    <span>${title2}</span>
  </a>
</div>
`;

mdx1 = mdx1 + paginationLink

writeFileSync(file, mdx1, {
	flag: "w",
});
