'use strict';

const taskContainer = document.querySelector('.tasks-container');
const taskInputForm = document.querySelector('.new-task-section');
const taskInputField = document.querySelector('.task-input');
const dateField = document.querySelector('.date');

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
        <button class="circle" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" class="circle-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-button-type="taskComplete">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-button-type="taskComplete"/>
          </svg>
        </button>
        <p class="task">${task}</p>
        <button class="trash">
          <svg xmlns="http://www.w3.org/2000/svg" class="trash-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-button-type="taskDelete">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-button-type="taskDelete"/>
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

  if (checkIconEls.length >= 5) {
    taskInputField.setAttribute(
      'placeholder',
      'only 5 tasks can be added at a time.'
    );
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
  this?.parentElement.classList.toggle('complete');
}

// ######################
//   DELETE A TASK
// ######################
function deleteTask() {
  const taskEntry = this?.parentElement;

  if (!taskEntry) return;

  taskEntry.style.opacity = 0;
  setTimeout(function () {
    taskEntry.remove();
  }, 200);

  taskInputField.setAttribute('placeholder', 'tick tock goes the clock');
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
  if (keyEvent.altKey) deleteTask.call([...trashIconEls].at(pressed - 1));
  //To mark task as complete: number;
  else if (document.activeElement !== taskInputField)
    markTaskComplete.call([...checkIconEls].at(pressed - 1));
});

// ######################
//   ADD TASK HANDLERS
// ######################
function attachListener(e) {
  e.preventDefault();
  let target = e.target;
  const buttonType = target.getAttribute('data-button-type');

  if (!buttonType) return;

  while (!target.parentElement.classList.contains('task-entry'))
    target = target.parentElement;

  switch (buttonType) {
    case 'taskComplete':
      markTaskComplete.call(target);
      break;
    case 'taskDelete':
      deleteTask.call(target);
      break;
  }
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
const checkIconEls = document.getElementsByClassName('circle');
const trashIconEls = document.getElementsByClassName('trash');
taskInputField.focus();
