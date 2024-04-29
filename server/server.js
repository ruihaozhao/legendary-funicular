import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Task from './models/Task.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

const mongoUri = 'mongodb+srv://raymondzhao3000:Y6fHAy6V3OJtWZ0E@cluster0.ylvnwhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Define routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    // Validate task data
    if (!title || !status || !['To Do', 'In Progress', 'Done'].includes(status)) {
      throw new Error('Invalid task data');
    }

    const task = new Task({ title, description, status });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(400).json({ error: error.message });
  }
});


app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export async function connect(uri=mongoUri) {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }
}

async function close() {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
}
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'test') {
  // Only connect to the database if not running tests
  connect();
}

export const server = app.listen(4000, () => {
  console.log('Server started on port 4000');
});

// Gracefully shut down the server and close the MongoDB connection
process.on('SIGINT', async () => {
  await close();
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

