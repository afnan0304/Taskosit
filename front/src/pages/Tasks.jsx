import { useEffect, useState } from 'react';
import API from '../api';
import './tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    const res = await API.get('/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (title.trim() === '') return;
    await API.post('/tasks', { title });
    setTitle('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-wrapper">
      <div className="task-container">
        <h2>My Tasks</h2>
        <div className="task-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task._id}>
              {task.title}
              <button onClick={() => deleteTask(task._id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
