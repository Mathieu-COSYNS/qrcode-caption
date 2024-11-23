import { toSVG } from "qrcode-caption";

import typescriptLogo from "/typescript.svg";
import viteLogo from "/vite.svg";

import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript + qrcode-caption</h1>
    <div class="card">
      <div id="qrcode"></div>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos or scan the QR Code to learn more
    </p>
  </div>
`;

document.getElementById("qrcode")!.innerHTML = toSVG(
  "https://www.npmjs.com/package/qrcode-caption",
  "Learn about qrcode-caption 😀",
  {
    width: 300,
    fontSize: 2.4,
  },
);
