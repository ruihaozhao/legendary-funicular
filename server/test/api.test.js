import {use, expect} from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {mongoose} from 'mongoose';

import {server, connect} from '../server.js';
import Task from '../models/Task.js';

const chai = use(chaiHttp)


describe('Tasks API', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await connect(mongoUri);
  });

  after(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  describe('GET /api/tasks', () => {
    it('should return an array of tasks', async () => {
      await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do'
      });

      const res = await chai.request(server).get('/api/tasks');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('title', 'Task 1');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Description',
        status: 'To Do'
      };
      const res = await chai.request(server).post('/api/tasks').send(newTask);

      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('title', 'New Task');
    });

    it('should return an error for incomplete task data', async () => {
      const incompleteTask = {
        description: 'Description',
        status: 'To Do'
      };
      const res = await chai.request(server).post('/api/tasks').send(incompleteTask);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

  });

  describe('PUT /api/tasks/:id', () => {
    it('should update the status of a task', async () => {
      await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do'
      });
      let res = await chai.request(server).get('/api/tasks');

      const taskId = res.body[0]._id;
      const updatedStatus = {
        status: 'Done'
      };
      res = await chai.request(server).put(`/api/tasks/${taskId}`).send(updatedStatus);

      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status', 'Done');
    });
  });
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const taskId = '3a7bf91e2d0c5e8f9a6db05c';
      const res = await chai.request(server).delete(`/api/tasks/${taskId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('message', 'Task deleted successfully');
    });

  });
});