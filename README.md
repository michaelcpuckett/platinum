# Platinum

Platinum is a Vue-inspired JavaScript web component framework that uses Custom Elements (native slots) to achieve reactivity instead of a virtual DOM.

## Examples

## For-Each

```js
import { PlatinumElement } from 'platinum/index.js'

window.customElements.define('x-example', class XExample extends PlatinumElement {
  static get observedAttributes() {
    return ['items']
  }
  constructor() {
    super({
      template: /*html*/`
        <ul>
          <p-for each="items">
            <template>
              <li>
                <slot></slot>
              </li>
            </template>
          </p-for>
        </ul>
      `
    })
    this.items = ['Foo', 'Bar']
  }
})
```

### If

```js
import { PlatinumElement } from 'platinum/index.js'

window.customElements.define('x-example', class XExample extends PlatinumElement {
  static get observedAttributes() {
    return [
      'toggled'
    ]
  }
  constructor() {
    super({
      template: /*html*/`
        <button onclick="this.getRootNode().host.toggled = !this.getRootNode().host.toggled">
          Toggle 
        </button>
        <p-if condition="toggled">
          <template>
            <span>
              Hello world!
            </span>
          </template>
        </p-if>
        <p-if not="toggled">
          <template>
            <span>
              Goodbye world!
            <span>
          </template>
        </p-if>
      `
    })
  }
})
```

### Input/Output

```js
import { PlatinumElement } from 'platinum/index.js'
window.customElements.define('x-example', class XExample extends PlatinumElement {
  static get observedAttributes() {
    return ['firstName']
  }
  constructor() {
    super({
      template: /*html*/`
        <input oninput="this.getRootNode().host.firstName = this.value" placeholder="First Name" />
        <br />
        <output>
          First Name: <slot name="firstName"></slot>
        </output>
      `
    })
  }
})
```
