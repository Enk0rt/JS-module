//Визначаємо кнопки взаємодії користувача з додатком

const userInput = document.getElementById('user-input')
const addBtn = document.getElementById('add')
const sortNameBtn = document.getElementById('name-sort')
const sortValueBtn = document.getElementById('value-sort')
const deleteBtn = document.getElementById('delete')

//Визначаємо поле для збереження пар
const storage = document.getElementById('storage')

//Робота з Local Storage, збереження роботи після перезавантаження. Отримуємо масив пар з ЛС, з кожної пари беремо перший елемент(назва, другий - значення), якщо такого масиву немає, то задаємо пустий масив і далі з ним працюємо.
document.addEventListener("DOMContentLoaded", ()=>{
    let lsPairElements = getFromLocaleStorage('pairs');
    storage.innerHTML = '';
    if(lsPairElements){
        lsPairElements.forEach(item =>{
            let name = item[0]
            let value = item[1]
            createListElement(name,value);
        })
    }else{
        lsPairElements = [];
    }

//Створюємо елемент списку з унікальним ID, а також переносимо введене значення інпута в контент створеного елементу
    addBtn.addEventListener('click', ()=>{
        //Отримуємо значення з інпута
        const userInputValue = userInput.value;
        if(!userInputValue.match(/=/g)){
            alert('Please enter valid values!')
        }
        let userInputStrArr = userInputValue.split('=');

        //Розбиваємо отриману з інпута строку на два значення, перше - перед знаком "=", друге - після
        const name = userInputStrArr[0].trim();
        const value = userInputStrArr[1].trim();

        //Валідація значень в інпуті
        if((!name || !value) || (name.match(/[^\w\sа-яА-ЯїЇєЄіІґҐ]/g) || (value.match(/[^\w\sа-яА-ЯїЇєЄіІґҐ]/g)))){
            alert('Please enter valid values!')
        }else if(userInputValue.match(/=/g).length>1){
            alert('Please enter only one "="!')
        }
        else{
            //Створюємо елемент списку
            createListElement(name,value);

            //Отримуємо з ЛС оновлений масив пар, та після додавання елементу додаємо нову пару до ЛС
            let pair = [name,value]
            lsPairElements = getFromLocaleStorage('pairs')
            lsPairElements.push(pair);
            setToLocaleStorage('pairs',lsPairElements);
        }
        userInput.value = '';
    })

//Задаємо масив, у якому будуть поміщені елементи, котрі потрібно видалити
    let toDelete = []
    //Реалізація функціонала вибору елементів для видалення
    storage.addEventListener('click' ,e =>{
        const toDeleteItem = e.target;
        if(e.target!== storage){
            const itemId = toDeleteItem.dataset.id;

            if (toDelete.includes(itemId)){
                toDelete = toDelete.filter(id => id !== itemId);
                toDeleteItem.classList.remove('chosen');
            }else{
                toDelete.push(itemId);
                toDeleteItem.classList.add('chosen');
            }
            console.log(toDelete);
        }
    })

    //Подія при якій видаляються елементи, обрані користувачем
    deleteBtn.addEventListener('click',()=>{
        toDelete.forEach(id => {
            const elementToDelete = document.querySelector(`[data-id="${id}"]`)
            if(elementToDelete){
                elementToDelete.remove();
            }
        });
        toDelete = [];

        //Видалення та оновлення пар у ЛС
        let lsPairElement = getFromLocaleStorage('pairs');
        lsPairElement = [];
        console.log(lsPairElement)
        Array.from(storage.children).forEach(item => {
            let name = item.innerText.split('=')[0].trim()
            let value = item.innerText.split('=')[1].trim()

            let pair = [name,value]
            lsPairElement.push(pair)
        });
        setToLocaleStorage('pairs',lsPairElement);
    })

    //Сортуємо за Name
    sortNameBtn.addEventListener('click',()=>{
        sortArr(0);
    })

    //Сортуємо за Value
    sortValueBtn.addEventListener('click',()=>{
        sortArr(1);
    })

})

//Функція для отримання значення з ЛС
function getFromLocaleStorage(item){
    return JSON.parse(localStorage.getItem(item));
}

//Функція для встановлення значення в ЛС
function setToLocaleStorage(key,item){
    localStorage.setItem(key,JSON.stringify(item))
}

// Функція створення унікальних ID
function generateId(){
    return '_'+Math.random().toString(36).substring(2,9);
}

//Функція для створення елементів
function createListElement(name,value){
    const storageItem = document.createElement('li');

    //Встановлюємо унікальний ID
    storageItem.dataset.id = generateId();
    storageItem.innerText = `${name}=${value}`;

    storage.appendChild(storageItem);

}

//Функція для сортування елементів (i - це name та value, оскільки коли формується пара - це масив з двох елементів, у такому разі name - 0, value - 1)
function sortArr(i){
    let listElements = Array.from(storage.children);
    listElements.sort((a,b) => {
        const firstElementName = a.innerText.split('=')[i].trim().toLowerCase()
        const secondElementName = b.innerText.split('=')[i].trim().toLowerCase()

        return firstElementName.localeCompare(secondElementName);
    })

    storage.innerHTML = '';

    listElements.forEach(item => storage.appendChild(item));
}

