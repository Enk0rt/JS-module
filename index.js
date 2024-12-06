//Визначаємо кнопки взаємодії користувача з додатком

const userInput = document.getElementById('user-input')
const addBtn = document.getElementById('add')
const sortNameBtn = document.getElementById('name-sort')
const sortValueBtn = document.getElementById('value-sort')
const deleteBtn = document.getElementById('delete')
let errorContainer = document.querySelector('.error__container')

//Визначаємо поле для збереження пар
const storage = document.getElementById('storage')

//Робота з Local Storage, збереження роботи після перезавантаження. Отримуємо масив пар з ЛС, з кожної пари беремо перший елемент(назва, другий - значення), якщо такого масиву немає, то задаємо пустий масив і далі з ним працюємо.

let lsPairElements = getFromLocaleStorage('pairs') || []
    storage.innerHTML = '';
    lsPairElements.forEach(item =>{
        let name = item[0]
        let value = item[1]
        createListElement(name,value);
    })

//Створюємо елемент списку з унікальним ID, а також переносимо введене значення інпута в контент створеного елементу
    addBtn.addEventListener('click', ()=>{
        //Отримуємо значення з інпуту
        const userInputValue = userInput.value;
        //Додаємо перевірку чи ввів користувач розділювач
        if(userInputValue === ''){
            createError('Please fill the input field! The template is - Name=Value')
        }else if(!userInputValue.match(/=/g)){
            createError('Please enter valid values! You should use "=" for splitting your Name and Value!')
        }

        let userInputStrArr = userInputValue.split('=');

        //Розбиваємо отриману з інпуту строку на два значення, перше - перед знаком "=", друге - після
        const name = userInputStrArr[0].trim();
        const value = userInputStrArr[1].trim();

        //Валідація значень в інпуті
        if((!name || !value) || (name.match(/[^\w\sа-яА-ЯїЇєЄіІґҐ]/g) || (value.match(/[^\w\sа-яА-ЯїЇєЄіІґҐ]/g)))){
            //Якщо перевірка не пройдена виводимо помилку
            createError('Please enter valid values! You can use only Alpha-numeric characters and "_" !')
        }else if(userInputValue.match(/=/g).length>1){
            createError('Please enter only one "=" !')
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

            //Якщо у масиві уже є id вибраного елементу, то він видаляється з масиву методом filter й зникає клас, якщо немає, то id додається до масиву
            if (toDelete.includes(itemId)){
                toDelete = toDelete.filter(id => id !== itemId);
                toDeleteItem.classList.remove('chosen');
            }else{
                toDelete.push(itemId);
                toDeleteItem.classList.add('chosen');
            }
        }
    })

    //Подія при якій видаляються елементи, обрані користувачем
    deleteBtn.addEventListener('click',()=>{
        //Для кожного елементу в масиві toDelete шукаємо відповідний елемент з data-id, якщо такий є, то видаляємо
        toDelete.forEach(id => {
            const elementToDelete = document.querySelector(`[data-id="${id}"]`)
            if(elementToDelete){
                elementToDelete.remove();
            }
        });
        //Після операції очищаємо масив
        toDelete = [];

        //Оновлення пар у ЛС і DOM
        updateList()
    })

    //Сортуємо за Name
    sortNameBtn.addEventListener('click',()=>{
        sortArr(0);
        //Оновлюємо контент
        updateList()
    })

    //Сортуємо за Value
    sortValueBtn.addEventListener('click',()=>{
        sortArr(1);
        //Оновлюємо контент
        updateList()
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
    //Створюємо масив з дочірніх елементів списку
    let listElements = Array.from(storage.children);

    //Визначаємо Name першого елементу й Name другого елементу й порівнюємо їх
    listElements.sort((a,b) => {
        const firstElementName = a.innerText.split('=')[i].trim().toLowerCase()
        const secondElementName = b.innerText.split('=')[i].trim().toLowerCase()

        return firstElementName.localeCompare(secondElementName);
    })
    //Очищаємо список
    storage.innerHTML = '';

    //Заповняємо з нуля елементами відсортованого списку
    listElements.forEach(item => storage.appendChild(item));
}

//Функція для оновлення відображення списку через Локал сторедж
function updateList() {
        //Отримали дані з ЛС
    let lsPairElement = getFromLocaleStorage('pairs');

        //Обнулили отриманий масив
    lsPairElement = [];

        //Формуємо масив з елементів списку й ітеруємо кожен з них
    Array.from(storage.children).forEach(item => {

        //Для кожного елементу визначаємо значення name та value отримане після розділення строки по знаку "="
        let name = item.innerText.split('=')[0].trim()
        let value = item.innerText.split('=')[1].trim()

        //Отримані дані згруповуємо у масив
        let pair = [name, value]

        //Своєю чергою масив pair запаковуємо у загальний масив
        lsPairElement.push(pair)
    });
    //Передаємо загальний масив назад у ЛС
    setToLocaleStorage('pairs', lsPairElement);
}

function createError(text){
        let errorElement = document.createElement("p")
        errorContainer.appendChild(errorElement);
        errorElement.className = ('error');
        errorElement.innerText = `${text}`

        //Асинхронно додаємо клас з анімацією зникнення через 3.4 секунди
        setTimeout(() => {
            errorElement.classList.add('fade-out');
        }, 3400);

        //Видаляємо елементи через 5 секунд після появи
        setTimeout(() => {
            if (errorElement.parentElement) { //Перевірка чи елемент існує в DOM
                errorElement.remove();
            }
        }, 5000);
}
