var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var q = require('q');
var spark = require('spark')

function Device(opts) {
	this._device = null;
	this.authenticated = false;
	this.opts = opts;
	if (!this.authenticated) {
		this.authAction = this.authenticate();
	}
}

util.inherits(Device, EventEmitter);

_(Device.prototype).extend({

	authenticate: function() {
		var opts = this.opts;
		this.authInProgress = true;
		this.authRequest = spark.login({ accessToken: opts.token })
			.then(this._onAuthSuccess.bind(this), this._onAuthError.bind(this))
			.then(this._getDevices.bind(this))
			.then(this._findDevice(opts.id))
			.then(this._registerEvents(opts.events));

		return this.authRequest;
	},

	connect: function() {
		if (this.authenticated && this._device) {
			return this._connect();
		}
		else if (!this.authenticated && this.authInProgress) {
			return this.authRequest.then(this._connect.bind(this))
		}
		else if (!this.authenticated) {
			return this.authenticate().then(this._connect.bind(this));
		}
		return q.reject({ message: 'Unknown error' });
	},

	connected: function() {
		if (this._device && this._device.connected) {
			return true;
		}
		return false;
	},

	_connect: function() {
		var dfd = q.defer();
		this._device.signal()
			.then(this._onDeviceSignaled(dfd), function() {
				this._onDeviceSilent()
				dfd.reject()
			}.bind(this));
		return dfd.promise;
	},

	_registerEvents: function(events) {
		return function() {
			if (this._device) {
				_(events).each(function(evt) {
					var init = true;
					this._device.onEvent(evt, function() {
						var args = _(arguments).toArray();
						args.unshift(evt);
						if (init) {
							init = false;
							console.log(evt + ' registered')
						} else {
							this.emit.apply(this, args)
						}
					})
				}, this);
			}
		}.bind(this);
	},

	_onAuthSuccess: function() {
		this.authInProgress = false;
		this.authenticated = true;
	},

	_onAuthError: function() {
		var error = { message: 'Unable to authenticate with Spark' };
		this.authInProgress = false;
		this.emit('error', error);
	},

	_onDeviceConnect: function() {
		this.emit('connected');
	},

	_onDeviceSignaled: function(dfd) {
		return function() {
			if (this._device.connected) {
				this._onDeviceConnect();
				dfd.resolve();
			} else {
				this._onDeviceSilent();
				dfd.reject();
			}
		}.bind(this);
	},

	_onDeviceSilent: function() {
		var error = { message: 'Unable to signal device' };
		this.emit('error', error);
	},

	_getDevices: function() {
		return spark.listDevices();
	},

	_findDevice: function(id) {
		return function() {
			var device = _(spark.devices).findWhere({
				id: id
			})
			if (device) {
				this._device = device;
				this.emit('ready');

				if (this.connected()) {
					this._onDeviceConnect();
				}
				return this._device;
			}
			return this.emit('error', 'Unable to find requested device');
		}.bind(this)
	}

})

module.exports.Device = Device;
