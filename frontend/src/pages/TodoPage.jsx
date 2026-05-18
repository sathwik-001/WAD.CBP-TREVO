import { useEffect, useState } from 'react';
import AuthenticatedNavbar from '../components/AuthenticatedNavbar.jsx';
import AppFooter from '../components/AppFooter.jsx';

const TODO_STORAGE_KEY = 'trevo.todo.board';

const initialTaskForm = {
  title: '',
  phase: 'Planning',
  priority: 'Medium',
  dueDate: '',
  note: '',
};

const quickStartTasks = [
  {
    title: 'Lock travel dates',
    phase: 'Planning',
    priority: 'High',
    note: 'Choose the best window for the trip and confirm who is traveling.',
  },
  {
    title: 'Compare stay options',
    phase: 'Booking',
    priority: 'Medium',
    note: 'Shortlist hotels or stays that fit the trip vibe and budget.',
  },
  {
    title: 'Build a packing checklist',
    phase: 'Packing',
    priority: 'Low',
    note: 'List travel essentials, weather-based outfits, and important documents.',
  },
];

const createTaskId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatDueDate = (value) => {
  if (!value) {
    return 'No target date';
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function TodoPage() {
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [tasks, setTasks] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const storedTasks = window.localStorage.getItem(TODO_STORAGE_KEY);
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch {
      return [];
    }
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const focusState = activeTasks.some((task) => task.priority === 'High')
    ? 'High Priority'
    : activeTasks.length > 0
      ? 'In Progress'
      : 'All Clear';

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));

    if (feedback) {
      setFeedback('');
    }
  };

  const addTask = (taskData) => {
    setTasks((prev) => [
      {
        id: createTaskId(),
        title: taskData.title.trim(),
        phase: taskData.phase,
        priority: taskData.priority,
        dueDate: taskData.dueDate || '',
        note: taskData.note.trim(),
        completed: false,
      },
      ...prev,
    ]);
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      setFeedback('Add a task title so it can appear on your board.');
      return;
    }

    addTask(taskForm);
    setTaskForm(initialTaskForm);
    setFeedback('Task added to your travel board.');
  };

  const handleQuickAdd = (template) => {
    addTask({
      ...template,
      dueDate: '',
    });
    setFeedback(`Added "${template.title}" to your board.`);
  };

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="todo-page">
      <AuthenticatedNavbar />

      <main className="todo-shell">
        <div className="container">
          <section className="todo-card todo-hero p-4 p-lg-5 mb-4">
            <div className="row g-4 align-items-center">
              <div className="col-lg-7">
                <span className="todo-badge">Travel Todo Hub</span>
                <h1 className="display-6 fw-bold mb-3">Turn scattered trip plans into a clear action board.</h1>
                <p className="text-white-50 mb-4">
                  Use this page to track bookings, packing, budgeting, and trip prep in one place.
                  Trevo keeps the excitement of travel while making the planning feel more manageable.
                </p>

                <div className="todo-progress-card">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                    <span>Board progress</span>
                    <strong>{progress}% complete</strong>
                  </div>
                  <div className="progress todo-progress">
                    <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="todo-stat-grid">
                  <div className="todo-stat">
                    <span>Total Tasks</span>
                    <strong>{tasks.length}</strong>
                  </div>
                  <div className="todo-stat">
                    <span>Open Tasks</span>
                    <strong>{activeTasks.length}</strong>
                  </div>
                  <div className="todo-stat">
                    <span>Completed</span>
                    <strong>{completedTasks.length}</strong>
                  </div>
                  <div className="todo-stat">
                    <span>Focus State</span>
                    <strong>{focusState}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="row g-4">
            <div className="col-lg-5">
              <section className="todo-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Add a task</h2>
                    <p className="text-white-50 mb-0">Capture the next thing that moves your trip forward.</p>
                  </div>
                  <span className="todo-section-chip">New Entry</span>
                </div>

                <form className="todo-form" onSubmit={handleTaskSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="todo-title">
                      Task title
                    </label>
                    <input
                      id="todo-title"
                      className="form-control"
                      name="title"
                      placeholder="Example: Reserve a stay near the beach"
                      value={taskForm.title}
                      onChange={handleTaskChange}
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="todo-phase">
                        Phase
                      </label>
                      <select
                        id="todo-phase"
                        className="form-select"
                        name="phase"
                        value={taskForm.phase}
                        onChange={handleTaskChange}
                      >
                        <option>Planning</option>
                        <option>Booking</option>
                        <option>Packing</option>
                        <option>Budget</option>
                        <option>Experience</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="todo-priority">
                        Priority
                      </label>
                      <select
                        id="todo-priority"
                        className="form-select"
                        name="priority"
                        value={taskForm.priority}
                        onChange={handleTaskChange}
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label" htmlFor="todo-due-date">
                      Target date
                    </label>
                    <input
                      id="todo-due-date"
                      className="form-control"
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleTaskChange}
                    />
                  </div>

                  <div className="mt-3">
                    <label className="form-label" htmlFor="todo-note">
                      Notes
                    </label>
                    <textarea
                      id="todo-note"
                      className="form-control"
                      name="note"
                      rows="4"
                      placeholder="Keep reminders, budget notes, or booking details here."
                      value={taskForm.note}
                      onChange={handleTaskChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-orange rounded-pill px-4 mt-4">
                    <i className="bi bi-plus-circle me-2" />
                    Add to Board
                  </button>
                </form>

                {feedback ? <p className="todo-feedback mb-0 mt-3">{feedback}</p> : null}
              </section>

              <section className="todo-card p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Quick start ideas</h2>
                    <p className="text-white-50 mb-0">One click is enough to drop a useful travel task into the board.</p>
                  </div>
                  <span className="todo-section-chip">Starter Tasks</span>
                </div>

                <div className="todo-template-grid">
                  {quickStartTasks.map((template) => (
                    <button
                      key={template.title}
                      type="button"
                      className="todo-template-btn"
                      onClick={() => handleQuickAdd(template)}
                    >
                      <strong>{template.title}</strong>
                      <span>
                        {template.phase} • {template.priority}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="col-lg-7">
              <section className="todo-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <h2 className="h4 mb-1">Active tasks</h2>
                    <p className="text-white-50 mb-0">These are the items still moving your travel plan forward.</p>
                  </div>
                  <span className="todo-section-chip">{activeTasks.length} Open</span>
                </div>

                {activeTasks.length > 0 ? (
                  <div className="todo-list">
                    {activeTasks.map((task) => (
                      <article key={task.id} className="todo-item">
                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
                          <div>
                            <div className="todo-meta-row">
                              <span className={`todo-priority todo-priority-${task.priority.toLowerCase()}`}>
                                {task.priority}
                              </span>
                              <span className="todo-phase-pill">{task.phase}</span>
                            </div>
                            <h3>{task.title}</h3>
                            {task.note ? <p className="todo-note">{task.note}</p> : null}
                          </div>

                          <span className="todo-due-pill">{formatDueDate(task.dueDate)}</span>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-orange rounded-pill px-4"
                            onClick={() => toggleTask(task.id)}
                          >
                            <i className="bi bi-check2-circle me-2" />
                            Mark Done
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-light rounded-pill px-4"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="todo-empty-state">
                    <div className="todo-empty-icon">
                      <i className="bi bi-list-check" />
                    </div>
                    <h3 className="h5 fw-semibold mb-2">No active tasks yet</h3>
                    <p className="text-white-50 mb-0">
                      Add your first travel task or use one of the quick start ideas to begin.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          <section className="todo-card p-4 mt-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
              <div>
                <h2 className="h4 mb-1">Completed tasks</h2>
                <p className="text-white-50 mb-0">Finished tasks stay here so you can track planning progress.</p>
              </div>
              <span className="todo-section-chip">{completedTasks.length} Done</span>
            </div>

            {completedTasks.length > 0 ? (
              <div className="todo-list">
                {completedTasks.map((task) => (
                  <article key={task.id} className="todo-item todo-item-complete">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
                      <div>
                        <div className="todo-meta-row">
                          <span className={`todo-priority todo-priority-${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                          <span className="todo-phase-pill">{task.phase}</span>
                        </div>
                        <h3>{task.title}</h3>
                        {task.note ? <p className="todo-note">{task.note}</p> : null}
                      </div>

                      <span className="todo-due-pill">{formatDueDate(task.dueDate)}</span>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-light rounded-pill px-4"
                        onClick={() => toggleTask(task.id)}
                      >
                        Move Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-light rounded-pill px-4"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="todo-empty-state">
                <div className="todo-empty-icon">
                  <i className="bi bi-check2-square" />
                </div>
                <h3 className="h5 fw-semibold mb-2">Nothing completed yet</h3>
                <p className="text-white-50 mb-0">
                  When you mark a task as done, it will appear here automatically.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default TodoPage;
