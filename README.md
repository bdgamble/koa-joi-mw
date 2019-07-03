# koa-joi-mw

[![Greenkeeper badge](https://badges.greenkeeper.io/bdgamble/koa-joi-mw.svg)](https://greenkeeper.io/)
Koa middleware to validate requests against joi schemas.

## API

```es6
const validate = require('koa-joi-mw');

validate(options)
```
A koa middleware which will validate and transform the request

| param | type | required | description |
|-------|------|------------------|-------------|
| options | object | true | |
| options.failCode | number | false | The error code to throw in case of validation error, defaults to 400 |
| options.options | object | false | Options passed to Joi validator, such as `allowUnknown` |
| options.body | Joi.object | false | A joi schema validated against the request body |
| options.params | Joi.object | false | A joi schema validated against the request params |
| options.headers | Joi.object | false | A joi schema validated against the request headers |
| options.query | Joi.object | false | A joi schema validated against the request query |

## Usage

``` es6
const joi = require('joi'),
  validate = require('koa-joi-mw');

router.post('/:number/:string/:date',
  validate({
    params: joi.object({
      number: joi.number().required(),
      string: joi.string().required(),
      date: joi.date().required()
    }),
    body: joi.object({
      number: joi.number().required(),
      string: joi.string().required(),
      date: joi.date().required()
    }),
    headers: joi.object({
      number: joi.number().required(),
      string: joi.string().required(),
      date: joi.date().required()
    }),
    query: joi.object({
      number: joi.number().required(),
      string: joi.string().required(),
      date: joi.date().required()
    }),
    options: { allowUnknown: true }
  }),
  function * () {
    this.assert(typeof this.params.number === 'number');
    this.assert(typeof this.params.string === 'string');
    this.assert(this.params.date instanceof Date);

    ['body', 'headers', 'query'].forEach(el => {
      this.assert(typeof this.request[el].number === 'number');
      this.assert(typeof this.request[el].string === 'string');
      this.assert(this.request[el].date instanceof Date);
    });

    this.status = 204;
  }
);
```
