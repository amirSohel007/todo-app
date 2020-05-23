const getDate = document.getElementById("get-day");
const todoList = document.querySelector(".todo-list");
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.querySelector(".add-btn");

const allTodoList = [];
let id = 0;

const uncheck = "fa-circle-o";
const check = "fa-check-circle";

//set localStroge for first time
function initializeStroge() {
  localStorage.getItem("todos") == null
    ? localStorage.setItem("todos", JSON.stringify(allTodoList))
    : "";
}

//Get current Day
const date = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const completDate = date.toLocaleString("en-IN", options);
getDate.innerText = completDate;

todoInput.addEventListener("keypress", addTodoOnSubmit);
addTodoBtn.addEventListener("click", addTodoOnClick);
todoList.addEventListener("click", changeTodoStatus);

//update todos in localStroge
function updateLocalStroge(todo) {
  localStorage.setItem("todos", JSON.stringify(todo));
}

function addToDo(todo, id, compleat) {
  if (todo) {
    const position = "afterbegin";
    const todoItem = `<li id=${id} class="todo-item mb-3">
              <i class="fa mark ${
                compleat ? "fa-check-circle" : "fa-circle-o"
              }"></i>
              <p class="content ${compleat ? "done" : ""}">${todo}</p>
              <i class="fa fa-trash-o"></i>
              </li>`;
    todoList.insertAdjacentHTML(position, todoItem);
    allTodoList.push({ id: id, text: todo, compleat: compleat });
    updateLocalStroge(allTodoList);
  }
}

function addNewTodo() {
  addToDo(todoInput.value, id, false);
  todoInput.value = "";
  id++;
}

//add todo on submit
function addTodoOnSubmit(e) {
  e.keyCode === 13 ? addNewTodo() : "";
}

//add todo on click
function addTodoOnClick() {
  addNewTodo();
}

//get all todos on page load
function getAllTodos() {
  let allTodos = JSON.parse(localStorage.getItem("todos"));
  allTodos.forEach((todo) => addToDo(todo.text, id++, todo.compleat));
}

function trashTodos(target, parentId, getAllTodos) {
  if (target.classList.contains("fa-trash-o")) {
    target.parentElement.remove();
    let nonDeletedTodos = getAllTodos.filter((todo) => todo.id != parentId);
    updateLocalStroge(nonDeletedTodos);
  }
}

function changeTodoStatus(e) {
  const getAllTodos = JSON.parse(localStorage.getItem("todos"));
  const target = e.target;
  const parentId = parseInt(e.target.parentElement.id);
  trashTodos(target, parentId, getAllTodos);
  checkCompletTodos(target, parentId, getAllTodos);
}

function checkCompletTodos(target, parentId, getAllTodos) {
  const classes = target.classList;
  if (classes.contains("mark")) {
    target.nextElementSibling.classList.toggle("done"); //toggle done class on todo text
    if (classes.contains(uncheck)) {
      classes.remove(uncheck);
      classes.add(check);
    } else {
      classes.remove(check);
      classes.add(uncheck);
    }

    getAllTodos.forEach((todo) => {
      todo.id === parentId ? (todo.compleat = !todo.compleat) : "";
      updateLocalStroge(getAllTodos);
    });
  }
}

initializeStroge();
getAllTodos();
