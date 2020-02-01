export default class PlatinumElement extends HTMLElement {
  constructor({
    template
  }) {
    super()
    this.template = template
    this.attachShadow({ mode: 'open' })
    const templateEl = window.document.createElement('template')
    templateEl.innerHTML = template
    this.shadowRoot.appendChild(templateEl.content.cloneNode(true))

    this.state = new Proxy({}, {
      get: (_, key) => {
        return _[key]
      },
      set: (_, key, value) => {
        _[key] = value
        this[`$${key}`] = value
        this.$inject(key, value)
        this.dispatchEvent(new CustomEvent(`$change_${key}`, { detail: value }))
        return true
      }
    })

    const { observedAttributes } = this.constructor
    if (observedAttributes) {
      observedAttributes.forEach(key => {
        this.state[key] = this[key] || this.getAttribute(key) // getters / attrs
        Object.defineProperty(this, key, {
          get() {
            return this.state[key]
          },
          set(value) {
            this.state[key] = value
          }
        })
      })
    }
  }
  attributeChangedCallback(key, prev, value) {
    window.requestAnimationFrame(() => {
      this[key] = value
    })
  }
  $inject(key, value) {
    ;[...this.querySelectorAll([`[slot="${key}"]`])].forEach(node => {
      node.remove()
    })
    if (value && (typeof value !== 'string' || value.length)) {
      const element = window.document.createElement('data')
      element.setAttribute('slot', key)
      this.append(element)
      this.querySelector(`[slot="${key}"]`).innerHTML = value
    }
    ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
      node.setAttribute(node.getAttribute(`data-attr-${key}`), value)
    })
  }
  $render() {
    const { observedAttributes } = this.constructor
    if (observedAttributes) {
      observedAttributes.forEach(key => {
        ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
          node.setAttribute(node.getAttribute(`data-attr-${key}`), this[key])
        })
      })
    }
  }
}