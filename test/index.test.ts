import { expect, it } from 'vitest';

import * as QRCodeCaption from '../src/index';

it.each`
  text     | caption      | options                                       | snapshot
  ${'new'} | ${undefined} | ${{}}                                         | ${1}
  ${'new'} | ${undefined} | ${{ color: { dark: '#f00' } }}                | ${2}
  ${'new'} | ${undefined} | ${{ color: { light: '#f00' } }}               | ${3}
  ${'new'} | ${undefined} | ${{ color: { dark: '#f00', light: '#0f0' } }} | ${4}
  ${'new'} | ${undefined} | ${{ color: { light: '#00000000' } }}          | ${5}
  ${'new'} | ${undefined} | ${{ width: 100 }}                             | ${6}
`('should render SVG $snapshot', ({ text, caption, options, snapshot }) => {
  const result = QRCodeCaption.toSVG(text, caption, options);
  expect(result).toMatchFileSnapshot(`__snapshots__/${snapshot}.svg`);
});
