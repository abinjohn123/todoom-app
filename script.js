'use strict';

const taskContainer = document.querySelector('.tasks-container');
const taskInputForm = document.querySelector('.new-task-section');
const taskInputField = document.querySelector('.task-input');
const dateField = document.querySelector('.date');
const activeTasks = document.getElementsByClassName('task-entry');

// ######################
//   SET THE DATE
// ######################
function setDate() {
  const now = new Date();
  const locale = navigator.language || 'en-US';
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };

  const date = new Intl.DateTimeFormat(locale, options).format(now);
  dateField.textContent = date;
}

// ######################
//  NEW TASK
// ######################
function returnHTML(task) {
  return `<li class="task-entry">
        <button class="circle" type="button" data-button-type="taskComplete">
          <svg xmlns="http://www.w3.org/2000/svg" class="circle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" >
          </svg>
        </button>
        <p class="task">${task}</p>
        <button class="trash" data-button-type="taskDelete">
          <svg xmlns="http://www.w3.org/2000/svg" class="trash-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" >
</svg>
        </button>
      </li>`;
}

function taskInput(e) {
  e.preventDefault();

  const task = taskInputField.value.trim();
  taskInputField.value = '';

  if (task === '') return;

  const html = returnHTML(task);
  taskContainer.insertAdjacentHTML('beforeend', html);

  if (activeTasks.length >= 5) {
    placeholderSwitch('warning');
    taskInputField.classList.add('message');
    taskInputField.readOnly = true;
    taskInputField.blur();
    return;
  }
  taskInputField.focus();
}

// ###########################
//   MARK A TASK AS COMPLETE
// ###########################
function markTaskComplete() {
  this?.classList.toggle('complete');
}

// ######################
//   DELETE A TASK
// ######################
function deleteTask() {
  const taskEntry = this;

  if (!taskEntry) return;

  taskEntry.style.opacity = 0;
  setTimeout(function () {
    taskEntry.remove();
  }, 200);

  placeholderSwitch('normal');
  taskInputField.classList.remove('message');
  taskInputField.readOnly = false;
  taskInputField.focus();
}

// ##########################
//   KEYBOARD SHORTCUTS
// ##########################
document.addEventListener('keydown', function (keyEvent) {
  const pressed = Number.parseInt(keyEvent.key);

  if (isNaN(pressed)) return;

  //To delete task: Alt + number
  if (keyEvent.altKey) deleteTask.call([...activeTasks].at(pressed - 1));
  //To mark task as complete: number;
  else if (document.activeElement !== taskInputField)
    markTaskComplete.call([...activeTasks].at(pressed - 1));
});

// ######################
//   ADD TASK HANDLERS
// ######################
function attachListener(e) {
  e.preventDefault();
  let target = e.target.closest('[data-button-type]');

  if (!target) return;

  const buttonType = target.getAttribute('data-button-type');

  switch (buttonType) {
    case 'taskComplete':
      markTaskComplete.call(target.parentElement);
      break;
    case 'taskDelete':
      deleteTask.call(target.parentElement);
      break;
  }
}

// ######################
//   INPUT PLACEHOLDER
// ######################
function placeholderSwitch(state) {
  let placeholder = '';
  if (state === 'normal') placeholder = 'tick tock goes the clock';
  else if (state === 'warning')
    placeholder = 'only 5 tasks can be added at a time.';

  taskInputField.setAttribute('placeholder', placeholder);
}

// ######################
//   EVENT LISTENERS
// ######################
taskInputForm.addEventListener('submit', taskInput);
taskContainer.addEventListener('click', attachListener);

// ######################
//   INIT
// ######################
setDate();
placeholderSwitch('normal');
taskInputField.focus();
