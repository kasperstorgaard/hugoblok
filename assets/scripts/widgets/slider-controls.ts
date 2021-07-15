import {LitElement, css, html, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { debounce } from '../utils/function-helpers';

@customElement('slider-controls')
export class SliderControls extends LitElement {
  static styles = css`
    :host {
      --color: hotpink;

      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
      -ms-touch-action: pan-y;
      touch-action: pan-y;
      -webkit-tap-highlight-color: transparent;
    }

    [hidden] {
      display: none;
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
      z-index: 1;

      opacity: 0;
      transition: opacity .14s ease-in;

      border: none;
      outline: none;
      border-radius: 50%;
      font-size: 0;

      background: url(/icons/circled-arrow.svg) center no-repeat;
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
  `;

  /**
   * The amount of items
   */
  @state()
  size = 0;

  /**
   * The current index (optional)
   */
  @property()
  index = 0;

  /**
   * The target id (optional)
   */
  @property()
  target: string;

  targetRef: Element | null = null;
  length = 0;

  connectedCallback() {
    super.connectedCallback();

    if (this.target) {
      this.setTarget(document.getElementById(this.target));
    } else {
      this.setTarget(this.previousElementSibling);
    }
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
  setTarget(ref: Element) {
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

  goTo(index: number) {
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

  private updateIndex() {
    this.index = this.getIndex();
  }

  private scrollHandler = debounce(() => this.updateIndex(), 20);

  private getIndex() {
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
      if (left >= scrollLeft) {
        return idx;
      }
    }

    return children.length - 1;
  }
}