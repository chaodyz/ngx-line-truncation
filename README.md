# NGX [Line Truncation](https://line-truncation-demo.appspot.com/)

Ngx Line Truncation is a zero dependency tool for Angular that truncate text by user defined line number.

The solution was inspired by [line-clamp](https://www.npmjs.com/package/line-clamp) and [shave](https://www.npmjs.com/package/shave), and it is fast and more capable (solves the problem that could not get Line height from getComputedStyle)

## Feature

- Tailor made for Angular platform
- Smart, does not require setting Line height or max height
- Works with nest DOM element
- Maintain original HTML element tags and styles
- Lightening fast and capable
- Custom ellipsis character

## Installation

To install, simply run

`npm install ngx-line-truncation`

And import to the module that use truncation

```js
import { LineTruncationLibModule } from 'ngx-line-truncation';

  ...

@NgModule({
imports: [
  ...

LineTruncationLibModule
]
})
export class MyModule { }
```

if you import this package into a shared module, you need to export LineTruncationDirective

```js
@NgModule({
  imports: [LineTruncationLibModule],
  declarations: [...components],
  exports: [...components, LineTruncationDirective],
  entryComponents: []
})
export class MySharedModule {
```

## How to use

Declare [line-truncation] with div, p, span, and pass a number that indicates how many lines of text you are expected to truncate

```html
<p [line-truncation]="2">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt consequatur ipsum unde doloremque aliquid hic vitae
  iure necessitatibus, maiores repellendus, quos dignissimos Quis necessitatibus quos voluptas nesciunt facere mollitia
  cupiditate.
</p>
```

```html
<div [line-truncation]="2">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt consequatur ipsum unde doloremque aliquid hic vitae
  iure necessitatibus, maiores repellendus, quos dignissimos? Quis necessitatibus quos voluptas nesciunt facere mollitia
  cupiditate.
</div>
```

Optionally, an output function can help to know if the text has been truncated.

```html
<p [line-truncation]="numOfLines" (hasTruncated)="handler(booleanValue)" [innerHTML]="myText"></p>
```

in your component.ts file

```js
export class myComponent implements OnInit {

  hasTruncated = false;
  numberOfLines = 2;

  myText=`Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga itaque voluptatibus sequi laborum, consequatur aut nisi.
  Eaque nulla animi qui exercitationem suscipit voluptas cum est dicta, magnam odio et distinctio?`;

  //...

  handler(res: boolean){
    this.hasTruncated = res;
  }
```

## Contact me

If you have more idea about improving this package, feel free to reach me at chaodyz@gmail.com

## License

The repository code is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
