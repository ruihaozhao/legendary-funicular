const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
