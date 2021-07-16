import {LitElement, css, html} from 'https://cdn.skypack.dev/lit';
import {debounce} from '../utils/function-helpers';

class SliderControls extends LitElement {
  static get styles() { return css`
    :host {
      --color: hotpink;

      position: relative;
      display: block;
    }

    [hidden] {
      display: none;
    }

    .items {
      position: relative;
      z-index: 0;
    }

    button {
      display: flex;
      align-items: center;

      position: absolute;
      left: var(--size-600);
      top: 50%;
      transform: translateY(-50%);

      width: max(60px, 5%);
      height: max(60px, 5%);

      opacity: 0;
      transition: opacity .14s ease-in;

      border: none;
      outline: none;
      border-radius: 50%;
      font-size: 0;
      cursor: pointer;

      background: url(/icons/circled-arrow.svg) center no-repeat;
      z-index: 1;
    }

    :host(:hover) button {
      opacity: 1;
      transition-function: ease-out;
      transition-duration: .24s;
    }

    button.is-next {
      transform: translateY(-50%) rotateY(180deg);
      left: auto;
      right: var(--size-600);
    }
  `}

  static get properties() {
    return {
      index: {type: Number},
      size: {attribute: false},
    }
  }

  constructor() {
    super();

    this.index = 0;
    this.size = 0;
    this.targetRef = null;
  }


  firstUpdated() {
    this.updateTarget();
    const slot = this.shadowRoot.querySelector('slot');
    slot.addEventListener('slotchange', () => this.updateTarget());
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.targetRef) {
      this.targetRef.removeEventListener('scroll', this.scrollHandler)
    }
  }

  render() {
    return html`
      <button
        ?hidden=${this.index === 0}
        class="[ is-previous ]"
        @click="${this.prev}"
      >previous</button>
      <div class="[ items ]">
        <slot></slot>
      </div>
      <button
        ?hidden=${this.index === this.size - 1}
        class="[ is-next ]" 
        @click="${this.next}"
      >next</button>
    `;
  }

  /**
   * Updating the target that the slider is attached to.
   */
  updateTarget() {
    const slot = this.shadowRoot.querySelector('slot');
    const ref = slot.assignedElements()[0];

    if (this.targetRef && this.targetRef !== ref) {
      this.targetRef.removeEventListener('scroll', this.scrollHandler)
      this.index = 0;
    }

    this.targetRef = ref ?? null;
    if (!this.targetRef) {
      this.size = 0;
      this.index = 0;
      return;
    }

    this.targetRef.addEventListener('scroll', this.scrollHandler);
    this.size = this.targetRef.children.length;

    this.goTo(this.index);
  }
  
  prev() {
    this.goTo(this.index - 1);
  }

  next() {
    this.goTo(this.index + 1);
  }

  goTo(index) {
    if (!this.targetRef) {
      return;
    }

    const children = this.targetRef.children;
    if (index > children.length - 1 || index < 0 || index === this.index) {
      return;
    }

    const dir = index > this.index ? 1 : -1;
    const prevEl = children[this.index];

    this.targetRef.scrollBy({
      left: dir * prevEl.getBoundingClientRect().width,
    });
  }

  updateIndex() {
    this.index = this.getIndex();
  }

  scrollHandler = debounce(() => this.updateIndex(), 20);

  getIndex() {
    if (!this.targetRef) {
      return 0;
    }

    let children = this.targetRef.children;
    if (!children.length) {
      return 0;
    }

    const scrollLeft = this.targetRef.scrollLeft;
    if (scrollLeft === 0) {
      return 0;
    }

    for (let idx = 0; idx < children.length; idx++) {
      const child = children[idx];
      const {left} = child.getBoundingClientRect();
      if (left >= 0) {
        return idx;
      }
    }

    return children.length - 1;
  }
}

customElements.define('slider-controls', SliderControls);