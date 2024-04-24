// Import chai and chai-http using dynamic import
const chaiPromise = import('chai');
const chaiHttpPromise = import('chai-http');

// Resolve the promises and use the modules
Promise.all([chaiPromise, chaiHttpPromise])
  .then(([chai, chaiHttp]) => {
    const should = chai.should();
    chai.use(chaiHttp);

    const server = require('../server.js'); // Assuming your server file is named server.js
    const Task = require('../models/Task.js');

    
  describe('Tasks', () => {
    // Clear the database before each test
    beforeEach((done) => {
      Task.deleteMany({}, (err) => {
        done();
      });
    });

  describe('/GET tasks', () => {
    it('it should GET all the tasks', (done) => {
      chai.request(server)
        .get('/api/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST tasks', () => {
    it('it should POST a new task', (done) => {
      const task = {
        title: 'Task 1',
        description: 'Description 1',
        status: 'To Do',
      };
      chai.request(server)
        .post('/api/tasks')
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql('Task 1');
          done();
        });
      });
    });
  })
  .catch((error) => {
    console.error('Error loading modules:', error);
  });

});
