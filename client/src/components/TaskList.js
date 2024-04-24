// TaskList.js
import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onUpdateStatus, onDeleteTask }) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id}>
          <div className="task-header">
            <span className="task-title">{task.title}</span>
            <button onClick={() => onDeleteTask(task._id)}>Delete</button>
          </div>
          <div className="task-description">{task.description}</div>
          <div className="task-status">
            Status: {task.status}
            <div>
              <button onClick={() => onUpdateStatus(task._id, 'To Do')}>To Do</button>
              <button onClick={() => onUpdateStatus(task._id, 'In Progress')}>In Progress</button>
              <button onClick={() => onUpdateStatus(task._id, 'Done')}>Done</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
