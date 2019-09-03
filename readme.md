[![GitHub](https://img.shields.io/github/license/gullerya/object-observer.svg)](https://github.com/gullerya/object-observer)
[![npm](https://img.shields.io/npm/v/object-observer.svg?label=npm%20object-observer)](https://www.npmjs.com/package/object-observer)
[![npm](https://img.shields.io/npm/v/@gullerya/observable.svg?label=npm%20@gullerya/observable)](https://www.npmjs.com/package/@gullerya/observable)
[![Travis](https://travis-ci.org/gullerya/object-observer.svg?branch=master)](https://travis-ci.org/gullerya/object-observer)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/object-observer/master.svg)](https://codecov.io/gh/gullerya/object-observer/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/a3879d7077eb4eef83a591733ad7c579.svg?logo=codacy)](https://www.codacy.com/app/gullerya/object-observer)

# Summary

__`object-observer`__ provides a deep observation of a changes performed on an object/array graph.

Main aspects:
* implemented via native __Proxy__ (revokable)
* observation is 'deep', yielding changes from a __sub-graphs__ too
* changes delivered in a __synchronous__ way
* original objects are __cloned__ while turned into `Observable`s
* arrays specifics:
  * generic object-like mutations supported
  * intrinsic `Array` mutation methods supported: `pop`, `push`, `shift`, `unshift`, `reverse`, `sort`, `fill`, `splice`
  * massive mutations delivered in a single callback, usually having an array of an atomic changes
* intrinsic mutation methods of `Map`, `WeakMap`, `Set`, `WeakSet` (`set`, `delete`) etc __are not__ observed (see this [issue](https://github.com/gullerya/object-observer/issues/1) for more details)
* following host objects __are not__ observed, but left as they are: `Date`, `Blob`, `Number`, `String`, `Boolean`, `Error`, `SyntaxError`, `TypeError`, `URIError`, `Function`, `Promise`, `RegExp`

#### Support matrix: ![CHROME](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/chrome.png)<sub>61+</sub> | ![FIREFOX](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/firefox.png)<sub>60+</sub> | ![EDGE](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/edge.png)<sub>16+</sub> | ![NODE JS](https://github.com/gullerya/object-observer/raw/master/docs/browser_icons/nodejs.png) <sub>8.10.0+</sub>

#### Performance report can be found [here](https://github.com/gullerya/object-observer/blob/master/docs/performance-report.md)

#### Last versions (full changelog is [here](https://github.com/gullerya/object-observer/blob/master/docs/changelog.md))

* __2.3.0__
  * fixed [Issue no. 26](https://github.com/gullerya/object-observer/issues/26) - callbacks/observers are being called with an empty changes array when set for a specific path/paths

* __2.2.0__
  * implemented [Issue no. 25](https://github.com/gullerya/object-observer/issues/25) - not dispathing events when strictly equal values reassigned (except `object`, which is never equal due to cloning)

* __2.1.0__
  * implemented [Issue no. 21](https://github.com/gullerya/object-observer/issues/21) - implemented 'partial paths observation' functionality (thanks [tonis2](https://github.com/tonis2)!)

For a short preview you may want to play with this [JSFiddle](https://jsfiddle.net/gullerya/5a4tyoqs/).

# Loading the Library

You have few ways to load the library: as an __ES6 module__ (pay attention to the __`module`__ / __`node-module`__ in the path) or as a __regular script__ (into a 'window' global scope, or a custom scope provided by you). See examples below.

* ES6 module:
```javascript
//  browser
import { Observable } from 'dist/object-observer.min.js';

//  NodeJS (when NodeJS will fully support ES6 modules syntax - this one will be removed)
let Observable = require('./dist/node/object-observer').Observable;
```

# API

Library implements `Observable` API as it is defined [here](https://github.com/gullerya/object-observer/blob/master/docs/observable.md).

# Examples

##### Objects
```javascript
let order = { type: 'book', pid: 102, ammount: 5, remark: 'remove me' },
    observableOrder = Observable.from(order);

observableOrder.observe(changes => {
    changes.forEach(change => {
        console.log(change);
    });
});


observableOrder.ammount = 7;
//  { type: 'update', path: ['ammount'], value: 7, oldValue: 5, object: observableOrder }


observableOrder.address = {
    street: 'Str 75',
    apt: 29
};
//  { type: "insert", path: ['address'], value: { ... }, object: observableOrder }


observableOrder.address.apt = 30;
//  { type: "update", path: ['address','apt'], value: 30, oldValue: 29, object: observableOrder.address }


delete observableOrder.remark;
//  { type: "delete", path: ['remark'], oldValue: 'remove me', object: observableOrder }
```

##### Arrays

```javascript
let a = [ 1, 2, 3, 4, 5 ],
    observableA = Observable.from(a);

observableA.observe(changes => {
    changes.forEach(change => {
        console.log(change);
    });
});

//  observableA = [ 1, 2, 3, 4, 5 ]
observableA.pop();
//  { type: 'delete', path: [4], oldValue: 5, object: observableA }


//  now observableA = [ 1, 2, 3, 4 ]
//  following operation will cause a single callback to the observer with an array of 2 changes in it)
observableA.push('a', 'b');
//  { type: 'insert', path: [4], value: 'a', object: observableA }
//  { type: 'insert', path: [5], value: 'b', object: observableA }


//  now observableA = [1, 2, 3, 4, 'a', 'b']
observableA.shift();
//  { type: 'delete', path: [0], oldValue: 1, object: observableA }


//  now observableA = [ 2, 3, 4, 'a', 'b' ]
//  following operation will cause a single callback to the observer with an array of 2 changes in it)
observableA.unshift('x', 'y');
//  { type: 'insert', path: [0], value: 'x', object: observableA }
//  { type: 'insert', path: [1], value: 'y', object: observableA }


//  now observableA = [ 2, 3, 4, 'a', 'b' ]
observableA.reverse();
//  { type: 'reverse', path: [], object: observableA } (see below and exampe of this event for nested array)


//  now observableA = [ 'b', 'a', 4, 3, 2 ]
observableA.sort();
//  { type: 'shuffle', path: [], object: observableA } (see below and exampe of this event for nested array)


//  observableA = [ 2, 3, 4, 'a', 'b' ]
observableA.fill(0, 0, 1);
//  { type: 'update', path: [0], value: 0, oldValue: 2, object: observableA }


//  observableA = [ 0, 3, 4, 'a', 'b' ]
//  the following operation will cause a single callback to the observer with an array of 2 changes in it)
observableA.splice(0, 1, 'x', 'y');
//  { type: 'update', path: [0], value: 'x', oldValue: 0, object: observableA }
//  { type: 'insert', path: [1], value: 'y', object: observableA }


let customer = { orders: [ ... ] },
    oCustomer = Observable.from(customer);

//  sorting the orders array, pay attention to the path in the event
oCustomer.orders.sort();
//  { type: 'shuffle', path: ['orders'], object: oCustomer.orders }


oCustomer.orders.reverse();
//  { type: 'reverse', path: ['orders'], object: oCustomer.orders }
```

> Arrays notes: Some of array operations are effectively moving/reindexing the whole array (shift, unshift, splice, reverse, sort).
In cases of massive changes touching presumably the whole array I took a pessimistic approach with a special non-detailed events: 'reverse' for `reverse`, 'shuffle' for `sort`. The rest of these methods I'm handling in an optimistic way delivering the changes that are directly related to the method invocation, while leaving out the implicit outcomes like reindexing of the rest of the Array.

##### Observation options

```javascript
let user = {
	    firstName: 'Aya',
	    lastName: 'Guller',
	    address: {
	    	city: 'of mountaineers',
	    	street: 'of the top ridges',
	    	block: 123
	    }
    },
    oUser = Observable.from(user);

//  going to observe ONLY the changes of 'firstName'
oUser.observe(changes => {}, {path: 'firstName'});

//  going to observe the changes from 'address' and deeper
oUser.observe(changes => {}, {pathsFrom: 'address'});
```
