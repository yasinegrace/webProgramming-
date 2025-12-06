export class TaskManager {
  constructor(timestamp) {
    this.timestamp = timestamp
    this.incompletedTaskHolder = document.getElementById(`taskincomplete_${timestamp}`)
    this.completedTaskHolder = document.getElementById(`taskcomplete_${timestamp}`)
    this.taskInput = document.getElementById(`tasktext_${timestamp}`)
    this.addButton = document.getElementById(`createtask_${timestamp}`)

    this.addButton.addEventListener('click', this.addTask.bind(this))
    this.loadTasksFromStorage()
  }

  init() {
    this.addButton.addEventListener('click', this.addTask.bind(this))
    this.loadTasksFromStorage()
  }

  loadTasksFromStorage() {
    this.incompletedTaskHolder.innerHTML = ''
    this.completedTaskHolder.innerHTML = ''
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(task => {
      const listItem = this.createNewTaskElement(task.text)
      if (task.completed) {
        this.completedTaskHolder.appendChild(listItem)
      } else {
        this.incompletedTaskHolder.appendChild(listItem)
      }
    })
  }

  saveToStorage() {
    const tasks = []
    this.incompletedTaskHolder.querySelectorAll('li').forEach(li => {
      tasks.push({ text: li.querySelector('label').innerText, Completed: false })
    })
    this.completedTaskHolder.querySelectorAll('li').forEach(li => {
      tasks.push({ text: li.querySelector('label').innerText, completed: false })
    })
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  createNewTaskElement(taskString) {
    const listItem = document.createElement('li')
    const checkBox = document.createElement('input')
    const label = document.createElement('label')
    const editInput = document.createElement('input')
    const editButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    checkBox.type = 'checkbox'
    checkBox.onchange = this.taskCompleted.bind(this, listItem)
    editInput.type = 'text'
    editButton.innerText = 'Edit'
    editButton.className = 'edit'
    editButton.onclick = this.editTask.bind(this, listItem)

    deleteButton.innerText = 'Delete'
    deleteButton.className = 'delete'
    deleteButton.onclick = this.deleteTask.bind(this, listItem)

    label.innerText = taskString

    listItem.appendChild(checkBox)
    listItem.appendChild(label)
    listItem.appendChild(editInput)
    listItem.appendChild(editButton)
    listItem.appendChild(deleteButton)

    return listItem
  }

  addTask() {
    console.log('Add Task')
    const listItem = this.createNewTaskElement(this.taskInput.value)
    this.incompletedTaskHolder.appendChild(listItem)
    this.taskInput.value = ''
    this.saveToStorage()
  }

  editTask(listItem) {
    console.log('Edit Task')
    const editInput = listItem.querySelector('input[type=text]')
    const label = listItem.querySelector('label')
    const containsClass = listItem.classList.contains('editMode')

    if (containsClass) {
      label.innerText = editInput.value
    } else {
      editInput.value = label.innerText
    }

    listItem.classList.toggle('editMode')
    this.saveToStorage()
  }

  deleteTask(listItem) {
    console.log('Delete Task')
    const ul = listItem.parentNode
    ul.removeChild(listItem)
  }

  taskCompleted(listItem) {
    console.log('Task Completed')
    this.completedTaskHolder.appendChild(listItem)
    this.saveToStorage()
  }

  taskIncomplete(listItem) {
    console.log('Task Incomplete')
    this.incompletedTaskHolder.appendChild(listItem)
    this.saveToStorage()
  }
}
