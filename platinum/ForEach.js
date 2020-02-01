window.customElements.define('p-for-each', class PlatinumForEach extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  get in() {
    return this.getAttribute('in')
  }
  connectedCallback() {
    this.style.display = 'contents'
    const content = this.querySelector('template').content
    window.requestAnimationFrame(() => {
      const $store = this.getRootNode().host || this.parentElement
      if (this.in) {
        {
          const each = $store[this.in]
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => {
              const clone = Object.assign(content.cloneNode(true).firstElementChild, data)

              Object.entries(data).forEach(([ key, value ]) => {
                ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
                  attrs.forEach(attr => node.setAttribute(attr, value))
                })
              })

              return clone
            }).forEach(node => this.shadowRoot.append(node))
          }
        }
        $store.addEventListener(`$change_${this.in}`, ({ detail: each }) => {
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => {
              const clone = Object.assign(content.cloneNode(true).firstElementChild, data)

              Object.entries(data).forEach(([ key, value ]) => {
                ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
                  attrs.forEach(attr => node.setAttribute(attr, value))
                })
              })

              return clone
            }).forEach(node => this.shadowRoot.append(node))
          }
        })
      }
    })
  }
})