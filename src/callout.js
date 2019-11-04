import { spotlight } from './libs/spotlight.min.js';
import { tooltip, POSITIONS } from './libs/tooltip.min.js';

const
	SPOTLIGHT_KEY = Symbol('spotlight.key'),
	TOOLTIP_KEY = Symbol('tooltip.key'),
	ENTRIES_LIST = Symbol('entries.list'),
	CURRENT_INDEX = Symbol('current.entry'),
	NEXT_METHOD = Symbol('next.method'),
	PREV_METHOD = Symbol('prev.method'),
	MOVE_TO_METHOD = Symbol('move.to.method');

export function callout(entries) {
	//	create valid array of targets
	const ea = (Array.isArray(entries) ? entries : [entries])
		.filter(e => e && e.target && e.target.nodeType === Node.ELEMENT_NODE && e.content)
		.map(e => {
			const re = { target: e.target };
			if (e.content.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
				re.content = e.content;
			} else {
				const tmpDF = document.createDocumentFragment();
				tmpDF.appendChild(document.createTextNode(e.content));
				re.content = tmpDF;
			}
			return re;
		});

	//	validate
	if (!ea.length) {
		console.error('no (valid) targets to call out over');
		return;
	}

	//	start callout flow
	const
		co = document.createElement('call-out'),
		po = window.getComputedStyle(document.documentElement).overflow;
	document.documentElement.style.overflow = 'hidden';

	co.addEventListener('close', () => {
		document.documentElement.style.overflow = po;
	});

	co[ENTRIES_LIST] = ea;
	document.documentElement.appendChild(co);
}

const template = document.createElement('template');

template.innerHTML = `
	<style>
		:host {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 9999;
			overflow: hidden;
		}

		.man-pan {
			position: absolute;
			display: flex;
			justify-content: center;
			width: 100%;
			cursor: default;
			user-select: none;
			transition: all 1s;
		}

		.man-pan.above {
			top: 48px;
		}

		.man-pan.below {
			bottom: 48px;
		}

		.button {
			flex: 0 0 48px;
			height: 48px;
			margin: 0 12px;
			border-radius: 50%;
			background-color: #fff;
			font-size: 1.4em;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
		}

		.button.close {
			line-height: 48px;
		}
	</style>

	<div class="man-pan">
		<div id="callout-button-prev" class="button">&#11207;</div>
		<!--tool-tip data-target-id="callout-button-prev">
			<slot name="prev-label">PREVIOUS</slot>
		</tool-tip-->
		<div id="callout-button-next" class="button">&#11208;</div>
		<!--tool-tip data-target-id="callout-button-next">
			<slot name="next-label">NEXT</slot>
		</tool-tip-->
		<div class="button close">&#128473;</div>
	</div>
`;

customElements.define('call-out', class extends HTMLElement {
	constructor() {
		super();
		const s = this.attachShadow({ mode: 'open' });
		s.appendChild(template.content.cloneNode(true));
		s.querySelector('#callout-button-next').addEventListener('click', () => this[NEXT_METHOD]());
		s.querySelector('#callout-button-prev').addEventListener('click', () => this[PREV_METHOD]());
		s.querySelector('.button.close').addEventListener('click', () => this.close());
		this[CURRENT_INDEX] = -1;
	}

	connectedCallback() {
		this[SPOTLIGHT_KEY] = spotlight();

		this[TOOLTIP_KEY] = tooltip();
		this[TOOLTIP_KEY].position = POSITIONS.far;
		this[TOOLTIP_KEY].classList.add('light');

		this[NEXT_METHOD]();
	}

	close() {
		this[SPOTLIGHT_KEY].close();
		this[TOOLTIP_KEY].remove();
		this.parentNode.removeChild(this);
		this.dispatchEvent(new Event('close'));
	}

	[NEXT_METHOD]() {
		const
			entries = this[ENTRIES_LIST],
			nextIndex = this[CURRENT_INDEX] + 1;

		if (!entries || !entries.length) {
			console.error('no entries list');
			return;
		}
		if (nextIndex >= entries.length) {
			console.error('should NOT "next" after last');
			return;
		}

		this[MOVE_TO_METHOD](entries[nextIndex]);
		this[CURRENT_INDEX] = nextIndex;
		if (nextIndex === 0) {
			this.classList.add('first');
		} else {
			this.classList.remove('first');
		}
		if (nextIndex === entries.length - 1) {
			this.classList.add('last');
		}
	}

	[PREV_METHOD]() {
		const
			entries = this[ENTRIES_LIST],
			prevIndex = this[CURRENT_INDEX] - 1;

		if (!entries || !entries.length) {
			console.error('no entries list');
			return;
		}
		if (prevIndex < 0) {
			console.error('should NOT "prev" before first');
			return;
		}

		this[MOVE_TO_METHOD](entries[prevIndex]);
		this[CURRENT_INDEX] = prevIndex;
		if (prevIndex === 0) {
			this.classList.add('first');
		}
		if (prevIndex === entries.length - 2) {
			this.classList.remove('last');
		}
	}

	[MOVE_TO_METHOD](entry) {
		this.ensureElementSeen(entry.target);

		const r = this.getScreenRect(entry.target);

		//	position spotlight and tooltip
		this[TOOLTIP_KEY].hide();
		this[SPOTLIGHT_KEY]
			.moveTo(entry.target)
			.then(() => {
				this[TOOLTIP_KEY].show(this[SPOTLIGHT_KEY], entry.content.cloneNode(true));
			});

		//	position management panel
		const mp = this.shadowRoot.querySelector('.man-pan');
		if (r.bottom > document.documentElement.clientHeight / 2) {
			mp.classList.remove('below')
			mp.classList.add('above');
		} else {
			mp.classList.remove('above')
			mp.classList.add('below');
		}
	}

	ensureElementSeen(e) {
		e.scrollIntoView();
	}

	getScreenRect(e) {
		return e.getBoundingClientRect();
	}
});