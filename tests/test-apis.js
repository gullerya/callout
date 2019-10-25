import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { callout } from '../../dist/callout.js';

const suite = createSuite({ name: 'Testing callout APIs' });

suite.addTest({ name: 'test A' }, test => {
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

	callout([{
		target: divA,
		content: 'something'
	}, {
		target: divB,
		content: 'something else'
	}, {
		target: divC,
		content: 'another one'
	}]);

	test.pass();
});

suite.run();