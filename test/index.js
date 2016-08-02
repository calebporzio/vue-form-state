
import Vue from './vue-mock'

import Form from '../src/form.js'

describe("Form", () => {

	let form = new Form(Vue, { name: 'Jack', girlfriend: 'jill' })

	it("puts data into it's data property when instantiated", () => {
		expect(form.data.name).toBe('Jack')
		expect(form.data.girlfriend).toBe('jill')
	})

	describe("The init method", () => {
		
		it("overwrites the data object on completion", (done) => {
			form.init('resolve')
				.then((response) => {
					expect(form.data.name).toBe('John')
					done()
				}).catch(() => done())
		})

		it("doesnt add uninitialized data properties", (done) => {
			form.init('resolve')
				.then(response => {
					expect(form.data.game).toBe(undefined)
					done()
				})
		})
	})

	describe("Form.errors", () => {

		it("has errors when an ajax request fails", (done) => {
			form.post('reject')
				.catch(errors => {
					expect(form.errors.hasErrors()).toBe(true)
					expect(form.errors.flatten()[0]).toBe("Some Error")
					expect(form.errors.has("field")).toBe(true)
					expect(form.errors.get("field")).toBe("Some Error")
					expect(form.errors.all().field.length).toBe(1)

					form.errors.forget()

					expect(form.errors.hasErrors()).toBe(false)

					done()
				})
		})
	})

})