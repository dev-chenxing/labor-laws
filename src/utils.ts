import { readdirSync } from "fs";

export const getLaborLaws = () => {
	const folderPath = "src/pages/labor-laws";
	let laborLaws = [];
	for (let fileName of readdirSync(folderPath)) {
		const ignore = [".git", "index.mdx", "src"];
		if (!ignore.includes(fileName)) {
			laborLaws.push(fileName.split(".")[0]);
		}
	}
	return laborLaws;
	};
