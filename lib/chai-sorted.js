'use strict'
var isSorted = require('./is.sorted')

var chaiIsSorted = function (chai, array, options) {
  options = options === undefined ? {} : options

  var useDescendingOrder = typeof options === 'object' ? !!options.descending : false

  if (options.ignoreCase) {
    array = array.map(function (item) {
      return typeof item === 'string' ? item.toUpperCase() : item
    })
  }

  // Backwards compatibility
  if (typeof options === 'boolean') {
    useDescendingOrder = options
  }

  var Assertion = chai.Assertion
  new Assertion(array).to.be.a('array')

  this.assert(
    isSorted(array, useDescendingOrder),
    'expected #{this} to be sorted in ' + (useDescendingOrder ? 'descending' : 'ascending') + ' order',
    'expected #{this} to not be sorted'
  )
}

module.exports = function (chai, utils) {
  chai.Assertion.addMethod('sorted', function (options) {
    chaiIsSorted.call(this, chai, this._obj, options)
  })

  utils.addProperty(chai.Assertion.prototype, 'descending', function () {
    chaiIsSorted.call(this, chai, this._obj, { descending: true })
  })

  utils.addProperty(chai.Assertion.prototype, 'ascending', function () {
    chaiIsSorted.call(this, chai, this._obj)
  })

  utils.addProperty(chai.Assertion.prototype, 'ignoreCase', function () {
    chaiIsSorted.call(this, chai, this._obj, { ignoreCase: true })
  })

  chai.Assertion.addMethod('sortedBy', function (key, options) {
    var array = utils.flag(this, 'object').map(function (item) {
      return item[key]
    })
    chaiIsSorted.call(this, chai, array, options)
  })

  chai.Assertion.addMethod('descendingBy', function (key, options) {
    var array = utils.flag(this, 'object').map(function (item) {
      return item[key]
    })
    chaiIsSorted.call(this, chai, array, Object.assign({descending: true}, options))
  })

  chai.Assertion.addMethod('ascendingBy', function (key, options) {
    var array = utils.flag(this, 'object').map(function (item) {
      return item[key]
    })
    chaiIsSorted.call(this, chai, array, options)
  })
}
