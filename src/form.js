import Errors from './errors.js'

function extend () {
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

export default function Form (Vue, data) {
    var form = this;

    this.data = data || {};

    this.errors = new Errors();

    this.ready = false;
    this.busy = false;
    this.successful = false;

    this.startProcessing = function () {
        form.errors.forget();
        form.busy = true;
        form.successful = false;
    };

    this.finishProcessing = function () {
        form.busy = false;
        form.successful = true;
    };

    this.resetStatus = function () {
        form.errors.forget();
        form.busy = false;
        form.successful = false;
    };

    this.setErrors = function (errors) {
        form.busy = false;
        form.errors.set(errors);
    };

    this.init = function (uri) {
        return new Promise((resolve, reject) => {
            Vue.http.get(uri, form.clean(form.data))
                .then(response => {
                	extend(form.data, response.data);
                	form.ready = true;
                    resolve(response);
                })
                .catch(errors => {
                    form.errors.set(errors.data);
                    reject(errors);
                });
        });
    };

    this.post = function (uri) {
        return this.sendForm('post', uri);
    };

    this.get = function (uri) {
        return this.sendForm('get', uri);
    };

    this.put = function (uri) {
        return this.sendForm('put', uri);
    };

    this.delete = function (uri) {
        return this.sendForm('delete', uri);
    };

    this.sendForm = function (method, uri) {
        return new Promise((resolve, reject) => {
            form.startProcessing();

            Vue.http[method](uri, form.clean(form.data))
                .then(response => {
                	extend(form.data, response.data);

                    form.finishProcessing();

                    resolve(response);
                })
                .catch(errors => {
                    form.errors.set(errors.data);
                    form.busy = false;

                    reject(errors);
                });
        });
    };

    this.clean = function (data) {
    	return JSON.parse(JSON.stringify(data));
    };
}