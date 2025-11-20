# TaskNova 🌟

A modern, futuristic task management application with a stunning sci-fi UI theme. Built with React, Vite, and Zustand for seamless productivity.

![TaskNova](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)

## 🚀 Live Demo

**[View Live App](https://mishabcp.github.io/TaskNova/)**

## ✨ Features

### 📋 Task Management
- **Create & Edit Tasks** - Add tasks with titles, descriptions, priorities, tags, and due dates
- **Subtasks** - Break down complex tasks into manageable subtasks with progress tracking
- **Priority Levels** - Organize tasks by Low, Medium, or High priority
- **Tags** - Categorize tasks with custom, colorful tags
- **Categories** - Sort tasks into Personal, Work, Shopping, Health, Learning, and more

### 🎨 Multiple Views
- **Dashboard** - Overview of your productivity with stats and quick actions
- **List View** - Traditional task list with filtering and search
- **Kanban Board** - Drag-and-drop tasks across To Do, In Progress, and Completed columns
- **Calendar View** - Visualize tasks by due date
- **Focus Mode** - Distraction-free environment with Pomodoro timer

### 🗑️ Smart Deletion
- **Custom Confirmation Modals** - Theme-matching popups instead of native alerts
- **Kanban Recycle Bin** - Drag tasks to delete with visual feedback
- **Keyboard Shortcuts** - Press Enter to confirm, click outside to cancel

### 📱 Mobile Support
- **Touch-Optimized** - Tap and hold (250ms) to drag tasks on mobile devices
- **Responsive Design** - Fully functional on all screen sizes
- **Mobile-Friendly UI** - Optimized navigation and controls

### 🎯 Productivity Features
- **Streak Tracking** - Monitor your daily completion streak
- **Task Statistics** - View total tasks, completed tasks, and streaks
- **Search & Filter** - Find tasks by title, description, tags, priority, or status
- **Data Export/Import** - Backup and restore tasks as JSON files

### 🎨 UI/UX
- **Dark Sci-Fi Theme** - Holographic effects, neon colors, and futuristic design
- **Smooth Animations** - Powered by Framer Motion
- **Custom Scrollbars** - Themed scrollbars matching the aesthetic
- **Toast Notifications** - Real-time feedback for all actions

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.1.4
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 12.23.24
- **Drag & Drop**: @dnd-kit/core 6.3.1
- **Icons**: React Icons 5.0.1
- **Notifications**: React Hot Toast 2.6.0
- **Calendar**: React Big Calendar 1.19.4
- **Charts**: Recharts 3.4.1

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mishabcp/TaskNova.git

# Navigate to project directory
cd TaskNova

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### Creating a Task
1. Click the **"NEW TASK"** button in the sidebar
2. Fill in task details (title, description, priority, tags, due date)
3. Add subtasks if needed
4. Click **"Create Task"**

### Managing Tasks
- **Complete**: Click the checkbox to mark as complete
- **Edit**: Click the edit icon to modify task details
- **Delete**: Click the delete icon or drag to recycle bin (Kanban view)
- **Duplicate**: Click the copy icon to create a duplicate

### Kanban Board
- **Drag & Drop**: Move tasks between columns
- **Desktop**: Click and drag
- **Mobile**: Tap and hold for 250ms, then drag
- **Delete**: Drag tasks to the recycle bin at the bottom

### Focus Mode
1. Select a task from the dropdown
2. Set your focus duration
3. Click **"Start Focus"** to begin the Pomodoro timer
4. Stay focused until the timer completes!

## 🎨 Customization

### Changing Theme Colors
Edit `tailwind.config.js` to customize the color palette:

```js
colors: {
  'holo-500': '#00f0ff',  // Main accent color
  'neon-pink': '#ff006e',
  'neon-purple': '#8338ec',
  // ... more colors
}
```

### Adding New Categories
Update the category options in `CreateTaskModal.jsx`:

```jsx
<option value="custom">Custom Category</option>
```

## 📱 Mobile Features

- **Touch Gestures**: Tap and hold to drag tasks
- **Responsive Layout**: Optimized for all screen sizes
- **Mobile Navigation**: Collapsible sidebar on small screens
- **Touch-Friendly Buttons**: Larger touch targets for better UX

## 🔧 Configuration

### GitHub Pages Deployment
The app is configured to deploy automatically via GitHub Actions. The workflow file is located at `.github/workflows/deploy.yml`.

### Base Path
For GitHub Pages deployment, the base path is set in `vite.config.js`:

```js
export default defineConfig({
  base: '/TaskNova/',
})
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍💻 Author

**Misha BCP**
- GitHub: [@mishabcp](https://github.com/mishabcp)

## 🙏 Acknowledgments

- Design inspired by modern sci-fi interfaces
- Built with love using React and Tailwind CSS
- Special thanks to the open-source community

---

**TaskNova** - Manage your tasks with style! 🚀✨
