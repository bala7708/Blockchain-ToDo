// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TodoList
 * @dev Simple To-Do List on Blockchain
 * @notice Each user has their own private task list
 */
contract TodoList {
    
    struct Task {
        uint256 id;
        string content;
        bool completed;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    // User address => array of tasks
    mapping(address => Task[]) private userTasks;
    
    // User address => task counter
    mapping(address => uint256) private taskCounter;
    
    event TaskCreated(
        address indexed user,
        uint256 indexed taskId,
        string content,
        uint256 timestamp
    );
    
    event TaskToggled(
        address indexed user,
        uint256 indexed taskIndex,
        bool completed,
        uint256 timestamp
    );
    
    event TaskUpdated(
        address indexed user,
        uint256 indexed taskIndex,
        string newContent,
        uint256 timestamp
    );
    
    event TaskDeleted(
        address indexed user,
        uint256 indexed taskId,
        uint256 timestamp
    );
    
    /**
     * @dev Create a new task
     * @param _content The task description
     */
    function createTask(string memory _content) external {
        require(bytes(_content).length > 0, "Task content cannot be empty");
        require(bytes(_content).length <= 500, "Task content too long");
        
        uint256 taskId = taskCounter[msg.sender];
        
        Task memory newTask = Task({
            id: taskId,
            content: _content,
            completed: false,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        userTasks[msg.sender].push(newTask);
        taskCounter[msg.sender] = taskId + 1;
        
        emit TaskCreated(msg.sender, taskId, _content, block.timestamp);
    }
    
    /**
     * @dev Toggle task completion status
     * @param _taskIndex Index of task in user's array
     */
    function toggleTask(uint256 _taskIndex) external {
        require(_taskIndex < userTasks[msg.sender].length, "Task does not exist");
        
        Task storage task = userTasks[msg.sender][_taskIndex];
        task.completed = !task.completed;
        
        if (task.completed) {
            task.completedAt = block.timestamp;
        } else {
            task.completedAt = 0;
        }
        
        emit TaskToggled(msg.sender, _taskIndex, task.completed, block.timestamp);
    }
    
    /**
     * @dev Update task content
     * @param _taskIndex Index of task
     * @param _newContent New task description
     */
    function updateTask(uint256 _taskIndex, string memory _newContent) external {
        require(_taskIndex < userTasks[msg.sender].length, "Task does not exist");
        require(bytes(_newContent).length > 0, "Task content cannot be empty");
        require(bytes(_newContent).length <= 500, "Task content too long");
        
        userTasks[msg.sender][_taskIndex].content = _newContent;
        
        emit TaskUpdated(msg.sender, _taskIndex, _newContent, block.timestamp);
    }
    
    /**
     * @dev Delete a task
     * @param _taskIndex Index of task to delete
     */
    function deleteTask(uint256 _taskIndex) external {
        require(_taskIndex < userTasks[msg.sender].length, "Task does not exist");
        
        uint256 taskId = userTasks[msg.sender][_taskIndex].id;
        
        // Move last element to deleted position and pop
        uint256 lastIndex = userTasks[msg.sender].length - 1;
        if (_taskIndex != lastIndex) {
            userTasks[msg.sender][_taskIndex] = userTasks[msg.sender][lastIndex];
        }
        userTasks[msg.sender].pop();
        
        emit TaskDeleted(msg.sender, taskId, block.timestamp);
    }
    
    /**
     * @dev Get all tasks for caller
     * @return Array of all user's tasks
     */
    function getAllTasks() external view returns (Task[] memory) {
        return userTasks[msg.sender];
    }
    
    /**
     * @dev Get specific task
     * @param _taskIndex Index of task
     * @return Task details
     */
    function getTask(uint256 _taskIndex) external view returns (Task memory) {
        require(_taskIndex < userTasks[msg.sender].length, "Task does not exist");
        return userTasks[msg.sender][_taskIndex];
    }
    
    /**
     * @dev Get total task count
     * @return Number of tasks
     */
    function getTaskCount() external view returns (uint256) {
        return userTasks[msg.sender].length;
    }
    
    /**
     * @dev Get completed task count
     * @return Number of completed tasks
     */
    function getCompletedCount() external view returns (uint256) {
        uint256 count = 0;
        Task[] memory tasks = userTasks[msg.sender];
        
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].completed) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * @dev Get pending task count
     * @return Number of pending tasks
     */
    function getPendingCount() external view returns (uint256) {
        uint256 count = 0;
        Task[] memory tasks = userTasks[msg.sender];
        
        for (uint256 i = 0; i < tasks.length; i++) {
            if (!tasks[i].completed) {
                count++;
            }
        }
        
        return count;
    }
}
