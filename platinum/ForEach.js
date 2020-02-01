import PlatinumShadow from './Shadow.js'
import PlatinumElement from './Element.js'

export default class PlatinumForEach extends PlatinumShadow {
  constructor() {
    super()
  }
  get in() {
    return this.getAttribute('in')
  }
  connectedCallback() {
    this.style.display = 'contents'
    const templateContent = this.querySelector('template').content
    window.requestAnimationFrame(() => {
      const $store = this.getRootNode().host || this.parentElement
      if (this.in) {
        {
          const each = $store[this.in]
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => {
              const shadowEl = window.document.createElement('p-shadow')
              const clone = templateContent.cloneNode(true).firstElementChild
              if (clone instanceof PlatinumElement) {
                Object.assign(clone, data)
              }

              Object.entries(data).forEach(([ key, value ]) => {
                const dataEl = window.document.createElement('data')
                dataEl.setAttribute('slot', key)
                dataEl.innerText = value
                shadowEl.append(dataEl)

                ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
                  attrs.forEach(attr => node.setAttribute(attr, value))
                })
              })
              shadowEl.shadowRoot.append(clone)
              return shadowEl
            }).forEach(node => this.shadowRoot.append(node))
          }
        }
        $store.addEventListener(`$change_${this.in}`, ({ detail: each }) => {
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => {
              const shadowEl = window.document.createElement('p-shadow')
              const clone = templateContent.cloneNode(true).firstElementChild
              if (clone instanceof PlatinumElement) {
                Object.assign(clone, data)
              }
              Object.entries(data).forEach(([ key, value ]) => {
                const dataEl = window.document.createElement('data')
                dataEl.setAttribute('slot', key)
                dataEl.innerText = value
                shadowEl.append(dataEl)

                ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
                  attrs.forEach(attr => node.setAttribute(attr, value))
                })
              })

              shadowEl.shadowRoot.append(clone)
              return shadowEl
            }).forEach(node => this.shadowRoot.append(node))
          }
        })
      }
    })
  }
}