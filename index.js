'use strict';

const joi = require('joi');

const requestParts = [
  {
    key: 'body',
    value: function () { return this.request.body; },
    cb: function ( err, value ) {
      if ( err ) {
        throw err;
      }
      this.request.body = value;
    }
  },
  {
    key: 'query',
    value: function () { return this.request.query; },
    cb: function ( err, value ) {
      if ( err ) {
        throw err;
      }
      this.request._querycache[this.request.querystring] = value;
    }
  },
  {
    key: 'params',
    value: function () { return this.params; },
    cb: function ( err, value ) {
      if ( err ) {
        throw err;
      }
      this.params = value;
    }
  },
  {
    key: 'headers',
    value: function () { return this.request.headers; },
    cb: function ( err, value ) {
      if ( err ) {
        throw err;
      }
      Object.assign(
        this.request.headers,
        value
      );
    }
  },
];

module.exports = function( options ) {
  const opts = Object.assign( {
    failCode: 400
  }, options );

  return function* ( next ) {
    const that = this;
    try {
      yield requestParts.map( part => {
        if ( !opts[part.key] ) {
          return Promise.resolve();
        }

        return Promise.resolve(
          joi.validate(
            part.value.call(that),
            opts[part.key],
            opts.options,
            part.cb.bind(that)
          )
        );
      });
    } catch ( err ) {
      if ( err.name === 'ValidationError' ) {
        err.status = opts.failCode;
      }
      throw err;
    }
    yield next;
  };
};
