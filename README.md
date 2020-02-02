# Platinum

Reactive Web Component Framework

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
                <slot name="label"></slot>
              </li>
            </template>
          </p-for>
        </ul>
      `
    })
    this.items = [{ label: 'Foo' }, { label: 'Bar' }]
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
