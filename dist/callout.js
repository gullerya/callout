export {
	callout
}

function callout(elements) {
	if (!elements || !elements.length) {
		console.error('invalid or empty array of elements to call out over');
		return;
	}

	for (let i = 0, l = elements.length; i < l; i++) {
		const e = elements[i];
		ensureElementSeen(e);

		const r = getScreenRect(e);
		putCalloutVilon(r);
	}
}

function ensureElementSeen(e) {
	e.scrollIntoView({ behavior: 'smooth' });
}

function getScreenRect(e) {
	return e.getBoundingClientRect();
}

function putCalloutVilon(r) {
	const calloutElement = document.createElement('gullerya-callout');
	document.body.appendChild(calloutElement);
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
			z-index: 1000;
		}

		.man-pan {
			position: absolute;
			top: 50px;
			left: 500px;
			color: #000;
		}

		.callout-vilon {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.mask-overlay {
			x: 0;
			y: 0;
			width: 100%;
			height: 100%;
			fill: #aaa;
			opacity: 0.7;
		}

		.mask-window {
			x: calc(50% - 12px);
			y: calc(50% - 12px);
			width: 24px;
			height: 24px;
			rx: 8px;
			transition: all 200ms;
		}
	</style>

	<svg class="callout-vilon">
		<defs>
			<mask id="callout-mask">
				<rect class="mask-overlay"/>
				<rect class="mask-window"/>
			</mask>
		</defs>
		<rect x="0" y="0" width="100%" height="100%" mask="url(#callout-mask)"/>
	</svg>
	<div class="man-pan">
		Some text here
	</div>
`;

customElements.define('gullerya-callout', class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' })
			.appendChild(template.content.cloneNode(true));
	}
});