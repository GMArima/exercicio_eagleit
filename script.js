let taskList = [];

const taskListStored = localStorage.getItem("taskList");

if (taskListStored) {
  taskList = JSON.parse(taskListStored);
}

function addTask(name, description, completed = false) {
  const task = {
    name,
    description,
    completed,
  };

  taskList.push(task);
}

function removeTask(index) {
  taskList.splice(index, 1);
}

function listTasks(includedTasks) {
  const taskListElement = document.getElementById("task-list");

  taskListElement.innerHTML = "";

  for (let i = 0; i < taskList.length; i++) {
    const task = taskList[i];

    if (includedTasks) {
      const yes = includedTasks.find((t) => task.name == t.name);

      if (yes) {
        const taskElement = document.createElement("button");
        taskElement.classList.add("task");
        taskElement.id = `task-${i}`;

        taskElement.innerHTML = `<div class="layer"></div>
    <p class="task-completed ${task.completed ? " " : "pending"}">${
          task.completed ? "Concluída" : "Pendente"
        }</p>
    <p class="task-name">${task.name}</p>
    <p class="task-description">${task.description}</p>
    `;

        taskListElement.appendChild(taskElement);
      }
    } else {
      const taskElement = document.createElement("button");
      taskElement.classList.add("task");
      taskElement.id = `task-${i}`;

      taskElement.innerHTML = `<div class="layer"></div>
    <p class="task-completed ${task.completed ? " " : "pending"}">${
        task.completed ? "Concluída" : "Pendente"
      }</p>
    <p class="task-name">${task.name}</p>
    <p class="task-description">${task.description}</p>
    `;

      taskListElement.appendChild(taskElement);
    }
  }

  // Task list popups
  const popupTask = document.getElementById("popup-task");
  const closePopupButtons = document.querySelectorAll(".close-popup");
  const bgPopups = document.querySelectorAll(".popup-bg");
  const tasksElements = document.querySelectorAll(".task");

  function loadTask(taskId) {
    const popupTaskHTML = popupTask.innerHTML;
    popupTask.innerHTML = "";
    popupTask.innerHTML = popupTaskHTML;

    const closePopupButtons = document.querySelectorAll(".close-popup");
    const bgPopups = document.querySelectorAll(".popup-bg");
    const tasksElements = document.querySelectorAll(".task");

    const nameTask = document.getElementById("name-task");
    const descTask = document.getElementById("desc-task");
    const statusTask = document.getElementById("status-task");
    const task = taskList[taskId];

    nameTask.textContent = task.name;
    descTask.textContent = task.description;
    statusTask.textContent = `${task.completed ? "Concluída" : "Pendente"}`;

    if (task.completed) {
      statusTask.classList.remove("pending");
    } else {
      statusTask.classList.add("pending");
    }

    const taskRemove = document.getElementById("task-remove");
    const taskCompleted = document.getElementById("task-completed");
    const taskEdit = document.getElementById("task-edit");

    taskRemove.addEventListener("click", () => {
      removeTask(taskId);
      popupTask.classList.add("hide");
      listTasks();
    });

    taskCompleted.addEventListener("click", () => {
      if (taskList[taskId].completed) {
        taskList[taskId].completed = false;
        console.log("Olá! Event listener: ", task.completed);
        popupTask.classList.add("hide");
      } else {
        taskList[taskId].completed = true;
        console.log("Vish! Event listener: ", task.completed);
        popupTask.classList.add("hide");
      }

      listTasks();
    });

    taskEdit.addEventListener("click", () => {
      const popupEditTask = document.getElementById("popup-edit-task");

      const taskEditHTML = popupEditTask.innerHTML;
      popupEditTask.innerHTML = "";
      popupEditTask.innerHTML = taskEditHTML;

      popupEditTask.classList.remove("hide");

      const title = popupEditTask.querySelector("input");
      const desc = popupEditTask.querySelector("textarea");
      const cancel = popupEditTask.querySelector("#cancel-edit");
      const confirm = popupEditTask.querySelector("#confirm-edit");

      title.value = task.name;
      desc.value = task.description;

      cancel.addEventListener("click", () => {
        popupEditTask.classList.add("hide");
      });

      confirm.addEventListener("click", () => {
        popupEditTask.classList.add("hide");

        taskList[taskId].name = title.value;
        taskList[taskId].description = desc.value;

        loadTask(taskId);

        listTasks();
      });
    });

    closePopupButtons.forEach((element) => {
      closeTask(element);
    });

    bgPopups.forEach((element) => {
      closeTask(element);
    });
  }

  function openTask(element) {
    const taskId = Number(element.id.replace("task-", " "));

    element.addEventListener("click", () => {
      popupTask.classList.remove("hide");

      loadTask(taskId);
    });
  }

  tasksElements.forEach((element) => {
    openTask(element);
  });

  function closeTask(element) {
    element.addEventListener("click", () => {
      popupTask.classList.add("hide");
    });
  }

  closePopupButtons.forEach((element) => {
    closeTask(element);
  });

  bgPopups.forEach((element) => {
    closeTask(element);
  });

  loadPendingTasks();
}

const popupAddTask = document.getElementById("popup-add-task");
const cancelAdd = document.getElementById("cancel-add");
const addTaskButton = document.getElementById("add-task");
const openAddTaskButton = document.getElementById("open-add-task");
const addTaskInput = popupAddTask.querySelector("input");
const addTaskTextarea = popupAddTask.querySelector("textarea");

openAddTaskButton.addEventListener("click", () => {
  popupAddTask.classList.remove("hide");

  addTaskInput.value = "";
  addTaskTextarea.value = "";
});

cancelAdd.addEventListener("click", () => {
  popupAddTask.classList.add("hide");
});

addTaskButton.addEventListener("click", () => {
  const values = [addTaskInput.value, addTaskTextarea.value];

  const [name, desc] = values;

  if (!name) {
    alert("Insira um nome para sua tarefa!");
    return;
  }

  popupAddTask.classList.add("hide");
  addTask(name, desc);
  listTasks();
});

function findTaskByTitle(values) {
  const tasksFind = taskList.map((t) => {
    if (t.name.toLowerCase().includes(values.toLowerCase())) {
      return t;
    } else {
      return null;
    }
  });

  console.log(tasksFind);

  const tasksFindWithoutNull = tasksFind.filter((t) => t !== null);

  console.log(tasksFindWithoutNull);

  return tasksFindWithoutNull;
}

const searchInput = document.getElementById("search-task");

searchInput.addEventListener("input", () => {
  const tasksResult = findTaskByTitle(searchInput.value);

  listTasks(tasksResult);
});

const loadingPopup = document.getElementById("popup-loading");
const close = loadingPopup.querySelector("button#close-loading");

close.addEventListener("click", () => {
  loadingPopup.classList.add("hide");
});

function openLoading(type, array) {
  const h2 = loadingPopup.querySelector("h2");
  const img = loadingPopup.querySelector("img");
  close.classList.add("hide");

  loadingPopup.classList.remove("hide");

  if (type === "saving") {
    h2.textContent = "Salvando arquivos...";
    img.src = "loading.gif";

    setTimeout(() => {
      close.classList.remove("hide");
      img.src = "correct.png";
      h2.textContent = "Concluído!";

      localStorage.setItem("taskList", array);

      listTasks();
    }, 2000);
  }

  if (type === "loading") {
    h2.textContent = "Carregando arquivos...";
    img.src = "loading.gif";

    setTimeout(() => {
      close.classList.remove("hide");
      img.src = "correct.png";
      h2.textContent = "Concluído!";

      listTasks();
    }, 2000);
  }
}

const saveTasks = document.getElementById("save-tasks");

saveTasks.addEventListener("click", () => {
  const jsonStringifyed = JSON.stringify(taskList);

  openLoading("saving", jsonStringifyed);
});

function loadPendingTasks() {
  const pendingTasks = taskList.map((t) => {
    if (!t.completed) {
      return t;
    }
  });

  const numberOfPendingTasks = pendingTasks
    .map((task) => {
      if (task === undefined) {
        return 0;
      } else {
        return 1;
      }
    })
    .reduce((acc, value) => acc + value, 0);

  const numberTasks = document.getElementById("number-tasks");
  numberTasks.textContent = numberOfPendingTasks;
}

openLoading("loading");
