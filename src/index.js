import Form from './form.js'

function install (Vue) {
    Vue.prototype.$form = function (data) {
    	return new Form(Vue, data);
    }

    Vue.form = function (data) {
    	return new Form(Vue, data);
    }
}

export default install