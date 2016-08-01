(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.VueForm = factory());
}(this, function () { 'use strict';

    function Errors() {
        this.errors = {};

        this.hasErrors = function () {
            return !_.isEmpty(this.errors);
        };

        this.has = function (field) {
            return _.indexOf(_.keys(this.errors), field) > -1;
        };

        this.all = function () {
            return this.errors;
        };

        this.flatten = function () {
            return _.flatten(_.toArray(this.errors));
        };

        this.get = function (field) {
            if (this.has(field)) {
                return this.errors[field][0];
            }
        };

        this.set = function (errors) {
            if (typeof errors === 'object') {
                this.errors = errors;
            } else {
                this.errors = { 'form': ['Whoops, looks like something went wrong.'] };
            }
        };

        this.forget = function () {
            this.errors = {};
        };
    };

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) arguments[0][key] = arguments[i][key];
            }
        }return arguments[0];
    }

    function Form(Vue, data) {
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
            return new Promise(function (resolve, reject) {
                Vue.http.get(uri, form.clean(form.data)).then(function (response) {
                    extend(form.data, response.data);
                    form.ready = true;
                    resolve(response.data);
                }).catch(function (errors) {
                    form.errors.set(errors.data);
                    reject(errors.data);
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
            return new Promise(function (resolve, reject) {
                form.startProcessing();

                Vue.http[method](uri, form.clean(form.data)).then(function (response) {
                    form.finishProcessing();

                    resolve(response.data);
                }).catch(function (errors) {
                    form.errors.set(errors.data);
                    form.busy = false;

                    reject(errors.data);
                });
            });
        };

        this.clean = function (data) {
            return JSON.parse(JSON.stringify(data));
        };
    }

    function install(Vue) {
        Vue.prototype.$form = function (data) {
            return new Form(Vue, data);
        };

        Vue.form = function (data) {
            return new Form(Vue, data);
        };
    }

    return install;

}));