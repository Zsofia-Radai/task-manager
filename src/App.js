import "./App.css";
import { useState, useEffect } from "react";
import Task from "./components/Task";

const UI_STATE = {
  IDLE: "idle",
  ADDING: "adding",
  DELETING: "deleting",
};

const FILTERS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "active",
    label: "Active",
  },
  {
    key: "completed",
    label: "Completed",
  },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {}, [filter]);

  const addTask = (event) => {
    if (event.key === "Enter") {
      const name = event.target.value.trim();

      if (name === "") {
        setError("Task name cannot be empty.");
        return;
      }

      const newTask = createTask(name);
      setError(null);

      setTasks((prev) => [newTask, ...prev]);

      setTimeout(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === newTask.id ? { ...task, uiState: UI_STATE.IDLE } : task,
          ),
        );
      }, 100);

      event.target.value = "";
    }
  };

  const createTask = (taskName) => {
    return {
      id: Date.now().toString(),
      name: taskName,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      uiState: UI_STATE.ADDING,
      editMode: false,
    };
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null,
          };
        }
        return task;
      }),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, uiState: UI_STATE.DELETING } : task,
      ),
    );

    setTimeout(() => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }, 300);
  };

  const editTask = (taskId) => {
    console.log("Edit task with id:", taskId);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, editMode: true } : task,
      ),
    );
  };

  const cancelEdit = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, editMode: false } : task,
      ),
    );
  };

  const saveTask = (taskId, newName) => {
    const updatedName = newName.trim();
    if (updatedName) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, name: updatedName, editMode: false } : t,
        ),
      );
    } else {
      deleteTask(taskId);
    }
  };

  const filterTasks = (filter) => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Task Manager</h1>
        <div className="input-container">
          <label htmlFor="task-input">Add a new task:</label>
          <input
            className="task-input"
            onKeyUp={addTask}
            placeholder="e.g. buy groceries"
            onChange={() => setError(null)}
          />
          {error && <div className="error">{error}</div>}
        </div>
        <div className="filter-options">
          {FILTERS.map((f) => (
            <div
              key={f.key}
              className={filter === f.key ? "active" : ""}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </div>
          ))}
        </div>
        <hr />
        {tasks.length === 0 ? (
          <div className="no-tasks">
            No tasks yet. Add your first task above!
          </div>
        ) : (
          <ul>
            {filterTasks(filter).map((task, index) =>
              task.editMode ? (
                <li key={task.id}>
                  <input
                    className="edit-task"
                    type="text"
                    defaultValue={task.name}
                    onBlur={(event) => saveTask(task.id, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        saveTask(task.id, event.target.value);
                      }
                      if (event.key === "Escape") {
                        cancelEdit(task.id);
                      }
                    }}
                    autoFocus
                  />
                </li>
              ) : (
                <Task
                  onDoubleClick={() => editTask(task.id)}
                  key={task.id}
                  task={task}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                />
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
