


import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaTrash } from "react-icons/fa";
import "../index.css";

const ItemType = "TASK";

const KanbanProcess = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const statuses = ["To Do", "In Progress", "Done"];

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTaskName.trim() !== "" && newTaskTitle.trim() !== "") {
      const newTask = {
        id: `task-${Date.now()}`,
        name: newTaskName,
        title: newTaskTitle,
        status: "To Do",
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskName("");
      setNewTaskTitle("");
      setIsModalOpen(false);
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="todo">
        <div>
          <button className="add_task_btn" onClick={() => setIsModalOpen(true)}>
            Add Task
          </button>
        </div>
        <div className="todo_data">
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <input
              type="text"
              placeholder="Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="modal_inp_task"
            />
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="modal_inp_task"
            />
            <div className="modal-actions">
              <button className="save-task-button" onClick={addTask}>
                Add Task
              </button>
              <button
                className="cancel-task-button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

const Column = ({ status, tasks, updateTaskStatus, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item) => updateTaskStatus(item.id, status),
  });

  return (
    <div className="kanban-column" ref={drop}>
      <h3>{status}</h3>
      {tasks.map((task) => (
        <Task key={task.id} task={task} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

const Task = ({ task, deleteTask }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { id: task.id },
  });

  return (
    <div className="kanban-card" ref={drag}>
      <div className="task-details">
        <p><strong>{task.name}</strong></p>
        <p>{task.title}</p>
      </div>
      <button
        className="delete-task-button"
        onClick={() => deleteTask(task.id)}
      >
        <FaTrash size={16} />
      </button>
    </div>
  );
};

export default KanbanProcess;
