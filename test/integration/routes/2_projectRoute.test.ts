import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';

describe('Create and View a Project', function () {
  this.timeout(10000);

  let token: string;

  before(async function () {
    const response = await request(app).post('/auth/login').send({
      email: 'testuser@gmail.com',
      password: 'Testp@ssword1!',
    });

    token = response.body.token;
  });

  it('should create a new project', async function () {
    const response = await request(app)
      .post('/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test project',
        description: 'test project description',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('projectId');
  });

  it('should view all of the user projects', async function () {
    const response = await request(app)
      .get('/projects/get')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('projects');
  });
});
