var express = require('express');
var expect = require('chai').expect;
var app = require('../app.js')

describe ('Test test environment', function() {
  it('"text" should be a string', function(done) {
    expect('text').to.be.a('string');
    done();
  });
});

describe('GET /', function() {
  it('should redirec to /login when user is not logged in', function(done) {
    var request = require('supertest');
    request(app)
      .get('/')
      .expect(302)
      .expect(function(res) {
        var redirect = res.headers.location;
        expect(redirect).to.equal('/login');
      })
      .end(done);
  });
});

