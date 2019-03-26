# NGX Line Truncation

Line truncating solution for Angular.

## Inspired by [line-clamp](https://www.npmjs.com/package/line-clamp), [shave](https://www.npmjs.com/package/shave) and made following improvements

- Lightening fast
- Customize for Angular platform
- Maintain original `HTML element tags and styles`
- Smart to know how many text to cut, not need for line-height declaration
- Retry logic that guarantee truncation works
- Custom ellipsis character
- Callback indication if truncation happened

## Installation

`npm install ngx-line-truncation`

## Usage

```js
import { LineTruncationLibModule } from 'ngx-line-truncation';
```

Declare [line-truncation] with `div`, `p`, `span`, and pass a number that indicates how many lines of text you are expected to truncate.

```html
<div [line-truncation]="numOfLines" (hasTruncated)="handler(booleanValue)">
  lorem ipsum dolor sit amet,
  <p>consectetur adipiscing elit</p>
  , sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  <strong>reprehenderit</strong> in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.!
</div>
```

```html
<p [line-truncation]="1">
  lorem ipsum dolor sit amet,
  <p>consectetur adipiscing elit</p> in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
  occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.!
</p>
```

```html
<p [line-truncation]="numOfLines" (hasTruncated)="handler(booleanValue)" [innerHTML]="yourText"></p>
```

Optionally, an output function can help to know if the text has been truncated.
in your .ts file

```js
handler(result: boolean){
  this.hasTruncated = result;
}
```

## License

The repository code is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
