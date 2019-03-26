# NG Line Truncation

Line truncating solution for Angular 2+.

## Perks

Inspired by [line-clamp](https://www.npmjs.com/package/line-clamp), [shave](https://www.npmjs.com/package/shave)
and made some improvement:

- Can truncate without sanitize `HTML element`
- Retried to get `computedStyles` when it is not available in `ngAfterViewInit`
- An Optimized truncating approach

## Installation

`npm install ngx-line-truncation`

## Usage

```js
import { LineTruncationLibModule } from 'ngx-line-truncation';
```

```html
<div [line-truncation]="numOfLines" (hasTruncated)="handler(booleanValue)">
  orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.!
</div>
```

## License

The repository code is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
