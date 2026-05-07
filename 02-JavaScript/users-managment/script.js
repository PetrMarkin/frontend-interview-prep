const initialUsers = [
  { id: 1, name: "Анна Смирнова", email: "anna@example.com", age: 25, isActive: true, registrationDate: new Date("2024-01-15") },
  { id: 2, name: "Иван Петров", email: "ivan@example.com", age: 32, isActive: false, registrationDate: new Date("2024-02-20") },
  { id: 3, name: "Даниил Снигуров", email: "danya@example.com", age: 30, isActive: true, registrationDate: new Date("2025-03-11") },
  { id: 4, name: "Иван Отрощенко", email: "ivan@example.com", age: 27, isActive: true, registrationDate: new Date("2025-04-01") },
  { id: 5, name: "Максим Фофилян", email: "max@example.com", age: 37, isActive: false, registrationDate: new Date("2025-04-22") },
  { id: 6, name: "Виктор Игнатидзе", email: "victor@example.com", age: 31, isActive: true, registrationDate: new Date("2025-06-09") },
];

class UserManager {
    constructor(users) {
        this.users = users;
        this.filteredUsers = [...users];
        this.currentSort = 'default';
        this.searchTerm = '';
    }

    getActiveUsers() {
        return this.filteredUsers.filter((user) => user.isActive);
    }

    getAverageAge() {
        if (this.users.length === 0) return 0;
        const sum = this.filteredUsers.reduce((acc, user) => acc + user.age, 0);
        return Math.round(sum / this.users.length);
    }

    sortUsersByAge() {
        return [...this.users].sort((a, b) => a.age - b.age);
    }

    sortUsersByName() {
        return [...this.users].sort((a, b) => a.name.localeCompare(b.name));
    }

    updateFilteredList() {
        let result = [...this.users];

        if (this.searchTerm) {
            result = result.filter((user) => {
                return user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            })
        }

        switch (this.currentSort) {
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'age':
                result.sort((a, b) => a.age - b.age);
                break;
            default:
                result.sort((a, b) => a.id - b.id)
        }

        this.filteredUsers = result;
        return this.filteredUsers;
    }

    addUser(user) {
        const newId = Math.max(...this.users.map((user) => user.id), 0) + 1;

        const newUser = {
            ...user,
            id: newId,
            registrationDate: new Date(),
            isActive: true
        }

        this.users.push(newUser);
        this.updateFilteredList();
        return newUser;
    }

    deleteUser(id) {
        const deleted = this.users.find((user) => user.id === id);
        this.users = this.users.filter((user) => user.id !== id);
        this.updateFilteredList();
        return deleted;
    }

    deleteInactiveUsers() {
        const deletedCount = this.users.filter((user) => !user.isActive).length;
        this.users = this.users.filter((user) => user.isActive);
        this.updateFilteredList();
        return deletedCount;
    }

    setSortType(type) {
        this.currentSort = type;
        this.updateFilteredList();
    }

    setSearchTerm(searchTerm) {
        this.searchTerm = searchTerm;
        this.updateFilteredList();
    }

    getFilteredUsers() {
        return this.filteredUsers;
    }

    getStats() {
        return {
            total: this.filteredUsers.length,
            active: this.getActiveUsers().length,
            averageAge: this.getAverageAge(),
        }
    }
}

const manager = new UserManager(initialUsers);

const usersList = document.querySelector('.users-list');
const nameInput = document.querySelector('#nameInput');
const emailInput = document.querySelector('#emailInput');
const ageInput = document.querySelector('#ageInput');
const addButton = document.querySelector('#addBtn');
const clearInactiveButton = document.querySelector('#clearInactiveBtn');
const exportButton = document.querySelector('#exportBtn');
const sortSelect = document.querySelector('#sortSelect');
const searchInput = document.querySelector('#searchInput');

function fetchUsersFromServer() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error("Ошибка сервера"));
      } else {
        resolve(initialUsers);
      }
    }, 1000);
  });
}

async function loadUsers() {
    usersList.innerHTML = '<div class="loading">Идет загрузка...</div>'
    try {
        const users = await fetchUsersFromServer();
        manager.users = users;
        manager.filteredUsers = [...users];
        manager.updateFilteredList();
        refreshUI();
    } catch (error) {
        usersList.innerHTML = `
            <div class="error">
                Ошибка: ${error.message}
                <button onclick="loadUsers()">Повторить</button>
            </div>
        `;
    }
}

function createUsersList() {
    usersList.innerHTML = '';

    const users = manager.getFilteredUsers();

    users.forEach((user) =>  {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item');
        usersList.appendChild(listItem);
        const name = document.createElement('div');
        name.classList.add('user-name');
        name.textContent = user.name;
        listItem.appendChild(name);
        const age = document.createElement('div');
        age.classList.add('user-age');
        age.textContent = user.age;
        listItem.appendChild(age);
        const email = document.createElement('div');
        email.classList.add('user-email');
        email.textContent = user.email;
        listItem.appendChild(email);
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('deleteBtn');
        deleteButton.textContent = 'Удалить';
        deleteButton.setAttribute('data-id', user.id);
        deleteButton.onclick = () => {
            manager.deleteUser(user.id);
            refreshUI();
        }
        listItem.appendChild(deleteButton);
    })
}

function createStats() {
    document.querySelector('#totalCount').textContent = manager.getStats().total;
    document.querySelector('#activeCount').textContent = manager.getStats().active;
    document.querySelector('#avgAge').textContent = manager.getStats().averageAge;
}

function refreshUI() {
    createUsersList();
    createStats(); 
}

loadUsers();

function addUser() {
    const user = {
        name: nameInput.value,
        email: emailInput.value,
        age: +ageInput.value
    };

    if (validateUsers(user.name, user.email, user.age)) {
        manager.addUser(user);
        refreshUI();
    }
}

function deleteUser(id) {
    manager.deleteUser(id);
}

function exportUsersList(data) {
    let a = document.createElement('a');
    let file = new Blob([data], { type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'users_list.txt';
    a.click();
}

function sortUsers() {
    const sortType = sortSelect.value;
    manager.setSortType(sortType);
    refreshUI();
}

function searchUsers() {
    const searchTerm = searchInput.value;
    manager.setSearchTerm(searchTerm);
    refreshUI();
}

function validateUsers(name, email, age) {
    if (!name || name.length <= 2) {
        alert('Имя должно содержать минимум 2 символа');
        return false;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
        alert('Введите корректный email');
        return false;
    }
    if (!age || age < 18 || age > 100) {
        alert('Возраст должен быть от 18 до 100');
        return false;
    }
    return true;
}

addButton.addEventListener('click', () => {
    nameInput.value = '';
    emailInput.value = '';
    ageInput.value = '';
});

clearInactiveButton.addEventListener('click', () => {
    manager.deleteInactiveUsers();
    refreshUI();
})

exportButton.addEventListener('click', () => {
    let text = JSON.stringify(manager.getFilteredUsers(), null, 2);
    exportUsersList(text);
})

sortSelect.addEventListener('change', sortUsers);

searchInput.addEventListener('input', searchUsers);
