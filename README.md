# Vue-Form
---
A plugin for Vue.js that takes the pain out ajax-heavy web apps. 
(Heavily inspired from SparkForm in the [Laravel Spark](https://spark.laravel.com/) source code.)

## Installation

### NPM
```
$ npm install vue-form-state
```

### Setup
```javascript
var Vue = require('vue');
var VueResource = require('vue-resource');
var VueFormState = require('vue-form-state');

Vue.use(VueResource);
Vue.use(VueFormState);
```

### Usage

This should demonstrate the basic usage of VueFormState in a Vue.js component.
```javascript
vm = new Vue({
	data: {
		form: new Vue.form({
			foo: 'foo',
			bar: 'bar'
		})
	},

	ready: function () {
		// Initialize the data property via get request
		// with data from the server.
		this.form.init('some/url');
	},

	methods: {
		send: function () {
			// Send the data property to the server
			// update the state, and return a promise.
			
			// Post
			this.form.post('some/url');

			// Put
			this.form.put('some/url/1');

			// Delete
			this.form.delete('some/url/1');
		}
	}
})
```

#### State Helpers
These are the methods available on your form object. Feel free to use them in your templates for more convenient operations.
```javascript
form.ready; // Set to true after the init method returns successfully.

form.busy; // Set to true during POST / PUT / DELETE requests.

form.successful; // Set to true after a 200 response from the server.

form.errors.hasErrors(); // Returns true if the form recieved errors from the server.

form.errors.has('someError'); // Get a specific error.

form.errors.all(); // Get an object of all the errors.

form.errors.flatten(); // Get a flattened array of all the errors.

form.errors.get('someError'); // Get a specific error message / array of messages
```

As always, the source code is the best form of documentation. Take a look at [this file](https://github.com/calebporzio/vue-form-state/blob/master/src/form.js) for all available methods.
