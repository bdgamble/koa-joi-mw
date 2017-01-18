'use strict';

const request = require('supertest'),
  koa = require('koa'),
  bodyParser = require('koa-bodyparser'),
  joi = require('joi'),
  router = require('koa-router')(),
  validate = require('..');

describe('koa-joi-mw', () => {

  let app;

  beforeEach(() => {
    app = koa();

    app.use(bodyParser());

    const api = router
      .use(validate({
        body: {
          test: joi.number().required()
        },
        query: {
          test2: joi.number()
        },
        params: {
          test3: joi.number()
        },
        headers: {
          test4: joi.number()
        },
        options: {
          allowUnknown: true
        }
      })
      )
      .post('/', function* (next) {
        this.status = 200;
        this.body = {};
        yield* next;
      })
      .post('/:test3', function* (next) {
        this.status = 200;
        this.body = {};
        yield* next;
      });
    app.use(api.routes());
  });

  it('should reject an invalid request body', function(done) {
    request(app.listen())
      .post('/')
      .send({ fail: 'fail' })
      .expect(400)
      .end(done);
  });

  it('should reject an invalid request query', function(done) {
    request(app.listen())
      .post('/')
      .send({ test: 1 })
      .query({ test2: 'a' })
      .expect(400)
      .end(done);
  });

  it('should reject an invalid request param', function(done) {
    request(app.listen())
      .post('/a')
      .send({ test: 1 })
      .expect(400)
      .end(done);
  });

  it('should reject an invalid request header', function(done) {
    request(app.listen())
      .post('/')
      .send({ test: 1 })
      .set('test4', 'a')
      .expect(400)
      .end(done);
  });

  it('should accept a valid request', function(done) {
    request(app.listen())
      .post('/')
      .send({ test: 1 })
      .expect(200)
      .end(done);
  });

  it('should parse a valid request', function(done) {
    app.use(function* () {
      try {
        this.request.body.test.should.be.type('number');
        this.request.query.test2.should.be.type('number');
        this.params.test3.should.be.type('number');
        this.request.headers.test4.should.be.type('number');
        done();
      } catch (e) {
        done(e);
      }
    });

    request(app.listen())
      .post('/3')
      .send({ test: '1' })
      .query({ test2: '2' })
      .set('test4', '4')
      .expect(200)
      .end(Function.prototype);
  });

});
