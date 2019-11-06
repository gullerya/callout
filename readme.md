[![GitHub](https://img.shields.io/github/license/gullerya/callout.svg)](https://github.com/gullerya/callout)
[![npm](https://img.shields.io/npm/v/@gullerya/callout.svg?label=npm%20@gullerya/callout)](https://www.npmjs.com/package/@gullerya/callout)
[![Travis](https://travis-ci.org/gullerya/callout.svg?branch=master)](https://travis-ci.org/gullerya/callout)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/callout/master.svg)](https://codecov.io/gh/gullerya/callout/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/a3879d7077eb4eef83a591733ad7c579.svg?logo=codacy)](https://www.codacy.com/app/gullerya/callout)

# Summary

__`callout`__ provides an engine to run call out flows on the web pages

Main aspects:
* uses [@gullerya/spotlight](https://www.npmjs.com/package/@gullerya/spotlight) for the visual spotlighting and [@gullerya/tooltip](https://www.npmjs.com/package/@gullerya/tooltip) for the textual/content hints
* simple single API recieves an Array of entries, each one having the target element and it's description, and runs the flow
* no HTML touches needed for integration, yet it is responsibility of the hosting application to collect and order the elements to call out over

#### Support matrix: ![CHROME](https://github.com/gullerya/callout/raw/master/docs/browser_icons/chrome.png)<sub>61+</sub> | ![FIREFOX](https://github.com/gullerya/callout/raw/master/docs/browser_icons/firefox.png)<sub>60+</sub> | ![EDGE](https://github.com/gullerya/callout/raw/master/docs/browser_icons/edge.png)<sub>16+</sub>

#### Last versions (full changelog is [here](https://github.com/gullerya/callout/blob/master/docs/changelog.md))

* __1.1.0__
  * implemented [Issue #3](https://github.com/gullerya/callout/issues/3) - in RTL pages the management strip layout remains the same
  * implemented [Issue #4](https://github.com/gullerya/callout/issues/4) - shadow of the spotlight is darker now
  * implemented [Issue #5](https://github.com/gullerya/callout/issues/5) - template, document-fragment and plain text are all handled correctly and verified
  * implemented [Issue #6](https://github.com/gullerya/callout/issues/6) - entry definition supports order and shape; `callout` will perform the correct ordering, while all unordered entries will be pushed to the end

* __1.0.0__
  * implemented [Issue #1](https://github.com/gullerya/callout/issues/1) - support for a keyboard navigation
  * implemented [Issue #2](https://github.com/gullerya/callout/issues/2) - added hint for which slide of how many the user is located on

* __0.1.0__
  * initial take

TODO