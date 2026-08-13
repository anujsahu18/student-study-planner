const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string - override with MONGO_URI env var in production
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-planner';

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Simple Task model for demonstration
const taskSchema = new mongoose.Schema({
    subject: String,
    task: String,
    date: String,
    createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

// Basic API to list and create tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const t = new Task(req.body);
        await t.save();
        res.status(201).json(t);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});

// Update a task (partial update)
app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Task not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const removed = await Task.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete task' });
    }
});

app.get('/dbcheck', (req, res) => {
    const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
    res.json({ mongoState: state });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});