window.customElements.define('p-if', class PlatinumForEach extends HTMLElement {
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
  toggle() {
    const showing = this.element.parentNode !== this.fragment
    const show = this.currentHost && (this.condition ? this.currentHost[this.condition] : !this.currentHost[this.not])
    if (show && !showing) {
      this.appendChild(this.element)
      this.getRootNode().host.$render() // TODO mutationobserver?
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
})