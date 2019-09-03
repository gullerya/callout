const
	os = require('os'),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	uglifyES = require('uglify-es');

process.stdout.write('cleaning "dist"...');
fsExtra.emptyDirSync('./dist');
process.stdout.write('\t\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('copying "src" to "dist"...');
fsExtra.copySync('./src', './dist');
process.stdout.write('\t\x1B[32mOK\x1B[0m' + os.EOL);

process.stdout.write('minifying...');
let options = {
	toplevel: true
};
fs.writeFileSync(
	'./dist/callout.min.js',
	uglifyES.minify(fs.readFileSync('./dist/callout.js', { encoding: 'utf8' }), options).code
);
process.stdout.write('\t\t\t\x1B[32mOK\x1B[0m' + os.EOL);