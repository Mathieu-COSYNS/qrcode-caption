import { toSVG } from 'qrcode-caption';

document.querySelector('#app')!.innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <div id="qrcode"></div>
  </div>
`;

document.getElementById('qrcode')!.innerHTML = toSVG('https://example.com', 'QR Code 😀', {
  width: 500,
});
