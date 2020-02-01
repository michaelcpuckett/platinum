import PlatinumShadow from './Shadow.js'

export default class PlatinumElement extends PlatinumShadow {
  constructor({
    template
  }) {
    super()
    this.template = template
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
      const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
      if (value !== undefined && value !== null) {
        attrs.forEach(attr => node.setAttribute(attr, value))
      } else {
        attrs.forEach(attr => node.removeAttribute(attr))
      }
    })
  }
  $render() {
    const { observedAttributes } = this.constructor
    if (observedAttributes) {
      observedAttributes.forEach(key => {
        ;[...this.shadowRoot.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
          const value = this[key]
          const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
          if (value !== undefined && value !== null) {
            attrs.forEach(attr => node.setAttribute(attr, value))
          } else {
            attrs.forEach(attr => node.removeAttribute(attr))
          }
        })
      })
    }
  }
}