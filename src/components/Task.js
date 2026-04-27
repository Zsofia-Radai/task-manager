import deleteIcon from "../resources/deleteIcon.svg";
import "./Task.css";

function Task({ task, toggleTask, deleteTask, onDoubleClick }) {
  return (
    <li key={task.id}>
      <div
        className={`task-container ${task.uiState} ${task.completed ? "completed" : ""}`}
        onDoubleClick={onDoubleClick}
      >
        <div className="task">
          <input
            type="checkbox"
            onChange={() => toggleTask(task.id)}
            checked={task.completed}
          />
          <div>{task.name}</div>
        </div>
        <button className="delete-button" onClick={() => deleteTask(task.id)}>
          <img className="delete-icon" src={deleteIcon} alt="Delete" />
        </button>
      </div>
    </li>
  );
}

export default Task;
