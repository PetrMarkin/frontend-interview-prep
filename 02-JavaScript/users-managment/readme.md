# 👥 User Manager - JavaScript Practice Project

A web application for managing users with async operations, filtering, sorting, and CRUD functionality. Built with pure JavaScript to practice Promises, Object Methods, and Events.

## 📋 Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

## ✨ Features

### Core Functionality
- **Async User Loading** - Simulated server request with Promise (1s delay, 20% error chance)
- **CRUD Operations** - Create, Read, Update, Delete users
- **Real-time Search** - Live filtering by user name
- **Dynamic Sorting** - Sort by ID, name, or age
- **Statistics Dashboard** - Real-time updates of total, active users and average age

### Promise Implementations
- Initial data loading with error handling & retry mechanism
- Chain of Promises for batch inactive user deletion
- Export functionality with Blob and Promise
- Add user with async simulation

### Object-Oriented Design
- `UserManager` class with encapsulated data and methods
- Array manipulation methods (filter, map, reduce, sort)
- Immutable operations where appropriate
- Clean separation of concerns

### Event Handling
- `DOMContentLoaded` - App initialization
- `click` - Add, delete, export, batch operations
- `input` - Live search functionality
- `change` - Sort select dropdown
- Custom event listeners for dynamic elements

## 🛠 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, animations
- **JavaScript (ES6+)** - Classes, Promises, async/await, arrow functions, destructuring
- **No frameworks or libraries** - Pure vanilla JavaScript

## 🚀 Installation

1. **Clone the repository**
``` 
    bash
    git clone https://github.com/yourusername/user-manager.git
    cd user-manager
```

2. **Open the application**
```
    # Using Python (any version)
    python -m http.server 8000

    # Using Node.js (if installed)
    npx serve

    # Or simply open index.html in your browser
```
3. **Navigate to http://localhost:8000**