import { createSuite } from '../../node_modules/just-test/dist/just-test.min.js'
import { callout } from '../../dist/callout.js';

const suite = createSuite({ name: 'Testing callout APIs' });

suite.addTest({ name: 'test A' }, test => {
	callout([document.createElement('div')]);

	test.pass();
});


suite.run();
