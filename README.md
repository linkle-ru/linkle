[![Build Status](https://travis-ci.org/linkle-ru/linkle.svg?branch=master)](https://travis-ci.org/linkle-ru/linkle)
[![Maintainability](https://api.codeclimate.com/v1/badges/bdd94e84e90b6f705518/maintainability)](https://codeclimate.com/github/linkle-ru/linkle/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/bdd94e84e90b6f705518/test_coverage)](https://codeclimate.com/github/linkle-ru/linkle/test_coverage)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/linkle-ru/linkle/master)](https://stryker-mutator.github.io)
[![GitHub license](https://img.shields.io/github/license/linkle-ru/linkle.svg)](https://github.com/linkle-ru/linkle/blob/master/LICENSE)
---

# REST-API

> Все запросы нужно делать по протоколу HTTP**S**.

|                   Описание                    |   Метод   |                    Маршрут                       |
|-----------------------------------------------|-----------|--------------------------------------------------|
| Перейти по короткой ссылке (далее _"алиасу"_) | **`GET`** | [/<алиас>](#)                                    |
| Получить содержимое алиаса                    | **`GET`** | [/api/v1/aliases/<алиас>](#)                     |
| Получить содержимое списка алиасов            | **`GET`** | [/api/v1/aliases?list=<алиас>[, <алиас> ...]](#) |
| Создать алиас                                 | **`POST`**| [/api/v1/aliases](#)                             |

Параметры:

* **name:** имя алиаса

* **href:** оригинальная ссылка

###### Пример
> Запрос:
`curl -d "name=гугл" -d "href=google.com" https://linkle.ru/api/v1/aliases`

> Тело ответа:
```json
{
    "status":"ok",
    "payload": {
        "name": "гугл",
        "href": "http://google.com"
    }
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
| `v7` | ссылка некорректна                                         |
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

## Как задеплоить
```sh
npm run deploy
```

> Copyright (c) 2019 Semyon Fomin
>
> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> "Software"), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:
> 
> The above copyright notice and this permission notice shall be included
> in all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
