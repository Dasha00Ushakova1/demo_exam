document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
});

function showPage(pageId, btnElement) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if(btnElement) btnElement.classList.add('active');
    document.querySelector('.content').scrollTop = 0;
}

function copyCode(btn) {
    const code = btn.nextElementSibling.innerText;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.innerText;
        btn.innerText = "Скопировано!";
        btn.style.background = "#10b981";
        btn.style.color = "#fff";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "#2a151a";
            btn.style.color = "#a39699";
        }, 2000);
    });
}

// =============== ЧАТ-БОТ (БАЗА ЗНАНИЙ) ===============
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

    setTimeout(() => {
        let reply = "Я не нашел точного совпадения. Попробуй использовать другие слова. Например: 'картинки', 'база данных', 'Scaffold', 'SaveChanges', 'ошибка Null', 'программа вылетает', 'XAML', 'Binding'.";
        const lower = text.toLowerCase();

        // === БАЗА ДАННЫХ (Module 1) ===
        if (lower.includes('база') || lower.includes('sql') || lower.includes('csv') || lower.includes('импорт') || lower.includes('бд')) {
            reply = "🗄️ **База данных:** Сохраняй Excel в формат 'CSV UTF-8'. В DB Browser при импорте проверь типы: Цена = REAL, ID/Кол-во = INTEGER. Не забудь нажать 'Записать изменения'!";
        } else if (lower.includes('кракозябр') || lower.includes('кодировк')) {
            reply = "🗄️ **Кракозябры:** Ты сохранил CSV не в UTF-8. Открой Excel заново и сделай 'Сохранить как' -> 'CSV UTF-8'. Проблема исчезнет.";
        } else if (lower.includes('слиплось') || lower.includes('один столбец')) {
            reply = "🗄️ **Слиплось в один столбец:** В Excel не тот разделитель. При импорте в DB Browser смени разделитель с запятой (,) на точку с запятой (;).";
        } else if (lower.includes('no such table') || lower.includes('таблица не найдена')) {
            reply = "🗄️ **Ошибка 'no such table':** Программа не видит базу. Проверь: 1) В свойствах database.db стоит 'Копировать всегда'. 2) Ты используешь правильное имя таблицы.";
        } else if (lower.includes('foreign key') || lower.includes('внешний ключ')) {
            reply = "🗄️ **Foreign Key:** В DB Browser перейди в Database Structure -> Изменить таблицу -> Foreign Keys и укажи связи (например, user_id ссылается на users.id).";

        // === VISUAL STUDIO / NUGet (Module 2) ===
        } else if (lower.includes('nuget') || lower.includes('пакет')) {
            reply = "⚙️ **NuGet:** Нажми ПКМ по проекту -> Управление пакетами NuGet. Установи: Microsoft.EntityFrameworkCore.Sqlite и Proxies.";
        } else if (lower.includes('scaffold') || lower.includes('модел')) {
            reply = "⚙️ **Scaffold:** Вид -> Другие окна -> Консоль диспетчера пакетов. Вставь: \n`Scaffold-DbContext \"Data Source=database.db\" Microsoft.EntityFrameworkCore.Sqlite -OutputDir Models -Force`";
        } else if (lower.includes('context') || lower.includes('does not exist')) {
            reply = "⚙️ **Context не найден:** Ты забыл `using ИмяТвоегоПроекта.Models;` в самом верху файла MainWindow.xaml.cs.";
        } else if (lower.includes('.net framework') || lower.includes('framework')) {
            reply = "⚙️ **Не тот проект:** Ты создал .NET Framework, а нужно .NET (Core). Удали проект и создай заново с правильным шаблоном.";

        // === КАРТИНКИ (Module 2) ===
        } else if (lower.includes('картинк') || lower.includes('фото') || lower.includes('image') || lower.includes('изображен')) {
            reply = "🖼️ **Картинки не грузятся:** 1) В свойствах картинок в VS должно быть 'Действие при сборке: Ресурс'. 2) Имя файла в БД должно совпадать с файлом в папке (например, boots.jpg). 3) Путь должен быть '/Images/Products/...'";
        } else if (lower.includes('заглушк') || lower.includes('picture.png')) {
            reply = "🖼️ **Заглушка:** Проверь, лежит ли picture.png в корне папки Images. Если нет — положи туда.";

        // === КОД / ОШИБКИ C# (Module 2/3) ===
        } else if (lower.includes('nullreference') || lower.includes('null') || lower.includes('ссылка на объект')) {
            reply = "💻 **NullReferenceException:** Ты пытаешься обратиться к пустому объекту. Например, у товара нет категории. Проверь, что все связи (virtual) загружены, или используй `?.` (например, p.Category?.Name).";
        } else if (lower.includes('не компилируется') || lower.includes('syntax error') || lower.includes('красное')) {
            reply = "💻 **Syntax Error:** Проверь: 1) Все ли скобки {} закрыты. 2) Точки с запятой ;. 3) Совпадают ли имена переменных (регистр важен!).";
        } else if (lower.includes('convert') || lower.includes('cannot implicitly') || lower.includes('string to int')) {
            reply = "💻 **Ошибка типов:** Ты пытаешься вставить текст туда, где нужно число. Используй `int.Parse()` или `float.Parse()`.";
        } else if (lower.includes('вылетает') || lower.includes('краш') || lower.includes('ошибка при запуске')) {
            reply = "💻 **Программа падает:** Вставь перехватчик ошибок в `App.xaml.cs`. Тогда ты увидишь MessageBox с точной причиной.";
        } else if (lower.includes('не сохраняется') || lower.includes('savechanges')) {
            reply = "💻 **Не сохраняется:** Ты забыл вызвать `db.SaveChanges();` после `db.Products.Add()` или `Remove()`.";

        // === КНОПКИ / XAML (Module 2/3) ===
        } else if (lower.includes('кнопк') || lower.includes('button')) {
            reply = "🖱️ **Кнопки:** Убедись, что у кнопки в XAML есть `Click=\"ИмяМетода_Click\"`, а в C# создан метод с таким же именем.";
        } else if (lower.includes('список') || lower.includes('listview') || lower.includes('пуст')) {
            reply = "🖱️ **Пустой список:** Проверь `ProductList.ItemsSource = products;`. Если в базе нет строк — выводить нечего.";
        } else if (lower.includes('binding') || lower.includes('привязк')) {
            reply = "🖱️ **Ошибки Binding:** Проверь имена свойств. В XAML `{Binding Name}` — в C# должно быть поле `public string Name { get; set; }`.";
        } else if (lower.includes('xaml') || lower.includes('верстк')) {
            reply = "🖱️ **XAML ошибка:** Проверь закрытие тегов. Например, `<TextBlock Text=\"...\"/>` (слэш в конце).";

        // === РОЛИ (Module 4) ===
        } else if (lower.includes('роль') || lower.includes('менеджер') || lower.includes('админ') || lower.includes('скрыть')) {
            reply = "🔐 **Роли:** Используй `Visibility.Collapsed`. Например: `AddButton.Visibility = Visibility.Collapsed;`. Hidden оставляет пустое место!";
        } else if (lower.includes('combobox') || lower.includes('выпадающий')) {
            reply = "🔐 **ComboBox:** Если при выборе роли вылетает ошибка, добавь проверку: `if (RoleSelector.SelectedItem == null) return;`.";
        
        // === ПРОЧЕЕ ===
        } else if (lower.includes('привет') || lower.includes('здравствуй')) {
            reply = "Привет! Готов сдавать? Я знаю ответы на большинство ошибок. Просто напиши, что не работает.";
        } else if (lower.includes('не работает') || lower.includes('помоги')) {
            reply = "Опиши точнее: вылетает ошибка, пустой экран, или не сохраняется в базу? Тогда я смогу помочь.";
        }

        addMessage(reply, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = text.replace(/\n/g, '<br>');
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}
