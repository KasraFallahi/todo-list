# TODO-List REST API

## Installation

Required:
- Node.js
- MongoDB

Setup:
>Install Node Modules
``` javascript
npm install
```

>Start the server
``` javascript
npm run start
```
## Live Demo
https://todo-list-e7ej.onrender.com/api/users/register


## Account

| Route | Method	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/users/register | `POST` | {"username":"kasra", "password":"123456"} | Register an account. |
| /api/users/login | `GET` | {"username":"kasra", "password":"123456"} | Login to an account. |

## Task List

| Route | Method	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/tasks | `POST` | {"title" : "list2","description" : "task1 description"} | New tasks list. |
| /api/tasks | `GET` | {"username":"kasra", "password":"123456"} | Get tasks list. |
| /api/tasks/:id | `DELETE` | - | Delete tasks list. |
| /api/tasks/:id | `PATCH` | {"description":"edited1","title":"title1"} | Edit tasks list. |
| /api/tasks/add-list | `POST` | [{"title" : "list 2","description" : "description"}] | Add list of lists. |

## Individual Task

| Route | Method	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /api/tasks/status/:id | `PATCH` | {"status": true} | Change task status. |
| /api/tasks/:listId | `POST` | {"title":"task 22"} | Add new task to list. |
| /api/tasks/task/:id | `DELETE` | - | Delete a task from list. |
| /api/tasks/:id | `GET` | - | Get tasks of a list. |
