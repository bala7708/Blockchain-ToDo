import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Minimal ABI - only the functions we need
const TODO_ABI = [
  "function createTask(string memory _content) external",
  "function toggleTask(uint256 _taskIndex) external",
  "function updateTask(uint256 _taskIndex, string memory _newContent) external",
  "function deleteTask(uint256 _taskIndex) external",
  "function getAllTasks() external view returns (tuple(uint256 id, string content, bool completed, uint256 createdAt, uint256 completedAt)[])",
  "function getTaskCount() external view returns (uint256)",
  "function getCompletedCount() external view returns (uint256)",
  "function getPendingCount() external view returns (uint256)"
];

// ⚠️ REPLACE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to use this app.');
    }
  }, []);

  // Connect Wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const todoContract = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, signer);
      
      setAccount(accounts[0]);
      setContract(todoContract);
      console.log('✅ Wallet connected:', accounts[0]);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Tasks
  const loadTasks = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      const taskList = await contract.getAllTasks();
      setTasks(taskList);
      
      const total = await contract.getTaskCount();
      const completed = await contract.getCompletedCount();
      const pending = await contract.getPendingCount();
      
      setStats({
        total: Number(total),
        completed: Number(completed),
        pending: Number(pending)
      });
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!contract || !newTask.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.createTask(newTask);
      console.log('📝 Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('✅ Task created!');
      
      setNewTask('');
      await loadTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Toggle Task
  const handleToggleTask = async (index) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.toggleTask(index);
      await tx.wait();
      console.log('✅ Task toggled!');
      
      await loadTasks();
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Failed to toggle task: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const handleUpdateTask = async (index) => {
    if (!contract || !editContent.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.updateTask(index, editContent);
      await tx.wait();
      console.log('✅ Task updated!');
      
      setEditingIndex(null);
      setEditContent('');
      await loadTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async (index) => {
    if (!contract) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.deleteTask(index);
      await tx.wait();
      console.log('✅ Task deleted!');
      
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task: ' + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Start Edit
  const startEdit = (index, currentContent) => {
    setEditingIndex(index);
    setEditContent(currentContent);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditContent('');
  };

  // Load tasks when contract is available
  useEffect(() => {
    if (contract) {
      loadTasks();
    }
  }, [contract]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          window.location.reload();
        } else {
          setAccount('');
          setContract(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>📝 Blockchain To-Do List</h1>
          <p className="subtitle">Decentralized task management on Ethereum</p>
          
          {!account ? (
            <button 
              onClick={connectWallet} 
              className="connect-btn"
              disabled={loading}
            >
              {loading ? '⏳ Connecting...' : '🔗 Connect Wallet'}
            </button>
          ) : (
            <div className="account-info">
              <span className="account-badge">
                {account.substring(0, 6)}...{account.substring(38)}
              </span>
            </div>
          )}
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        {account && (
          <>
            {/* Statistics */}
            <div className="stats">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card completed">
                <div className="stat-number">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleCreateTask} className="add-task-form">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="task-input"
                maxLength="500"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="add-btn" 
                disabled={loading || !newTask.trim()}
              >
                {loading ? '⏳ Adding...' : '➕ Add Task'}
              </button>
            </form>

            {/* Task List */}
            <div className="task-list">
              {loading && tasks.length === 0 ? (
                <div className="loading">⏳ Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="empty-state">
                  <p>🎉 No tasks yet! Add your first task above.</p>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div 
                    key={`${task.id}-${index}`} 
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                  >
                    <div className="task-checkbox">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(index)}
                        disabled={loading}
                      />
                    </div>
                    
                    {editingIndex === index ? (
                      <div className="task-edit">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="edit-input"
                          maxLength="500"
                        />
                        <div className="edit-actions">
                          <button 
                            onClick={() => handleUpdateTask(index)}
                            className="save-btn"
                            disabled={loading || !editContent.trim()}
                          >
                            💾 Save
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="cancel-btn"
                            disabled={loading}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-content">
                          <span className="task-text">{task.content}</span>
                          <span className="task-date">
                            {new Date(Number(task.createdAt) * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="task-actions">
                          <button
                            onClick={() => startEdit(index, task.content)}
                            className="edit-btn"
                            disabled={loading}
                            title="Edit task"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteTask(index)}
                            className="delete-btn"
                            disabled={loading}
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <footer className="footer">
          <p>Built with ❤️ on Ethereum Blockchain</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
