'use strict';

var supertest = require('supertest'),
  app = require('../app');

describe('Login', function() {
  it('should return a 400 response', function(done) {
    supertest(app)
      .post('/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect(400, done);
  });
});
