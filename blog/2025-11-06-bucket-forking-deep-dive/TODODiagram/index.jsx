import React, { useState, useMemo, useRef } from "react";
import styles from "./styles.module.css";

// --- Main App Component ---
export default function App() {
  // Initialize state with a baseline history entry for the initial empty state.
  const [todos, setTodos] = useState([]);
  const [history, setHistory] = useState(() => {
    const initialTodos = [];
    return [
      {
        id: Date.now(),
        event: "Initial State",
        timestamp: new Date(),
        todosState: initialTodos,
        todoText: "",
      },
    ];
  });
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");

  const inputRef = useRef(null);

  // --- TODO Handlers ---
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    const todoText = newTodo.trim();
    const newTodoItem = {
      id: Date.now(),
      text: todoText,
      completed: false,
      createdAt: new Date(),
    };

    const nextTodos = [newTodoItem, ...todos];
    const nextHistoryEntry = {
      id: Date.now() + Math.random(),
      event: "Created TODO",
      todoText: todoText,
      timestamp: new Date(),
      todosState: nextTodos,
    };

    setTodos(nextTodos);
    setHistory((prevHistory) => [nextHistoryEntry, ...prevHistory]);
    setNewTodo("");
  };

  const handleToggleComplete = (todoToToggle) => {
    const nextTodos = todos.map((todo) =>
      todo.id === todoToToggle.id
        ? { ...todo, completed: !todo.completed }
        : todo
    );
    const eventText = todoToToggle.completed
      ? "Marked TODO as Incomplete"
      : "Completed TODO";
    const nextHistoryEntry = {
      id: Date.now() + Math.random(),
      event: eventText,
      todoText: todoToToggle.text,
      timestamp: new Date(),
      todosState: nextTodos,
    };

    setTodos(nextTodos);
    setHistory((prevHistory) => [nextHistoryEntry, ...prevHistory]);
  };

  const handleDeleteTodo = (todoToDelete) => {
    const nextTodos = todos.filter((todo) => todo.id !== todoToDelete.id);
    const nextHistoryEntry = {
      id: Date.now() + Math.random(),
      event: "Deleted TODO",
      todoText: todoToDelete.text,
      timestamp: new Date(),
      todosState: nextTodos,
    };

    setTodos(nextTodos);
    setHistory((prevHistory) => [nextHistoryEntry, ...prevHistory]);
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const handleUpdateTodo = (todoId) => {
    if (editText.trim() === "") {
      setEditingTodo(null);
      setEditText("");
      return;
    }
    const originalTodo = todos.find((t) => t.id === todoId);
    const newText = editText.trim();
    const nextTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, text: newText } : todo
    );
    const nextHistoryEntry = {
      id: Date.now() + Math.random(),
      event: `Updated TODO from "${originalTodo.text}"`,
      todoText: `to "${newText}"`,
      timestamp: new Date(),
      todosState: nextTodos,
    };

    setTodos(nextTodos);
    setHistory((prevHistory) => [nextHistoryEntry, ...prevHistory]);
    setEditingTodo(null);
    setEditText("");
  };

  // --- History Revert Handler ---
  const handleRevert = (historyEntry) => {
    const stateToRestore = historyEntry.todosState;

    const nextHistoryEntry = {
      id: Date.now() + Math.random(),
      event: `Reverted to state from ${historyEntry.timestamp.toLocaleTimeString()}`,
      todoText: `(${historyEntry.event}: "${historyEntry.todoText}")`,
      timestamp: new Date(),
      todosState: stateToRestore,
    };

    setTodos(stateToRestore);
    setHistory((prevHistory) => [nextHistoryEntry, ...prevHistory]);
  };

  // Memoize the sorted list of todos to prevent re-sorting on every render
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed === b.completed) {
        // Sort by creation date, newest first
        return b.createdAt - a.createdAt;
      }
      // Incomplete tasks come first
      return a.completed ? 1 : -1;
    });
  }, [todos]);

  // --- Helper to format timestamps ---
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    return timestamp.toLocaleString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* TODO List Section */}
        <div className={`${styles.section} ${styles.todoSection}`}>
          <h2 className={`${styles.sectionTitle} ${styles.todoSectionTitle}`}>
            My Tasks
          </h2>
          <form onSubmit={handleAddTodo} className={styles.form}>
            <input
              ref={inputRef}
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className={styles.input}
            />
            <button
              type="submit"
              className={styles.addButton}
              disabled={!newTodo.trim()}
            >
              Add
            </button>
          </form>

          <ul className={styles.todoList}>
            {sortedTodos.map((todo) => (
              <li
                key={todo.id}
                className={`${styles.todoItem} ${
                  todo.completed ? styles.todoItemCompleted : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className={styles.checkbox}
                />

                {editingTodo === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleUpdateTodo(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateTodo(todo.id);
                      if (e.key === "Escape") {
                        setEditingTodo(null);
                        setEditText("");
                      }
                    }}
                    className={styles.editInput}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEditing(todo)}
                    className={`${styles.todoText} ${
                      todo.completed ? styles.todoTextCompleted : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                <div className={styles.todoActions}>
                  <button
                    onClick={() => startEditing(todo)}
                    className={`${styles.iconButton} ${styles.editButton}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.icon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo)}
                    className={`${styles.iconButton} ${styles.deleteButton}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.icon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* History Section */}
        <div className={`${styles.section} ${styles.historySection}`}>
          <h2
            className={`${styles.sectionTitle} ${styles.historySectionTitle}`}
          >
            History
          </h2>
          <ol className={styles.timeline}>
            {history.map((item) => (
              <li key={item.id} className={styles.timelineItem}>
                <span className={styles.timelineIcon}>
                  <svg
                    className={styles.timelineIconSvg}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineHeader}>
                    {item.event !== "Initial State" && (
                      <button
                        onClick={() => handleRevert(item)}
                        title={`Revert to this state from ${formatTimestamp(
                          item.timestamp
                        )}`}
                        className={styles.revertButton}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={styles.revertIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 110 14H9a1 1 0 110-2h2a5 5 0 100-10H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                    {item.event}
                  </h3>
                  <time className={styles.timestamp}>
                    {formatTimestamp(item.timestamp)}
                  </time>
                  {item.todoText && (
                    <p className={styles.todoTextDisplay}>
                      &quot;{item.todoText}&quot;
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
