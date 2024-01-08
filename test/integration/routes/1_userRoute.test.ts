import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';

describe('Register and Login a new user', () => {
  it('should register a new user', async function () {
    this.timeout(10000);

    const response = await request(app).post('/auth/register').send({
      name: 'testuser',
      email: 'testuser@gmail.com',
      password: 'Testp@ssword1!',
    });

    expect([200, 409]).to.include(response.status);

    if (response.status === 200) {
      expect(response.body).to.have.property('status', 'success');
    }

    if (response.status === 409) {
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error', 'user already existed');
    }
  });

  it('should login an existing user', async function () {
    const response = await request(app).post('/auth/login').send({
      email: 'testuser@gmail.com',
      password: 'Testp@ssword1!',
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('token', response.body.token);
  });
});
