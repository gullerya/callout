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

		//	place the rest of the management elements over the mask
	}
}

function ensureElementSeen(e) {
	e.scrollIntoView({ behavior: 'smooth' });
}

function getScreenRect(e) {
	return e.getBoundingClientRect();
}

function putCalloutVilon(r) {
	//	if the vilon is already shown - animate, otherwise - create
	// <svg>
	// 	<defs>
	// 		<mask id="mask">
	// 			<rect x="0" y="0" width="100%" height="100%" fill="#aaa" opacity="0.9" />
	// 			<rect x="50" y="50" width="100" height="100" rx="12px" />
	// 		</mask>
	// 	</defs>
	// 	<rect x="0" y="0" width="100%" height="100%" mask="url(#mask)" />
	// </svg>
}