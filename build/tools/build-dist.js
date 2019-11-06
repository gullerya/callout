const
	os = require('os'),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	uglifyES = require('uglify-es'),
	minifyOptions = {
		toplevel: true
	};

process.stdout.write('\x1B[32mSTARTING...\x1B[0m' + os.EOL);

process.stdout.write('cleaning "dist"...');
fsExtra.emptyDirSync('./dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('installing "spotlight"...');
fsExtra.copySync('./node_modules/@gullerya/spotlight/dist/spotlight.min.js', './src/spotlight.min.js');
process.stdout.write('\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('installing "tooltip"...');
fsExtra.copySync('./node_modules/@gullerya/tooltip/dist/tooltip.min.js', './src/tooltip.min.js');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('building "dist"...');
fsExtra.copySync('./src', './dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('- minifying...');
fs.writeFileSync(
	'./dist/callout.min.js',
	uglifyES.minify(fs.readFileSync('./dist/callout.js', { encoding: 'utf8' }), minifyOptions).code
);
process.stdout.write('\t\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('\x1B[32mDONE\x1B[0m' + os.EOL);