import PlatinumShadow from './Shadow.js'

export default class PlatinumForEach extends PlatinumShadow {
  constructor() {
    super()
  }
  get in() {
    return this.getAttribute('in')
  }
  handleChange({ detail: each }) {
    if (Array.isArray(each) && each.length) {
      console.log(each)
      ;[...this.shadowRoot.children].forEach(node => node.remove())
      each.map(data => {
        data = { ...data, ...Object.fromEntries(this.attrs.map(attr => [ attr, this.getRootNode().host[attr] ])) }
        console.log(data)
        const shadowEl = window.document.createElement('p-shadow')
        const clone = templateContent.cloneNode(true).firstElementChild
        if (clone.tagName.includes('-')) {
          Object.assign(clone, data)
        }
        Object.entries(data).forEach(([ key, value ]) => {
          const dataEl = window.document.createElement('data')
          dataEl.setAttribute('slot', key)
          dataEl.innerText = value
          shadowEl.append(dataEl)

          ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
            const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
            if (value !== undefined && value !== null) {
              attrs.forEach(attr => node.setAttribute(attr, value))
            } else {
              attrs.forEach(attr => node.removeAttribute(attr))
            }
          })
        })

        shadowEl.shadowRoot.append(clone)
        return shadowEl
      }).forEach(node => this.shadowRoot.append(node))
    }
  }
  connectedCallback() {
    this.style.display = 'contents'
    const templateContent = this.querySelector('template').content
    window.requestAnimationFrame(() => {
      const $store = this.getRootNode().host || this.parentElement
      this.attrs = window.customElements.get($store.tagName.toLowerCase()).observedAttributes || []
      if (this.in) {
        {
          const each = $store[this.in]
          if (Array.isArray(each) && each.length) {
            ;[...this.shadowRoot.children].forEach(node => node.remove())
            each.map(data => {
              data = { ...data, ...Object.fromEntries(this.attrs.map(attr => [ attr, $store[attr] ])) }
              console.log(data)
              const shadowEl = window.document.createElement('p-shadow')
              const clone = templateContent.cloneNode(true).firstElementChild
              if (clone.tagName.includes('-')) {
                Object.assign(clone, data)
              }

              Object.entries(data).forEach(([ key, value ]) => {
                const dataEl = window.document.createElement('data')
                dataEl.setAttribute('slot', key)
                dataEl.innerText = value
                shadowEl.append(dataEl)

                ;[...(clone.matches(`[data-attr-${key}]`) ? [clone] : []), ...clone.querySelectorAll([`[data-attr-${key}]`])].forEach(node => {
                  const attrs = node.getAttribute(`data-attr-${key}`).split(' ')
                  if (value !== undefined && value !== null) {
                    attrs.forEach(attr => node.setAttribute(attr, value))
                  } else {
                    attrs.forEach(attr => node.removeAttribute(attr))
                  }
                })
              })
              shadowEl.shadowRoot.append(clone)
              return shadowEl
            }).forEach(node => this.shadowRoot.append(node))
          }
        }
        $store.addEventListener(`$change_${this.in}`, this.handleChange)
        this.attrs.forEach(attr => {
          $store.addEventListener(`$change_${attr}`, ({ detail: value }) => {
            ;[...this.shadowRoot.children].forEach((parent) => {
              const node = parent.shadowRoot.firstElementChild
              if (node.tagName.includes('-')) {
                Object.assign(node, {
                  [attr]: value
                })
              }
            })
          })
        })
      }
    })
  }
}