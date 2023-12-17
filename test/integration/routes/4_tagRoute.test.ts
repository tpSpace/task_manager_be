import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';

describe('Create and View all Stages', function () {
  this.timeout(10000);

  let token: string;
  let projectId: string;

  before(async function () {
    const response = await request(app).post('/auth/login').send({
      email: 'testuser@gmail.com',
      password: 'Testp@ssword1!',
    });

    token = response.body.token;

    const projectResponse = await request(app)
      .post('/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test project',
      });

    projectId = projectResponse.body.projectId;
  });

  it('should create a new Tag', async function () {
    const response = await request(app)
      .post(`/tags/create/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test tag',
        priority: 1,
        colour: '#000000',
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('tagId');
  });

  it('should get all stages from a project', async function () {
    const response = await request(app)
      .get(`/tags/get/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('tags');
  });
});
