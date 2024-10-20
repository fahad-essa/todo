document.addEventListener('DOMContentLoaded', () => {
    const newTodoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-todo');
    const searchButton = document.getElementById('search-btn');
    const clearSearchButton = document.getElementById('clear-search-btn');
    
    
    const todosMap = new Map();

    const addTodo = (todoText, completed = false) => {
        const todoId = Date.now().toString();
        todosMap.set(todoId, { text: todoText, completed });

        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.dataset.id = todoId;
        todoItem.innerHTML = ` 
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <span class="todo-text ${completed ? 'completed' : ''}">${todoText}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        const checkbox = todoItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            todoItem.querySelector('.todo-text').classList.toggle('completed', isChecked);
            updateTodoStatus(todoId, isChecked);
        });

        todoItem.querySelector('.delete-btn').addEventListener('click', () => {
            todoList.removeChild(todoItem);
            todosMap.delete(todoId);
            updateCounter();
            saveTodos();
        });

        todoItem.querySelector('.edit-btn').addEventListener('click', () => {
            const todoTextSpan = todoItem.querySelector('.todo-text');
            const newText = prompt('Edit your task:', todoTextSpan.textContent);
            if (newText) {
                todoTextSpan.textContent = newText;
                todosMap.set(todoId, { text: newText, completed: checkbox.checked });
                saveTodos();
            }
        });

        todoList.appendChild(todoItem);
        updateCounter();
    };

    const updateTodoStatus = (todoId, completed) => {
        const todo = todosMap.get(todoId);
        if (todo) {
            todosMap.set(todoId, { ...todo, completed });
            saveTodos();
        }
    };

    addTodoButton.addEventListener('click', () => {
        const todoText = newTodoInput.value.trim();
        if (todoText !== '') {
            addTodo(todoText);
            newTodoInput.value = '';
            saveTodos();
        }
    });

    const updateCounter = () => {
        const todoCounter = document.getElementById('todo-counter');
        const totalTodos = todosMap.size;
        todoCounter.textContent = totalTodos;
    };

    const saveTodos = () => {
        const todosArray = Array.from(todosMap.entries()).map(([id, { text, completed }]) => ({ id, text, completed }));
        localStorage.setItem('My todos', JSON.stringify(todosArray));
    };

    const loadTodos = () => {
        const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        savedTodos.forEach(({ id, text, completed }) => {
            todosMap.set(id, { text, completed });
            addTodoToDOM(id, text, completed);
        });
        updateCounter();
    };

    const addTodoToDOM = (id, text, completed) => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.dataset.id = id;
        todoItem.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <span class="todo-text ${completed ? 'completed' : ''}">${text}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        const checkbox = todoItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            todoItem.querySelector('.todo-text').classList.toggle('completed', isChecked);
            updateTodoStatus(id, isChecked);
        });

        todoItem.querySelector('.delete-btn').addEventListener('click', () => {
            todoList.removeChild(todoItem);
            todosMap.delete(id);
            updateCounter();
            saveTodos();
        });

        todoItem.querySelector('.edit-btn').addEventListener('click', () => {
            const todoTextSpan = todoItem.querySelector('.todo-text');
            const newText = prompt('Edit your task:', todoTextSpan.textContent);
            if (newText) {
                todoTextSpan.textContent = newText;
                todosMap.set(id, { text: newText, completed: checkbox.checked });
                saveTodos();
            }
        });

        todoList.appendChild(todoItem);
    };

    const searchTodos = () => {
        const query = searchInput.value.toLowerCase();
        const todos = todoList.getElementsByTagName('li');
        Array.from(todos).forEach(todo => {
            const text = todo.querySelector('.todo-text').textContent.toLowerCase();
            todo.style.display = text.includes(query) ? '' : 'none';
        });
    };

    const clearSearch = () => {
        searchInput.value = '';
        const todos = todoList.getElementsByTagName('li');
        Array.from(todos).forEach(todo => {
            todo.style.display = '';
        });
    };

    searchButton.addEventListener('click', searchTodos);
    clearSearchButton.addEventListener('click', clearSearch);

    loadTodos();
});
