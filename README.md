[![Build Status](https://travis-ci.org/taxnuke/url-shortener.svg?branch=master)](https://travis-ci.org/taxnuke/url-shortener)
---

# REST-API

> Все общение с API происходит в зашифрованном виде по протоколу SSL. Это значит, что все URL к API должны содержать протокол HTTPS.

#### Создать короткую ссылку (далее _"алиас"_)

##### `POST` [https://short.taxnuke.ru/api/v1/aliases](#)

Параметры:

* **name:** имя алиаса

* **href:** оригинальная ссылка

###### Пример
> Запрос:
`curl -d "name=гугл" -d "href=google.com" https://short.taxnuke.ru/api/v1/aliases`

> Тело ответа:
```json
{
    "name": "гугл",
    "href": "http://google.com"
}
```

#### Перейти по алиасу

##### `GET` [https://short.taxnuke.ru/<алиас>](#)

## Как собрать и развернуть проект
```sh
npm install;
npm start;
```

<!-- ## TODO -->
<!-- - [ ] Любой пользователь без регистрации может сжимать ссылки -->
<!-- - [ ] Зарегистрированный пользователь может видеть аналитику ссылок (переходы, устройства, местоположения) -->
<!-- - [ ] Пользователь видит свои последние сокращенные ссылки, даже без регистрации (основываясь на cookie) -->
<!-- - [ ] Пользователь может изменить адрес, на который перенаправляет короткая ссылка после её создания -->
<!-- - [ ] В GUI при заходе с непустым буфером обмена, происходит автоматическая вставка содержимого для сжатия -->

### Ответы сервера
#### Успех
```json
{
    "status":"ok",
    // ... и прочие данные по запросу
}
```

#### Неудача
```
{
    "status":"error",
    "code":"<код ошибки>",
    "reason": "<человекочитаемое сообщение>"
}
```

### Коды ошибок (пока в разработке)

#### Группа `v`
> Ошибки валидации входных данных, соответствуют группе статусов http 400

|  код |                           сообщение                         |
|------|-------------------------------------------------------------|
| `v1` | имя алиаса слишком длинное                                  |
| `v2` | имя алиаса занято                                           |
| `v3` | имя алиаса содержит странные символы                        |
| `v4` | сокращаемая ссылка слишком длинна                           |
| `v5` | сокращаемая ссылка пуста                                    |
| `v6` | имя алиаса пустое                                           |
| `v8` | сокращаемая ссылка может привести к бесконечному редиректу  |
| `v9` | запрещенное имя алиаса                                      |

## Проблемы

* Невозможно создать короткую ссылку с алиасом `gui`, потому что это роут для вывода графического интерфейса
