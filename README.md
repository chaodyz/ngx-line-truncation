# NGX Line Truncation

Line truncating solution for Angular.

## Inspired by [line-clamp](https://www.npmjs.com/package/line-clamp), [shave](https://www.npmjs.com/package/shave) and made following improvements

- Lightening fast
- Customize for Angular platform
- Maintain original `HTML element tags and styles`
- Retry logic that guarantee truncation works
- Custom ellipsis character
- Callback indication if truncation happened

## Installation

`npm install ngx-line-truncation`

## Usage

```js
import { LineTruncationLibModule } from 'ngx-line-truncation';
```

```html
<div [line-truncation]="numOfLines" (hasTruncated)="handler(booleanValue)">
  orem ipsum dolor sit amet,
  <p>consectetur adipiscing elit</p>
  , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  <strong>reprehenderit</strong> in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.!
</div>
```

```js
handler(result: boolean){
this.hasTruncated = result;
}
```

## License

The repository code is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
