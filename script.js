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

// =============== ЧАТ-БОТ (МЕГА-БАЗА ЗНАНИЙ) ===============
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
        let reply = "Я не нашел точного совпадения в базе знаний. Опиши проблему по-другому. Например, используй слова: 'ошибка', 'не работает', 'xaml', 'sql', 'картинки', 'ключи', 'сохранение'.";
        const lower = text.toLowerCase();

        // ==========================================
        // БЛОК 1: БАЗА ДАННЫХ (DB Browser & SQL)
        // ==========================================
        if (lower.includes('база') || lower.includes('sql') || lower.includes('db browser') || lower.includes('бд')) {
            reply = "🗄️ **БД:** 1) Сохраняй Excel в 'CSV UTF-8'. 2) При импорте проверь типы: Цена = REAL, ID = INTEGER. 3) Не забудь нажать 'Write Changes' (Записать изменения) после всех манипуляций!";
        } else if (lower.includes('csv') || lower.includes('excel') || lower.includes('xlsx')) {
            reply = "🗄️ **Excel -> CSV:** Открой Excel -> Файл -> Сохранить как -> Тип: 'CSV UTF-8'. Иначе русские буквы сломаются.";
        } else if (lower.includes('кракозябр') || lower.includes('кодировк') || lower.includes('иероглиф')) {
            reply = "🗄️ **Кракозябры:** Ты сохранил CSV не в UTF-8. Пересохрани файл в Excel, выбрав 'CSV UTF-8'. В DB Browser при импорте тоже выбери UTF-8.";
        } else if (lower.includes('слиплось') || lower.includes('один столбец') || lower.includes('разделител')) {
            reply = "🗄️ **Один столбец:** В Excel не тот разделитель. При импорте в DB Browser смени разделитель с запятой (,) на точку с запятой (;).";
        } else if (lower.includes('no such table') || lower.includes('таблица не найдена')) {
            reply = "🗄️ **No such table:** Программа не видит базу. 1) В свойствах database.db в VS стоит 'Копировать всегда'. 2) Правильно ли написано имя таблицы? (Например, `db.Products`).";
        } else if (lower.includes('database is locked') || lower.includes('база заблокирована')) {
            reply = "🗄️ **База заблокирована:** Закрой DB Browser for SQLite! Если программа использует базу, DB Browser не даст тебе изменить таблицы.";
        } else if (lower.includes('foreign key') || lower.includes('внешний ключ') || lower.includes('ограничение')) {
            reply = "🗄️ **Foreign Key Error:** Ты пытаешься удалить категорию, на которую ссылается товар. Либо удали сначала товары, либо в DB Browser (Database Structure -> Изменить таблицу -> Foreign Keys) поставь 'ON DELETE CASCADE'.";
        } else if (lower.includes('primary key') || lower.includes('составной ключ')) {
            reply = "🗄️ **Ключи:** Первичный ключ (PK) должен быть уникальным. Для склада (stock_items) выдели ДВА столбца (product_id и size_id) и нажми кнопку ключа внизу, чтобы сделать составной ключ.";

        // ==========================================
        // БЛОК 2: SCAFFOLD & ENTITY FRAMEWORK
        // ==========================================
        } else if (lower.includes('scaffold') || lower.includes('модели') || lower.includes('генерац')) {
            reply = "⚙️ **Scaffold:** Консоль диспетчера пакетов (Вид -> Другие окна). Вставь: \n`Scaffold-DbContext \"Data Source=database.db\" Microsoft.EntityFrameworkCore.Sqlite -OutputDir Models -Force`\nЕсли не работает, проверь, установлены ли пакеты Sqlite и Tools.";
        } else if (lower.includes('context') || lower.includes('does not exist') || lower.includes('не найден')) {
            reply = "⚙️ **Context не найден:** В самом верху файла напиши `using ИмяТвоегоПроекта.Models;`. Убедись, что имя проекта совпадает!";
        } else if (lower.includes('lazyloading') || lower.includes('ленивая') || lower.includes('virtual')) {
            reply = "⚙️ **Ленивая загрузка:** В файле Context.cs добавь `optionsBuilder.UseLazyLoadingProxies();`. Во всех моделях (Category, Manufacturer) перед свойствами напиши слово `virtual`.";
        } else if (lower.includes('nuget') || lower.includes('пакет')) {
            reply = "⚙️ **NuGet:** ПКМ по проекту -> Управление пакетами NuGet. Нужно установить: `Microsoft.EntityFrameworkCore.Sqlite` и `Microsoft.EntityFrameworkCore.Proxies`.";
        } else if (lower.includes('framework')) {
            reply = "⚙️ **Не тот .NET:** Ты создал проект на старом .NET Framework. Нужен просто .NET (6, 7 или 8). Удали проект и создай заново по шаблону 'Приложение WPF (.NET)'.";

        // ==========================================
        // БЛОК 3: C# И ОШИБКИ ЛОГИКИ
        // ==========================================
        } else if (lower.includes('nullreference') || lower.includes('null') || lower.includes('ссылка на объект')) {
            reply = "💻 **NullReferenceException:** У объекта нет значения. Например, у товара нет категории. Используй `?.` (например, `p.Category?.Name`) или проверяй на `null` через `if`.";
        } else if (lower.includes('format') || lower.includes('parse') || lower.includes('строку в число')) {
            reply = "💻 **Ошибка формата (Parse):** Ты пытаешься перевести буквы в число. Используй `decimal.TryParse(PriceBox.Text, out decimal price)` или оберни в `try-catch`.";
        } else if (lower.includes('convert') || lower.includes('cannot implicitly') || lower.includes('string to int')) {
            reply = "💻 **Ошибка типов:** Нельзя вставить строку в число. Используй `Convert.ToInt32()` или `int.Parse()` для чисел и `.ToString()` для текста.";
        } else if (lower.includes('savechanges') || lower.includes('не сохраняется') || lower.includes('пропадает')) {
            reply = "💻 **Не сохраняется:** После `db.Products.Add()` или `Remove()` ОБЯЗАТЕЛЬНО вызывай `db.SaveChanges();`. Без этого база не обновится!";
        } else if (lower.includes('вылетает') || lower.includes('краш') || lower.includes('закрывается')) {
            reply = "💻 **Программа падает:** Открой App.xaml.cs и вставь перехватчик ошибок (DispatcherUnhandledException), чтобы увидеть текст ошибки в MessageBox. Иначе ты не поймешь, что сломалось.";
        } else if (lower.includes('disposed') || lower.includes('context has been disposed')) {
            reply = "💻 **Context disposed:** Ты используешь `using (var db = ...)` слишком долго. Контекст закрывается после конца блока. Создавай новый контекст внутри каждой кнопки или используй один глобальный `private Context db = new Context();`";
        } else if (lower.includes('sum') || lower.includes('пустой список') || lower.includes('list empty')) {
            reply = "💻 **Ошибка при Sum():** Если у товара нет складских позиций, `Sum()` выдаст ошибку. Используй `p.StockItems.Sum(s => s.Quantity) ?? 0` или `p.StockItems.Any() ? ... : 0`.";

        // ==========================================
        // БЛОК 4: XAML И ИНТЕРФЕЙС (WPF)
        // ==========================================
        } else if (lower.includes('binding') || lower.includes('привязк')) {
            reply = "🖱️ **Ошибки Binding:** В XAML `{Binding Name}` ищет в C# поле `public string Name { get; set; }`. Если имена не совпадают — ничего не выведется. Смотри вкладку 'Вывод' (Output) в VS.";
        } else if (lower.includes('xaml') || lower.includes('верстк') || lower.includes('разметк')) {
            reply = "🖱️ **XAML ошибка:** Проверь закрытие тегов (каждый `<Grid>` должен иметь `</Grid>` или `/>`). Свойства пишутся внутри тегов.";
        } else if (lower.includes('кнопк') || lower.includes('click') || lower.includes('не нажимается')) {
            reply = "🖱️ **Кнопка не работает:** В XAML у кнопки должно быть `Click=\"ИмяМетода_Click\"`. В C# должен быть метод с ТОЧНО ТАКИМ ЖЕ именем.";
        } else if (lower.includes('listview') || lower.includes('список') || lower.includes('itemtemplate')) {
            reply = "🖱️ **ListView пустой:** Проверь `ProductList.ItemsSource = products;`. Если не добавить `ItemTemplate` с `DataTemplate`, список покажет классы (ChudoObuv.Models.Product) вместо данных.";
        } else if (lower.includes('combobox') || lower.includes('выпадающий')) {
            reply = "🖱️ **ComboBox:** Если вылетает ошибка при смене роли, добавь проверку `if (RoleSelector.SelectedItem == null) return;`. При выборе он может вернуть null.";
        } else if (lower.includes('grid') || lower.includes('наложение') || lower.includes('съехало')) {
            reply = "🖱️ **Наложение элементов:** Используй `StackPanel` (для вертикального списка) или `Grid` с `RowDefinitions`. Не ставь всем элементам жесткие `Margin`, они могут наезжать друг на друга.";

        // ==========================================
        // БЛОК 5: КАРТИНКИ И РЕСУРСЫ
        // ==========================================
        } else if (lower.includes('картинк') || lower.includes('фото') || lower.includes('image') || lower.includes('изображен')) {
            reply = "🖼️ **Картинки не грузятся:** 1) Выдели картинки в VS, в свойствах поставь 'Действие при сборке: Ресурс'. 2) В БД имя файла должно быть точно таким же (с учетом регистра), как на диске. 3) Путь: `/Images/Products/имя.jpg`.";
        } else if (lower.includes('picture.png') || lower.includes('заглушк')) {
            reply = "🖼️ **Заглушка:** Файл `picture.png` должен лежать прямо в папке `Images` (не в Products). И в коде путь должен быть `/Images/picture.png`.";

        // ==========================================
        // БЛОК 6: РОЛИ И ПРАВА ДОСТУПА
        // ==========================================
        } else if (lower.includes('роль') || lower.includes('менеджер') || lower.includes('админ') || lower.includes('скрыть')) {
            reply = "🔐 **Роли:** Используй `Visibility.Collapsed` (кнопка исчезает и не оставляет места) вместо `Hidden`. Например: `AddBtn.Visibility = Visibility.Collapsed;`.";
        } else if (lower.includes('авторизац') || lower.includes('логин') || lower.includes('пароль')) {
            reply = "🔐 **Авторизация:** Найди пользователя в БД по логину: `var user = db.Users.FirstOrDefault(u => u.Login == login)`. Если user != null — пускай в систему, сохрани его роль в переменную и скрой кнопки.";

        // ==========================================
        // БЛОК 7: ПРОЧЕЕ
        // ==========================================
        } else if (lower.includes('эр') || lower.includes('диаграмм') || lower.includes('draw')) {
            reply = "📊 **ER-диаграмма:** В DB Browser: Файл -> Экспорт -> База данных в SQL. Сними галочки с INSERT. Открой draw.io -> Упорядочить -> Вставить -> Расширенные -> SQL.";
        } else if (lower.includes('привет') || lower.includes('здравствуй')) {
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
