import { TemplateLite } from '@tjmonsi/element-lite/mixins/template-lite.js';
import { render, html } from 'lit-html';
import { template } from './template.js';
import style from './style.styl';
import './sections/section-landing/index.js';
import './sections/section-event-details/index.js';
import './sections/section-agenda/index.js';
import './sections/section-map/index.js';
import './sections/section-about-wtm/index.js';
import './sections/section-sponsors/index.js';
import './sections/section-csj/index.js';
import '../../modules/general/components/lazy-picture/index.js';
import { subscribe, unsubscribe } from '../../utils/state';

const { HTMLElement, customElements } = window;

class Page extends TemplateLite(HTMLElement) {
  static get is () { return 'page-home'; }

  static get properties () {
    return {
      vh: {
        type: Number
      },
      homeTop: {
        type: Number
      },
      eventDetailsTop: {
        type: Number
      },
      agendaTop: {
        type: Number
      },
      aboutWtmTop: {
        type: Number
      }
    };
  }

  constructor () {
    super();
    this._boundSetQuery = this._setQuery.bind(this);
    this._boundScroll = this.scroll.bind(this);
  }

  connectedCallback () {
    if (super.connectedCallback) super.connectedCallback();
    subscribe('query', this._boundSetQuery);
    this.header = this.shadowRoot.querySelector('project-header');
    this.components = {
      'section-landing': 0,
      'section-event-details': 0,
      'section-agenda': 0,
      'section-about-wtm': 0
    };

    for (let i in this.components) {
      this.components[i] = this.shadowRoot.querySelector(i).offsetTop;
    }
    this.scrollCalc = false;
    this.addEventListener('scroll', this._boundScroll);
  }

  disconnectedCallback () {
    if (super.disconnectedCallback) super.disconnectedCallback();
    unsubscribe('query', this._boundSetQuery);
    this.removeEventListener('scroll', this._boundScroll);
  }

  _setQuery ({ id }) {
    this.navigate(id);
  }

  navigate (string) {
    if (string) {
      const el = this.shadowRoot.querySelector(`.${string}`);
      if (el) el.scrollIntoView();
    }
    this.scroll();
  }

  scroll () {
    window.requestAnimationFrame(() => {
      if (!this.scrollCalc) {
        this.scrollCalc = true;
        const vh = this.clientHeight;
        const scrollPosY = window.pageYOffset || this.scrollTop;
        // console.log(scrollPosY, vh);
        if (scrollPosY >= vh) {
          this.header.fill();
        } else {
          this.header.unfill();
        }

        for (let i in this.components) {
          if (scrollPosY > this.components[i] - 50) {
            this.header.setActive(i);
          }
        }
        setTimeout(() => {
          this.scrollCalc = false;
        }, 500);
      }
    });
  }

  static get renderer () { return render; }

  template () {
    return html`<style>${style.toString()}</style>${template(html)}`;
  }
}

if (!customElements.get(Page.is)) {
  customElements.define(Page.is, Page);
} else {
  console.warn(`${Page.is} is already defined somewhere. Please check your code.`);
}
