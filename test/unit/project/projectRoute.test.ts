import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';

describe('Join a Project and then leave a Project', function () {
  this.timeout(10000);

  let token: string;
  let testProjectId: string = '657d29db41f938a6bd381538';

  before(async function () {
    const response = await request(app).post('/auth/login').send({
      email: 'testuser@gmail.com',
      password: 'Testp@ssword1!',
    });

    token = response.body.token;
  });

  it('should join a new project', async function () {
    const response = await request(app)
      .post(`/projects/join/${testProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
  });

  it('should leave the project', async function () {
    const response = await request(app)
      .post(`/projects/leave/${testProjectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
  });
});
