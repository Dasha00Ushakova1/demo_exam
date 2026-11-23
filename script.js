// Подсветка кода при загрузке
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
});

// Переключение страниц
function showPage(pageId, btnElement) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    if(btnElement) btnElement.classList.add('active');
    
    // Прокрутка вверх при смене страницы
    document.querySelector('.content').scrollTop = 0;
}

// Копирование кода
function copyCode(btn) {
    const code = btn.nextElementSibling.innerText;
    navigator.clipboard.writeText(code).then(() => {
        btn.innerText = "Скопировано!";
        btn.style.background = "#10b981";
        setTimeout(() => {
            btn.innerText = "Копировать";
            btn.style.background = "#334155";
        }, 2000);
    });
}

// =============== ЧАТ-БОТ ===============
function toggleChat() {
    const chat = document.getElementById('chatWindow');
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    // Логика ответов бота
    setTimeout(() => {
        let reply = "Я не совсем понял вопрос. Попробуй спросить про: 'База данных', 'Scaffold', 'Ошибка Context', 'Кнопки удаления', 'Не грузятся картинки', 'Роли'.";
        const lower = text.toLowerCase();

        // 1. Вопросы про базу данных
        if (lower.includes('база') || lower.includes('sql') || lower.includes('csv') || lower.includes('импорт')) {
            reply = "📌 **База данных:** Обязательно сохраняй Excel в формат 'CSV UTF-8'. В DB Browser при импорте проверь типы: Цена должна быть REAL, а ID и Количество — INTEGER. Не забудь нажать 'Записать изменения'!";
        }
        
        // 2. Вопросы про Scaffold (генерация моделей)
        else if (lower.includes('scaffold') || lower.includes('модел') || lower.includes('контекст')) {
            reply = "📌 **Scaffold:** Открой 'Вид -> Консоль диспетчера пакетов'. Вставь: \n`Scaffold-DbContext \"Data Source=database.db\" Microsoft.EntityFrameworkCore.Sqlite -OutputDir Models -Force`\nУбедись, что установлены пакеты Sqlite и Proxies!";
        }
        
        // 3. Ошибка Context is not defined
        else if (lower.includes('context') || lower.includes('не найден') || lower.includes('does not exist')) {
            reply = "📌 **Ошибка Context:** Ты забыл подключить пространство имен. В самом верху кода напиши: \n`using ИмяТвоегоПроекта.Models;`";
        }
        
        // 4. Программа вылетает
        else if (lower.includes('вылетает') || lower.includes('краш') || lower.includes('ошибка при запуске')) {
            reply = "📌 **Программа падает:** Вставь перехватчик ошибок в `App.xaml.cs` (код есть в Модуле 2). Тогда вместо закрытия окна ты увидишь текст ошибки.";
        }
        
        // 5. Картинки
        else if (lower.includes('картинк') || lower.includes('фото') || lower.includes('image')) {
            reply = "📌 **Картинки не грузятся:** Проверь три вещи:\n1) В свойствах картинок в Visual Studio выбрано 'Действие при сборке: Ресурс'.\n2) Файл лежит в папке `Images/Products/`.\n3) В базе данных в колонке `image_file_name` написано точное имя файла (например, `boots.jpg`).";
        }
        
        // 6. Удаление
        else if (lower.includes('удал') || lower.includes('кнопк')) {
            reply = "📌 **Удаление:** Используй `db.Products.Remove(obj);` и ОБЯЗАТЕЛЬНО `db.SaveChanges();`. После этого вызови `LoadData()`, чтобы обновить экран.";
        }
        
        // 7. Добавление
        else if (lower.includes('добав')) {
            reply = "📌 **Добавление:** Создай `new Product()`, заполни поля из TextBox, вызови `db.Products.Add(obj)` и `db.SaveChanges()`.";
        }
        
        // 8. Роли
        else if (lower.includes('роль') || lower.includes('менеджер') || lower.includes('админ') || lower.includes('скрыть')) {
            reply = "📌 **Роли:** Используй свойство `Visibility.Collapsed`. Например: `AddButton.Visibility = Visibility.Collapsed;`. Не используй Hidden, он оставит пустое место!";
        }
        
        // 9. Приветствие
        else if (lower.includes('привет') || lower.includes('здравствуй')) {
            reply = "Привет! Готов сдавать? Спрашивай про базу, код, ошибки или роли.";
        }

        addMessage(reply, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    // Поддержка переноса строк
    div.innerHTML = text.replace(/\n/g, '<br>');
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}
