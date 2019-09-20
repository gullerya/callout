export {
	callout
}

function callout(targets) {
	//	create valid array of targets
	const ea = (Array.isArray(targets) ? targets : [targets]).filter(e => e && e.nodeType);

	//	validate
	if (!ea.length) {
		console.error('no (valid) targets to call out over');
		return;
	}

	//	start callout flow
	const calloute = document.createElement('call-out');
	document.body.appendChild(calloute);
	calloute.callout(ea);
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
			margin: 48px 0;
			width: 100%;
			cursor: default;
			user-select: none;
		}

		.button {
			flex: 0 0 32px;
			height: 32px;
			margin: 0 8px;
			border-radius: 50%;
			background-color: #fff;
			font: 24px monospace;
			display: flex;
			align-items: center;
			justify-content: center;
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
			width: 16px;
			height: 16px;
			rx: 8px;
			transition: all 400ms ease;
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
		<div class="button">&lt;</div>
		<div class="button">&gt;</div>
		<div class="button">X</div>
	</div>
`;

customElements.define('call-out', class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' })
			.appendChild(template.content.cloneNode(true));
	}

	callout(targets) {
		if (!targets || !targets.length || targets.some(e => !e || !e.nodeType)) {
			throw new Error('invalid targets to call out over');
		}

		this.ensureElementSeen(targets[0]);

		const
			r = this.getScreenRect(targets[0]),
			av = {
				x: (r.x - 4) + 'px',
				y: (r.y - 4) + 'px',
				width: (Math.max(16, r.width) + 8) + 'px',
				height: (Math.max(16, r.height) + 8) + 'px'
			},
			m = this.shadowRoot.querySelector('.mask-window');

		Object.assign(m.style, av);
	}

	ensureElementSeen(e) {
		e.scrollIntoView();
	}

	getScreenRect(e) {
		return e.getBoundingClientRect();
	}
});