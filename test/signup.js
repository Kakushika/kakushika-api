// 'use strict';
//
// var expect = require('chai').expect,
//   supertest = require('supertest'),
//   app = require('../app'),
//   models = require('../models');
//
// describe('Signup', function() {
//   before(function() {
//     models.User.destroy({
//       where: {
//         email: 'hoge@hoge.net'
//       },
//       truncate: true
//     });
//   });
//
//   it('should return a 200 response', function(done) {
//     supertest(app)
//       .post('/signup')
//       .set('X-Requested-With', 'XMLHttpRequest')
//       .expect(200)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         expect(res.body).to.have.property('ok');
//         expect(res.body.result).to.not.be.true;
//         expect(res.body).to.have.property('error');
//         done();
//       });
//   });
//
//   it('should return a 201 response', function(done) {
//     supertest(app)
//       .post('/signup')
//       .set('X-Requested-With', 'XMLHttpRequest')
//       .send({
//         'email': 'hoge@hoge.net',
//         'password': 'hoge'
//       })
//       .expect(201)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         expect(res.body).to.have.property('ok');
//         expect(res.body.ok).to.be.true;
//         expect(res.header).to.have.property('location');
//         expect(res.header.location).not.to.be.null;
//         done();
//       });
//   });
// });
