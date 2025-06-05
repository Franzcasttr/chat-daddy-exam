# ✨ ChatDaddy Technical✨

This project is a responsive, interactive Kanban board application built with React, Vite, Material UI, and `dnd-kit` for drag-and-drop functionality. It allows users to manage tasks across different stages of completion, with features like adding, editing, deleting tasks, managing subtasks, and persisting data to local storage.

## 🎥 Demo

<a href="https://www.loom.com/share/0657e98949604bb586de1bdaa12c5894?sid=eb5d8341-7ec9-42cb-8647-37dc50ad0664" target="_blank">
  <img src="https://cdn.loom.com/sessions/thumbnails/0657e98949604bb586de1bdaa12c5894-0b2e175269e5895a-full-play.gif" alt="Watch Kanban Board Demo" width="600"/>
</a>

<br>

## 🚀 Features

- **Multiple Columns:** Organize tasks into customizable columns (e.g., "Not Started", "In Progress", "Blocked", "Done").
- **Task Management:**
  - Create new tasks with titles, descriptions, and due dates.
  - Edit existing tasks.
  - Delete tasks with a confirmation modal.
- **Subtasks:** Add and manage subtasks for each main task, including completion status.
- **Drag & Drop:** Intuitively move tasks between columns and reorder tasks within a column using `@dnd-kit`.
- **Responsive Design:** Adapts to various screen sizes for a seamless experience on desktop and mobile.
- **Local Storage Persistence:** Your board data is saved in the browser's local storage, so your tasks remain even after closing the tab.
- **Styled with Material UI:** Modern and clean user interface.
- **Minimalist Theme:** Based on the provided CSS design, with a focus on clarity and aesthetics.

## 🛠️ Tech Stack

- **Frontend:** React (with Vite)
- **UI Library:** Material UI (MUI)
- **Drag & Drop:** `@dnd-kit`
- **Language:** TypeScript
- **Build Tool:** Vite

## ⚙️ Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm (v9.x or later recommended) or yarn

### Installation & Running

1.  **Clone the repository:**

    ```bash
    # If you have SSH set up
    git clone git@github.com:Franzcasttr/chat-daddy-exam.git
    # Or using HTTPS
    git clone https://github.com/Franzcasttr/chat-daddy-exam.git

    cd chat-daddy-exam
    ```

2.  **Install dependencies:**
    Using npm:

    ```bash
    npm install
    ```

3.  **Run the development server:**
    Using npm:

    ```bash
    npm run dev
    ```

    This will start the Vite development server, typically on `http://localhost:5173` (the port might vary if 5173 is in use). Open this URL in your web browser.
