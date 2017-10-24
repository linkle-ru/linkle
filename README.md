[![Build Status](https://travis-ci.org/taxnuke/url-shortener.svg?branch=master)](https://travis-ci.org/taxnuke/url-shortener)
[![Maintainability](https://api.codeclimate.com/v1/badges/76293fe51f0b69fa5afe/maintainability)](https://codeclimate.com/github/taxnuke/url-shortener/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/76293fe51f0b69fa5afe/test_coverage)](https://codeclimate.com/github/taxnuke/url-shortener/test_coverage)
[![GitHub issues](https://img.shields.io/github/issues/taxnuke/url-shortener.svg)](https://github.com/taxnuke/url-shortener/issues)
[![GitHub license](https://img.shields.io/github/license/taxnuke/url-shortener.svg)](https://github.com/taxnuke/url-shortener/blob/master/LICENSE)
---

# REST-API

> Все общение с API происходит в зашифрованном виде по протоколу SSL. Это значит, что все URL к API должны содержать протокол HTTPS.

#### Перейти по короткой ссылке (далее _"алиасу"_)

##### `GET` [https://short.taxnuke.ru/<алиас>](#)

#### Получить содержимое алиаса

##### `GET` [https://short.taxnuke.ru/api/v1/aliases/<алиас>](#)

#### Создать алиас

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

### Ответы сервера
#### Успех
```json
{
    "status":"ok",
    "payload": "<запрошенные данные>"
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

> язык сообщения в `reason` определяется url-параметром `lang`, кроме его дефолтного значения (`en`) поддерживается также `ru`

### Коды ошибок

#### Группа `v`
> Ошибки валидации

|  код |                           сообщение                        |
|------|------------------------------------------------------------|
| `v0` | имя алиаса слишком длинное                                 |
| `v1` | имя алиаса занято                                          |
| `v2` | имя алиаса содержит странные символы                       |
| `v3` | сокращаемая ссылка слишком длинна                          |
| `v4` | сокращаемая ссылка пуста                                   |
| `v5` | имя алиаса пустое                                          |
| `v7` | запрещенное имя алиаса                                     |
| `v8` | сокращаемая ссылка может привести к бесконечному редиректу |

#### Группа `d`
> Ошибки данных

|  код |                           сообщение                         |
|------|-------------------------------------------------------------|
| `d0` | алиас не найден в базе                                      |

## Как собрать и развернуть проект
```sh
npm install;
npm start;
```
