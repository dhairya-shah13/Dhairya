import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import { getTasks, createTask, updateTask, deleteTask } from '../api'
import { useToast } from '../components/Toast'

const emptyForm = { title: '', description: '', priority: 'medium' }

const PRIORITIES = ['low', 'medium', 'high']

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create form state
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)

  // Per-operation busy flags (disable buttons while a request is in flight)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const showToast = useToast()

  const fetchTasks = () => {
    setLoading(true)
    setError(null)
    getTasks()
      .then((data) => {
        setTasks(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message || 'Failed to load tasks')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEditFormChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Create: optimistically show the task, replace it with the server response on
  // success, or roll it back with an error toast if the POST fails.
  const handleCreate = (e) => {
    e.preventDefault()
    const newTask = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
    }
    if (!newTask.title) return

    const tempId = `temp-${Date.now()}`
    const tempTask = { ...newTask, _id: tempId, completed: false, createdAt: new Date().toISOString() }

    setSubmitting(true)
    setTasks((prev) => [tempTask, ...prev])
    createTask(newTask)
      .then((created) => {
        setTasks((prev) => prev.map((t) => (t._id === tempId ? created : t)))
        setForm(emptyForm)
        showToast('Task created successfully')
      })
      .catch((err) => {
        setTasks((prev) => prev.filter((t) => t._id !== tempId))
        showToast(err.message || 'Failed to create task', 'error')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const startEditing = (task) => {
    setEditingId(task._id)
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
    })
  }

  // Update: only touch local state once the backend confirms, so the UI always
  // reflects the real server state.
  const handleUpdate = (id, e) => {
    e.preventDefault()
    const updatedTask = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      priority: editForm.priority,
    }
    if (!updatedTask.title) return

    setUpdatingId(id)
    updateTask(id, updatedTask)
      .then((saved) => {
        setTasks((prev) => prev.map((t) => (t._id === id ? saved : t)))
        setEditingId(null)
        showToast('Task updated successfully')
      })
      .catch((err) => {
        showToast(err.message || 'Failed to update task', 'error')
      })
      .finally(() => {
        setUpdatingId(null)
      })
  }

  const handleToggleCompleted = (task) => {
    const id = task._id
    setUpdatingId(id)
    updateTask(id, { completed: !task.completed })
      .then((saved) => {
        setTasks((prev) => prev.map((t) => (t._id === id ? saved : t)))
        showToast('Task updated successfully')
      })
      .catch((err) => {
        showToast(err.message || 'Failed to update task', 'error')
      })
      .finally(() => {
        setUpdatingId(null)
      })
  }

  // Delete: confirm first (Practical 6 supplementary requirement).
  const handleDelete = (task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`)
    if (!confirmed) return

    setDeletingId(task._id)
    deleteTask(task._id)
      .then(() => {
        setTasks((prev) => prev.filter((t) => t._id !== task._id))
        if (editingId === task._id) setEditingId(null)
        showToast('Task deleted successfully')
      })
      .catch((err) => {
        showToast(err.message || 'Failed to delete task', 'error')
      })
      .finally(() => {
        setDeletingId(null)
      })
  }

  const busy = (id) => updatingId === id || deletingId === id

  return (
    <section className="page">
      <h2>Task Manager</h2>
      <p>
        Create, view, update and delete tasks. Everything is saved to MongoDB
        through the Express API, so your tasks survive a browser refresh.
      </p>

      {/* Initial load */}
      {loading && <Spinner text="Loading tasks..." />}

      {/* Initial load error */}
      {!loading && error && (
        <ErrorMessage title="Unable to Load Tasks" message={error} onRetry={fetchTasks} />
      )}

      {/* Success state */}
      {!loading && !error && (
        <>
          {/* Create form */}
          <form className="task-form" onSubmit={handleCreate}>
            <div className="task-form-row">
              <input
                type="text"
                name="title"
                className="task-input"
                placeholder="Task title (required)"
                value={form.title}
                onChange={handleFormChange}
                required
              />
              <select
                name="priority"
                className="task-select"
                value={form.priority}
                onChange={handleFormChange}
                aria-label="Priority"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : '+ Add Task'}
              </button>
            </div>
            <textarea
              name="description"
              className="task-textarea"
              placeholder="Task description (optional)"
              value={form.description}
              onChange={handleFormChange}
              rows="2"
            />
          </form>

          {/* Task list */}
          {tasks.length === 0 ? (
            <p className="no-results">
              No tasks yet. Create your first task above — it will be stored in MongoDB.
            </p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className={`task-item ${task.completed ? 'task-completed' : ''}`}>
                  {editingId === task._id ? (
                    <form className="task-edit-form" onSubmit={(e) => handleUpdate(task._id, e)}>
                      <input
                        type="text"
                        name="title"
                        className="task-input"
                        value={editForm.title}
                        onChange={handleEditFormChange}
                        required
                        aria-label="Edit task title"
                      />
                      <textarea
                        name="description"
                        className="task-textarea"
                        value={editForm.description}
                        onChange={handleEditFormChange}
                        rows="2"
                        aria-label="Edit task description"
                      />
                      <div className="task-edit-row">
                        <select
                          name="priority"
                          className="task-select"
                          value={editForm.priority}
                          onChange={handleEditFormChange}
                          aria-label="Edit priority"
                        >
                          {PRIORITIES.map((p) => (
                            <option key={p} value={p}>
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </option>
                          ))}
                        </select>
                        <div className="task-actions">
                          <button type="submit" className="btn btn-primary" disabled={updatingId === task._id}>
                            {updatingId === task._id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setEditingId(null)}
                            disabled={updatingId === task._id}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="task-header">
                        <label className="task-complete-toggle">
                          <input
                            type="checkbox"
                            checked={!!task.completed}
                            onChange={() => handleToggleCompleted(task)}
                            disabled={busy(task._id)}
                            aria-label={`Mark "${task.title}" as ${task.completed ? 'not completed' : 'completed'}`}
                          />
                          <span className="task-title">{task.title}</span>
                        </label>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && <p className="task-description">{task.description}</p>}
                      <div className="task-footer-meta">
                        <span>
                          📅 Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        <div className="task-actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => startEditing(task)}
                            disabled={busy(task._id)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(task)}
                            disabled={busy(task._id)}
                          >
                            {deletingId === task._id ? 'Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default Tasks
