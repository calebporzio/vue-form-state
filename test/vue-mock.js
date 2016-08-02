export default {
	http: {
		get: function (url) {
			return new Promise((resolve, reject) => {
				if (url == 'resolve') {
					resolve({ data: 
						{ 
							name: 'John',
							game: 'Jacks'
						} 
					})
				} else {
					reject({ data: 
						{
							field: ["Some Error"]
						}
					})
				}
			})
		},
		post(url, data) {
			return new Promise((resolve, reject) => {
				if (url == 'resolve') {
					resolve({ data: 
						data || {}
					})
				} else {
					reject({ data: 
						{
							field: ["Some Error"]
						}
					})
				}
			})
		}
	}
}
