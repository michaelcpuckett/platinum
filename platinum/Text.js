window.customElements.define('p-text', class PlatinumForEach extends HTMLElement {
  constructor() {
    super()
  }
  get content() {
    return this.getAttribute('content')
  }
  set content(content) {
    this.innerText = content
  }
  connectedCallback() {
    this.innerText = this.content
  }
})