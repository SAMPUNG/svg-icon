# How to use svg-icon

- Installation

```cmd
npm install @jugar/svg-icon
```

- Local

- Register SVG Icon by Name

```ts
import { defineLoader, registerSymbol } from '@jugar/svg-icon'
defineLoader((fullname: string) => {
  const [dir, name] = fullname.split(':')
  // relative to the current directory
  return new URL(`../../svg/${dir}/${name}.svg?url`, import.meta.url).href
})
registerSymbol('dir:name')
```

- Use SVG Icon by Name

```html
<svg class="svg-icon">
  <use xlink:href="#dir:name" />
</svg>
```
