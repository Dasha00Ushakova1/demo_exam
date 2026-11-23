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
        let reply = "Я не нашел точного совпадения. Спроси про: 'ошибка', 'xaml', 'sql', 'картинки', 'ключи', 'сохранение'.";
        const lower = text.toLowerCase();

        // МОДУЛЬ 1 (БД)
        if (lower.includes('база') || lower.includes('sql') || lower.includes('бд')) {
            reply = "🗄️ **БД:** Сохраняй Excel в 'CSV UTF-8'. При импорте проверь типы: Цена = REAL, ID = INTEGER. Не забудь нажать 'Write Changes'!";
        } else if (lower.includes('ключ') || lower.includes('foreign key') || lower.includes('primary key')) {
            reply = "🗄️ **Ключи:** PK ставится на `id`. FK настраивается в Database Structure -> Изменить таблицу -> Foreign Keys. Для склада делай составной ключ (два столбца).";
        } else if (lower.includes('no such table') || lower.includes('таблица не найдена')) {
            reply = "🗄️ **No such table:** В свойствах database.db в VS стоит 'Копировать всегда'. Проверь имя таблицы в коде.";
        } else if (lower.includes('эр') || lower.includes('диаграмм') || lower.includes('draw')) {
            reply = "📊 **ER-диаграмма:** DB Browser -> Файл -> Экспорт -> SQL. Открой draw.io -> Упорядочить -> Вставить -> Расширенный -> SQL.";

        // МОДУЛЬ 2 (WPF И КАТАЛОГ)
        } else if (lower.includes('scaffold') || lower.includes('модел')) {
            reply = "⚙️ **Scaffold:** Вид -> Другие окна -> Консоль диспетчера пакетов. Вставь: \n`Scaffold-DbContext \"Data Source=database.db\" Microsoft.EntityFrameworkCore.Sqlite -OutputDir Models -Force`";
        } else if (lower.includes('context') || lower.includes('does not exist')) {
            reply = "⚙️ **Context не найден:** В самом верху напиши `using ИмяПроекта.Models;`.";
        } else if (lower.includes('скидк') || lower.includes('цена')) {
            reply = "💰 **Скидка:** `FinalPrice = p.Price - (p.Price * p.Discount / 100)`. В XAML: `StringFormat={}{0} руб.`.";
        } else if (lower.includes('перечерк')) {
            reply = "💰 **Перечеркнутая цена:** Используй `<TextBlock TextDecorations=\"Strikethrough\" Foreground=\"Red\"/>` для старой цены.";
        } else if (lower.includes('цвет') || lower.includes('фон')) {
            reply = "🎨 **Цвета:** `BgColor = p.Quantity == 0 ? \"LightBlue\" : (p.Discount > 15 ? \"#2E8B57\" : \"White\")`. Привяжи к `Fill` у Rectangle.";
        } else if (lower.includes('поиск') || lower.includes('фильтр') || lower.includes('сортировк')) {
            reply = "🔎 **Поиск/Сортировка:** Используй `AsQueryable()`, `.Where()`, `.OrderBy()`. Вызывай `LoadData()` в событии `TextChanged`.";

        // МОДУЛЬ 3 (ДОБАВЛЕНИЕ И ФОТО)
        } else if (lower.includes('картинк') || lower.includes('фото') || lower.includes('300')) {
            reply = "🖼️ **Фото 300x200:** `OpenFileDialog` + проверка `PixelWidth`. Копируй в `Images/Products/` через `File.Copy()`, имя сохраняй в БД. Старое удали `File.Delete()`.";
        } else if (lower.includes('savechanges') || lower.includes('не сохраняется')) {
            reply = "💻 **Не сохраняется:** Вызови `db.SaveChanges();` после добавления или удаления!";

        // МОДУЛЬ 4 (РОЛИ И ЗАКАЗЫ)
        } else if (lower.includes('роль') || lower.includes('менеджер') || lower.includes('админ')) {
            reply = "🔐 **Роли:** `AddBtn.Visibility = Visibility.Collapsed;` если роль Гость или Менеджер. Передавай роль из окна логина в MainWindow.";
        } else if (lower.includes('заказ') || lower.includes('артикул')) {
            reply = "📦 **Заказы:** Создай OrdersWindow. Скрывай кнопки добавления/удаления, если роль != Администратор.";

        // ОШИБКИ
        } else if (lower.includes('null') || lower.includes('ссылка на объект')) {
            reply = "💻 **NullReference:** Проверь, что все `virtual` свойства загружены (LazyLoading).";
        } else if (lower.includes('вылетает') || lower.includes('краш')) {
            reply = "💻 **Падает:** В `App.xaml.cs` добавь `DispatcherUnhandledException` чтобы увидеть ошибку.";
        } else if (lower.includes('привет')) {
            reply = "Привет! Готов сдавать? Спрашивай.";
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
