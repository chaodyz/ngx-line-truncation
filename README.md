# NGX Line Truncation

Ngx Line Truncation is line truncation implementation for Angular that truncate text by user defined line number. ([demo](https://stackblitz.com/edit/ngx-line-truncation?file=src%2Fapp%2Fapp.component.html))

In addition to Line Truncation, this package has few performance optimizations not only improved usability but also reliability in Angular platform. It uses retry logic to guarantee we get Client Height text block all the time, which is an essential value of the truncation input. It also watches the dom changes,to catch the case when the text value get applied at a later time.

## Feature

- Tailor made for Angular platform
- Smart, just declare how many lines you wish to truncate for, no need to provide max-height, line-height
- Works with nest DOM element
- Support rich text, maintain original HTML element tags and styles
- Lightening fast and capable
- Custom ellipsis character
- Re-execute on window resize

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

Declare [line-truncation] with div, p, and pass a number that indicates how many lines of text you are expected to truncate

```html
<p [line-truncation]="2">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt consequatur ipsum unde doloremque aliquid hic vitae
  iure necessitatibus, maiores repellendus, quos dignissimos Quis necessitatibus quos voluptas nesciunt facere mollitia
  cupiditate.
</p>
```

```html
<p [line-truncation]="2" [innerHTML]="myText"></p>
```

```html
<div [line-truncation]="2">
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt consequatur ipsum unde doloremque aliquid hic vitae
  iure necessitatibus, maiores repellendus, quos dignissimos? Quis necessitatibus quos voluptas nesciunt facere mollitia
  cupiditate.
</div>
```

Optionally, an output function can help to know if the text has been truncate

```html
<p [line-truncation]="numOfLines" (hasTruncated)="handler($event)" [innerHTML]="myText"></p>
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

By default, '...' will be added to the end of the truncated body, if you wish to use your desired ellipsis, you can pass an object like this

```html
<p [line-truncation]="numOfLines" [options]="{ellipsis: "🚀"}" (hasTruncated)="handler(booleanValue)" [innerHTML]="myText" [disabled]="disabled"></p>
```

Known issue:
When you specify emoji as ellipsis 🚀, or use rich text( <p [innerHTML]>), the truncation result might ended up with less lines than you desired(e.g. desire 3, but only have 1).
I will be looking into this issue in the future, current `work around` for this issue is say you realize you get 1 line instead 3, you could declare with 5, it will be truncated to 3.

## Update
12-02 add input watchChanges to provide truncation on dynamic text content

10-27 add input disabled
      fix an issue when not truncating, hasTruncated is not emitting value

## Contact me

If you have more idea about improving this package, feel free to reach me at chaodyz@gmail.com

## License

The repository code is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
