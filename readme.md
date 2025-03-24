# Task Manager

A simple and intuitive Task Manager app built using **React Native** with **Expo**. The app allows users to create, manage, and track their tasks effectively.

## Features
- User Authentication (Signup, Login, Logout)
- Create, Edit, Delete Tasks
- Mark Tasks as Complete or In Progress
- Set Task Priority (Low, Medium, High)
- Add Due Dates
- Task Sorting and Filtering
- User-friendly UI with attractive design

## Screens
- **Login Screen**: Allows users to log in to their account.
- **Signup Screen**: Register new users.
- **Home Screen**: Displays the list of tasks.
- **Add Task Screen**: Add a new task with details like title, description, priority, and due date.
- **Task Detail Screen**: View, edit, complete, or delete tasks.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/siddharthnarela/cave_tech_task_fe.git
    cd cave_tech_task_fe
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the project:
    ```bash
    npx expo start
    ```


## Dependencies
- React Native
- Expo
- React Navigation
- Axios
- React Native Linear Gradient
- React Native Modal DateTime Picker

## Usage
- Sign up or log in.
- Add a new task by providing task title, description, priority, and optional due date.
- View task details, edit or delete tasks.
- Mark tasks as complete or in progress.
- Tasks are sorted based on priority and due date.

## Folder Structure
```bash
.
├── screens
│   ├── LoginScreen.js
│   ├── SignupScreen.js
│   ├── HomeScreen.js
│   ├── AddTaskScreen.js
│   └── TaskDetailScreen.js
├── api
│   └── api.js
└── App.js
```

