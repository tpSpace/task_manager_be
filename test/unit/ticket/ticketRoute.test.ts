import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/index';

describe('Assign all attributes to Ticket', function () {
  this.timeout(20000);

  let token: string;
  let projectId: string;
  let stageId: string;
  let ticketId: string;
  let tagId: string;

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

    const stageResponse = await request(app)
      .post(`/stages/create/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test stage',
      });

    stageId = stageResponse.body.stageId;

    const tagResponse = await request(app)
      .post(`/tags/create/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test tag',
        priority: 1,
        colour: '#000000',
      });

    tagId = tagResponse.body.tagId;

    const commentReponse = await request(app)
      .post(`/comments/create/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        comment: 'test comment',
      });
  });

  it('should create a new Ticket', async function () {
    const response = await request(app)
      .post(`/tickets/create/${stageId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test ticket',
        description: 'testing',
        deadline: '2022-03-15T13:45:30Z',
        tagId: tagId,
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('ticketId');

    ticketId = response.body.ticketId;
  });

  it('should get all tickets from a project', async function () {
    const response = await request(app)
      .get(`/tickets/get/project/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('tickets');
  });

  it('should get all tickets from a Stage', async function () {
    const response = await request(app)
      .get(`/tickets/get/stage/${stageId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('tickets');
  });

  it('should get all tickets from a TicketId', async function () {
    const response = await request(app)
      .get(`/tickets/get/ticket/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('ticket');
  });
});
