import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';
import { response } from 'express';

describe('Stage should be removed from Project entity', function (){
  this.timeout(20000);

  let token: string;
  let projectId: string;
  let deleteStageId: string;

  before(async function () {
    const response = await request(app).post('/auth/login').send({
      email: 'testuser@gmail.com',
      password: 'Testp@ssword1!',
    });

    token = response.body.token;
    console.log('Test token: ', token);

    const projectResponse = await request(app)
      .post('/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test project',
      });

    projectId = projectResponse.body.projectId;
    console.log('Test project: ', projectId);

    const stageResponse = await request(app)
      .post(`/stages/create/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test stage',
      });

    deleteStageId = stageResponse.body.stageId;

    // This stage is not deleted
    await request(app)
      .post(`/stages/create/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test stage',
      });
  });

  it('should delete the Stage', async function() {
    const response = await request(app)
      .delete(`/stages/delete/${deleteStageId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
  });

  it('stage should not be found in Project', async function() {
    const response = await request(app)
      .get(`/projects/get/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.body.project.stageIds).to.not.include(deleteStageId);
  });
});