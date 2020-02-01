import PlatinumShadow from './Shadow.js'

export default class PlatinumIf extends PlatinumShadow {
  constructor() {
    super()
    this.style.display = 'contents'
    this.template = this.querySelector('template')
    this.fragment = new DocumentFragment()
    this.element = this.template.content.cloneNode(true).firstElementChild
    this.fragment.append(this.element)
    this.boundToggle = this.toggle.bind(this)
  }
  get condition() {
    return this.getAttribute('condition')
  }
  get not() {
    return this.getAttribute('not')
  }
  $render() {
    const $host = this.currentHost
    const attrs = window.customElements.get($host.tagName.toLowerCase()).observedAttributes || []
    attrs.map(attr => [attr, $host[attr]]).forEach(([key, value]) => {
      if (this.element.tagName.includes('-')) {
        Object.assign(this.element, { [key]: value })
      }
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
    })
  }
  toggle() {
    const showing = this.element.parentNode !== this.fragment
    const show = this.currentHost && (this.condition ? this.currentHost[this.condition] : !this.currentHost[this.not])
    if (show && !showing) {
      this.shadowRoot.append(this.element)
      this.$render()
    }
    if (!show && showing) {
      this.fragment.append(this.element)
    }
  }
  connectedCallback() {
    window.requestAnimationFrame(() => {
      const { host } = this.getRootNode()
      if (host) {
        this.currentHost = host
        this.toggle()
        host.addEventListener(`$change_${this.condition || this.not}`, this.boundToggle)
      }
    })
  }
  disconnectedCallback() {
    if (this.currentHost && this.currentHost.removeElementListener) {
      this.currentHost.removeElementListener(`$change_${this.condition || this.not}`, this.boundToggle)
    }
  }
}