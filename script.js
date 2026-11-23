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
        let reply = "Я не нашел точного совпадения. Попробуй использовать другие слова. Например: 'картинки', 'база данных', 'Scaffold', 'SaveChanges', 'ошибка Null', 'программа вылетает', 'XAML', 'Binding', 'Ключи', 'Скидка'.";
        const lower = text.toLowerCase();

        // КЛЮЧИ И БД
        if (lower.includes('ключ') || lower.includes('связ') || lower.includes('fk') || lower.includes('pk')) {
            reply = "🗄️ **Ключи в БД:** Зайди в Database Structure -> Изменить таблицу. Галочка PK ставится для поля `id`. Для связей перейди на вкладку Foreign Keys -> Add и укажи, например, From: category_id, Table: categories, To: id.";
        } else if (lower.includes('база') || lower.includes('sql') || lower.includes('csv') || lower.includes('импорт') || lower.includes('бд')) {
            reply = "🗄️ **База данных:** Сохраняй Excel в формат 'CSV UTF-8'. В DB Browser при импорте проверь типы: Цена = REAL, ID/Кол-во = INTEGER. Не забудь нажать 'Записать изменения'!";
        } else if (lower.includes('кракозябр') || lower.includes('кодировк')) {
            reply = "🗄️ **Кракозябры:** Ты сохранил CSV не в UTF-8. Открой Excel заново и сделай 'Сохранить как' -> 'CSV UTF-8'. Проблема исчезнет.";
        } else if (lower.includes('слиплось') || lower.includes('один столбец')) {
            reply = "🗄️ **Слиплось в один столбец:** В Excel не тот разделитель. При импорте в DB Browser смени разделитель с запятой (,) на точку с запятой (;).";

        // СКИДКИ И ЦВЕТА
        } else if (lower.includes('скидк') || lower.includes('цена') || lower.includes('рубл')) {
            reply = "💰 **Скидка и рубли:** В C# используй `Cost = p.Price`. В XAML для рублей: `StringFormat={}{0:N2} руб.`. Для скидки: добавь поле `Discount` в запрос и выведи его красным цветом.";
        } else if (lower.includes('цвет') || lower.includes('подсветк') || lower.includes('фон')) {
            reply = "🎨 **Цвет фона:** В C# создай переменную `BgColor = p.StockItems.Sum(...) <= 3 ? 'LightCoral' : 'LightGray'`. В XAML привяжи её: `<Rectangle Fill=\"{Binding BgColor}\"/>`.";
            
        // ОСТАЛЬНОЕ
        } else if (lower.includes('scaffold') || lower.includes('модел')) {
            reply = "⚙️ **Scaffold:** Вид -> Другие окна -> Консоль диспетчера пакетов. Вставь: \n`Scaffold-DbContext \"Data Source=database.db\" Microsoft.EntityFrameworkCore.Sqlite -OutputDir Models -Force`";
        } else if (lower.includes('context') || lower.includes('does not exist')) {
            reply = "⚙️ **Context не найден:** Ты забыл `using ИмяТвоегоПроекта.Models;` в самом верху файла MainWindow.xaml.cs.";
        } else if (lower.includes('картинк') || lower.includes('фото') || lower.includes('image')) {
            reply = "🖼️ **Картинки:** 1) В свойствах картинок в VS должно быть 'Действие при сборке: Ресурс'. 2) Имя файла в БД должно совпадать с файлом в папке. 3) Путь: '/Images/Products/...'";
        } else if (lower.includes('nullreference') || lower.includes('null')) {
            reply = "💻 **NullReferenceException:** Ты пытаешься обратиться к пустому объекту. Проверь связи (virtual) или используй `?.` (например, p.Category?.Name).";
        } else if (lower.includes('не сохраняется') || lower.includes('savechanges')) {
            reply = "💻 **Не сохраняется:** Ты забыл вызвать `db.SaveChanges();` после `db.Products.Add()` или `Remove()`.";
        } else if (lower.includes('эр') || lower.includes('диаграмм') || lower.includes('draw')) {
            reply = "📊 **ER-диаграмма:** Экспортируй схему из DB Browser (Файл -> Экспорт -> SQL). В draw.io: Упорядочить -> Вставить -> Расширенные -> SQL.";
        } else if (lower.includes('привет')) {
            reply = "Привет! Готов сдавать? Я знаю ответы на большинство ошибок. Спрашивай про ключи, скидки, картинки или код.";
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
