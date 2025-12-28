import fs from "node:fs";
import path from "node:path";

const source = path.resolve("../../packages/core/README.md");
const target = path.resolve("src/content/docs/guides/core.md");

let content = fs.readFileSync(source, "utf8");

// Remove level 1 title
content = content.replace(/^# (.*)$/m, "");

// Remove Feature section
content = content.replace(/^## Features[^#]*## /ms, "## ");
// Remove Contributing section
content = content.replace(/^## Contributing[^#]*## /ms, "## ");
// Remove License section
content = content.replace(/^\n## License.*/ms, "");

// Inject frontmatter
const frontmatter = `---
title: How to use qrcode-caption
---

`;

fs.writeFileSync(target, frontmatter + content);

console.log("README synced");
