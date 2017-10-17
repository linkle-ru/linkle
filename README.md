> Это еще совсем сырой набросок сервиса

## Как собрать и развернуть проект
```sh
npm install;
npm start;
```

## TODO
- [ ] Любой пользователь без регистрации может сжимать ссылки
- [ ] Зарегистрированный пользователь может видеть аналитику ссылок (переходы, устройства, местоположения)
- [ ] Пользователь видит свои последние сокращенные ссылки, даже без регистрации (основываясь на cookie)
- [ ] Пользователь может изменить адрес, на который перенаправляет короткая ссылка после её создания
- [ ] В GUI при заходе с непустым буфером обмена, происходит автоматическая вставка содержимого для сжатия

## Проблемы

* Невозможно создать короткую ссылку с алиасом `gui`, потому что это роут для вывода графического интерфейса

# HTTP-API v1

### Алиасы

#### Перейти по имени алиаса

##### GET [https://links.taxnuke.ru/<имя>](#) или GET [https://links.taxnuke.ru/api/v1/goto/<имя>](#)

#### Создать новый алиас

##### POST [https://links.taxnuke.ru/api/v1/aliases](#)
> Тело запроса:
```json
{
    "name": "гугл",
    "href": "http://google.com"
}
```
> Тело ответа должно совпасть с телом запроса
