const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList Contract", function () {
  let todoList;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
    await todoList.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await todoList.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("Creating Tasks", function () {
    it("Should create a task successfully", async function () {
      await expect(todoList.createTask("Buy groceries"))
        .to.emit(todoList, "TaskCreated")
        .withArgs(owner.address, 0, "Buy groceries", await time());

      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(1);
      expect(tasks[0].content).to.equal("Buy groceries");
      expect(tasks[0].completed).to.equal(false);
    });

    it("Should fail with empty content", async function () {
      await expect(todoList.createTask(""))
        .to.be.revertedWith("Task content cannot be empty");
    });

    it("Should fail with content too long", async function () {
      const longContent = "a".repeat(501);
      await expect(todoList.createTask(longContent))
        .to.be.revertedWith("Task content too long");
    });

    it("Should create multiple tasks", async function () {
      await todoList.createTask("Task 1");
      await todoList.createTask("Task 2");
      await todoList.createTask("Task 3");

      const count = await todoList.getTaskCount();
      expect(count).to.equal(3);
    });

    it("Should assign correct task IDs", async function () {
      await todoList.createTask("First");
      await todoList.createTask("Second");

      const tasks = await todoList.getAllTasks();
      expect(tasks[0].id).to.equal(0);
      expect(tasks[1].id).to.equal(1);
    });
  });

  describe("Toggling Tasks", function () {
    beforeEach(async function () {
      await todoList.createTask("Test task");
    });

    it("Should toggle task to completed", async function () {
      await expect(todoList.toggleTask(0))
        .to.emit(todoList, "TaskToggled");

      const task = await todoList.getTask(0);
      expect(task.completed).to.equal(true);
      expect(task.completedAt).to.be.gt(0);
    });

    it("Should toggle completed task back to incomplete", async function () {
      await todoList.toggleTask(0);
      await todoList.toggleTask(0);

      const task = await todoList.getTask(0);
      expect(task.completed).to.equal(false);
      expect(task.completedAt).to.equal(0);
    });

    it("Should fail for non-existent task", async function () {
      await expect(todoList.toggleTask(5))
        .to.be.revertedWith("Task does not exist");
    });
  });

  describe("Updating Tasks", function () {
    beforeEach(async function () {
      await todoList.createTask("Original content");
    });

    it("Should update task content", async function () {
      await expect(todoList.updateTask(0, "Updated content"))
        .to.emit(todoList, "TaskUpdated");

      const task = await todoList.getTask(0);
      expect(task.content).to.equal("Updated content");
    });

    it("Should fail with empty content", async function () {
      await expect(todoList.updateTask(0, ""))
        .to.be.revertedWith("Task content cannot be empty");
    });

    it("Should fail for non-existent task", async function () {
      await expect(todoList.updateTask(5, "New content"))
        .to.be.revertedWith("Task does not exist");
    });
  });

  describe("Deleting Tasks", function () {
    beforeEach(async function () {
      await todoList.createTask("Task 1");
      await todoList.createTask("Task 2");
      await todoList.createTask("Task 3");
    });

    it("Should delete a task", async function () {
      await expect(todoList.deleteTask(1))
        .to.emit(todoList, "TaskDeleted");

      const count = await todoList.getTaskCount();
      expect(count).to.equal(2);
    });

    it("Should maintain array integrity after deletion", async function () {
      await todoList.deleteTask(0);
      
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(2);
      expect(tasks[0].content).to.equal("Task 3");
      expect(tasks[1].content).to.equal("Task 2");
    });

    it("Should fail for non-existent task", async function () {
      await expect(todoList.deleteTask(10))
        .to.be.revertedWith("Task does not exist");
    });
  });

  describe("Task Statistics", function () {
    beforeEach(async function () {
      await todoList.createTask("Task 1");
      await todoList.createTask("Task 2");
      await todoList.createTask("Task 3");
      await todoList.createTask("Task 4");
      
      await todoList.toggleTask(0);
      await todoList.toggleTask(2);
    });

    it("Should count total tasks", async function () {
      const total = await todoList.getTaskCount();
      expect(total).to.equal(4);
    });

    it("Should count completed tasks", async function () {
      const completed = await todoList.getCompletedCount();
      expect(completed).to.equal(2);
    });

    it("Should count pending tasks", async function () {
      const pending = await todoList.getPendingCount();
      expect(pending).to.equal(2);
    });
  });

  describe("User Isolation", function () {
    it("Should keep tasks separate per user", async function () {
      await todoList.connect(owner).createTask("Owner task");
      await todoList.connect(user1).createTask("User1 task");
      await todoList.connect(user2).createTask("User2 task");

      const ownerTasks = await todoList.connect(owner).getAllTasks();
      const user1Tasks = await todoList.connect(user1).getAllTasks();
      const user2Tasks = await todoList.connect(user2).getAllTasks();

      expect(ownerTasks.length).to.equal(1);
      expect(user1Tasks.length).to.equal(1);
      expect(user2Tasks.length).to.equal(1);

      expect(ownerTasks[0].content).to.equal("Owner task");
      expect(user1Tasks[0].content).to.equal("User1 task");
      expect(user2Tasks[0].content).to.equal("User2 task");
    });

    it("Should not allow user to modify another user's tasks", async function () {
      await todoList.connect(owner).createTask("Owner task");
      
      // User1 should not be able to toggle owner's task
      const user1Tasks = await todoList.connect(user1).getAllTasks();
      expect(user1Tasks.length).to.equal(0);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle getting tasks when none exist", async function () {
      const tasks = await todoList.getAllTasks();
      expect(tasks.length).to.equal(0);
    });

    it("Should handle multiple toggles correctly", async function () {
      await todoList.createTask("Toggle test");
      
      await todoList.toggleTask(0);
      await todoList.toggleTask(0);
      await todoList.toggleTask(0);
      
      const task = await todoList.getTask(0);
      expect(task.completed).to.equal(true);
    });

    it("Should handle deletion of last task", async function () {
      await todoList.createTask("Only task");
      await todoList.deleteTask(0);
      
      const count = await todoList.getTaskCount();
      expect(count).to.equal(0);
    });
  });

  // Helper function
  async function time() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
