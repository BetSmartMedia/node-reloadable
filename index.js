inspect = require('util').inspect

module.exports = function (config_path, opts) {
	var settings = {
		toJSON: function() { return this.__proto__ },
		inspect: function() { return inspect(this.__proto__) },
	}
	
	opts || (opts = {})
	opts.error || (opts.error = defaultErrorHandler)

	function reload() {
		delete require.cache[require.resolve(config_path)]
		try { settings.__proto__ = require(config_path) }
		catch (err) { opts.error(err, config_path) }
	}

	if (opts.signal) process.on(opts.signal, reload)
	if (opts.exposeReload) settings.reload = reload

	reload()
	return settings
}

function defaultErrorHandler (err, path) {
	console.error(path, err)
}
