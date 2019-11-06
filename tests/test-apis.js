import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { callout, SHAPES } from '../../dist/callout.js';

const suite = createSuite({ name: 'Testing callout APIs' });

suite.runTest({ name: 'test A' }, async test => {
	const
		divA = document.createElement('div'),
		divB = document.createElement('div'),
		divC = document.createElement('div');

	divA.style.position = 'absolute';
	divA.style.top = '100px';
	divA.style.left = '100px';
	divA.style.width = '400px';
	divA.style.height = '200px';
	divA.style.overflow = 'auto';
	divA.style.outline = '1px solid red';
	document.body.appendChild(divA);

	divB.style.position = 'absolute';
	divB.style.top = '400px';
	divB.style.left = '100px';
	divB.style.width = '200px';
	divB.style.height = '100px';
	divB.style.overflow = 'auto';
	divB.style.outline = '1px solid blue';
	document.body.appendChild(divB);

	divC.style.position = 'absolute';
	divC.style.top = '200px';
	divC.textContent = 'some thing to call out over';
	divC.style.outline = '1px solid green';
	document.body.appendChild(divC);

	await test.waitMillis(3000);

	const df = new DocumentFragment();
	df.appendChild(document.createElement('span'));
	df.firstElementChild.textContent = 'Div A - document fragment';

	const t = document.createElement('template');
	t.innerHTML = `
		<div>
			<span>Div C</span>
			<br>
			<span>template</span>
		</div>
	`;

	callout([{
		target: divA,
		content: df,
		order: 3
	}, {
		target: divB,
		content: 'Div B - plain text'
	}, {
		target: divC,
		content: t,
		shape: SHAPES.oval,
		order: 2
	}]);
});