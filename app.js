//Elements

const formButton = document.body.querySelector('.form-button')
const formText = document.body.querySelector('.form-text')
const contentTodos = document.body.querySelector('.content-todos')
const selectElement = document.body.querySelector('.form-sort')

let todosArray = [] 


//EventListeners

formButton.addEventListener('click', addTodo)
document.addEventListener('DOMContentLoaded', loadFromLocalStorage)
contentTodos.addEventListener('click', markDeleteClicked)
selectElement.addEventListener('change', selectSort)

//Functions

function displayTodoArray()
{
    todosArray.map(displayTodo)

    formText.focus()
}

function addTodo(event)
{
    event.preventDefault()

    if (formText.value !== '')
    {
        element =
        {
            text: formText.value,
            done: false
        }
        
        todosArray.push(element)
        addToLocalStorage(element)
        
        displayTodo(element)
        
        formText.focus()
    }
}
    
function displayTodo(element)
{
    const todo = document.createElement('div')
    todo.classList.add('todo')
    todo.insertAdjacentHTML('afterbegin', `
    <p class="todo-text">${element.text}</p>
    <button class="todo-mark-button">
    <i class="fas fa-check"></i>
    </button>
    <button class="todo-delete-button">
    <i class="fas fa-trash"></i>
    </button>
    `)
    
    if (element.done === true)
    {
        todo.classList.add('marked-todo')
    }
    
    contentTodos.appendChild(todo)
    
    formText.value = ''
}

function markDeleteClicked(event)
{
    if (event.target.classList[0] === 'todo-mark-button')
    {
        const todos = event.target.parentNode.parentNode
        const children = Array.from(todos.children)
        const index = children.indexOf(event.target.parentNode)
        todosArray[index].done = !todosArray[index].done
        updateStateInLocalStorage()

        event.target.parentNode.classList.toggle('marked-todo')
    }
    else if (event.target.classList[0] === 'todo-delete-button')
    {
        deleteTodo(event.target)
    }
}

function deleteTodo(element)
{
    const todo = element.parentNode

    const children = Array.from(todo.parentNode.children)
    const index = children.indexOf(todo)
    deleteFromLocalStorage(index)
    todosArray = todosArray.filter(el => todosArray.indexOf(el) !== index)

    todo.classList.add('fall-animation')

    todo.addEventListener('transitionend', event =>
    {
        if (event.propertyName === 'transform') //предотвращение многократного вызова
        {
            todo.remove()
        }
    })
}

function selectSort(event)
{
    switch (event.target.value)
    {
        case 'all':
            displayBlockAll()
            break
        case 'completed':
            displayBlockAll()
            const array1 = Array.from(document.querySelector('.content-todos').children)
            for (let i = 0; i < array1.length; i++)
            {
                if (todosArray[i].done !== true)
                {
                    array1[i].style.display = 'none'
                }
            }
            break
        case 'uncompleted':
            displayBlockAll()
            const array2 = Array.from(document.querySelector('.content-todos').children)
            for (let i = 0; i < array2.length; i++)
            {
                if (todosArray[i].done === true)
                {
                    array2[i].style.display = 'none'
                }
            }
            break    
    }
}

function displayBlockAll()
{
    const array = Array.from(document.querySelector('.content-todos').children)
    for (let i = 0; i < array.length; i++)
    {
        array[i].style.display = 'flex'
    }
}

function addToLocalStorage(todo)
{
    let todos = []

    if (localStorage.getItem('todos') !== null)
    {
        todos = JSON.parse(localStorage.getItem('todos'))
        todos.push(todo)
        localStorage.setItem('todos', JSON.stringify(todos))
    }
    else
    {
        todos = [todo]
        localStorage.setItem('todos', JSON.stringify(todos))
    }
}

function deleteFromLocalStorage(index)
{
    if (localStorage.getItem('todos') !== null)
    {
        let todos = JSON.parse(localStorage.getItem('todos'))

        todos = todos.filter(el => todos.indexOf(el) !== index)       

        localStorage.setItem('todos', JSON.stringify(todos))
    }
}

function updateStateInLocalStorage()
{
    if (localStorage.getItem('todos') !== null)
    {
        localStorage.setItem('todos', JSON.stringify(todosArray))
    }
}

function loadFromLocalStorage()
{
    if (localStorage.getItem('todos') !== null)
    {
        todosArray = JSON.parse(localStorage.getItem('todos'))
        displayTodoArray()
    }
    else
    {
        todosArray = []
    }
}
