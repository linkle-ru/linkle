$(document).ready(function() {
    const
        mainForm = $('#main-form'),
        shortLink = $('#short-link'),
        longLink = $('#long-link'),
        shortenedLink = $('#shortened-link');

    // Навешиваем валидаторы на форму
    mainForm.validator({
        delay: 150,
        custom: {
            href: function($el) {
                let href = $el.val().trim();

                switch (true) {
                    case !(/\w+\.\w+/.test(href)):
                        return 'Не похоже на ссылку!';
                    case /\s/.test(href):
                        return 'Оставлен пробельный символ';
                    case /^(https?:\/\/)?short\.taxnuke\.ru\/./.test(href):
                        return 'Это может привести к зацикливанию';
                }
            },
            alias: function($el) {
                let alias = $el.val();

                if (!(/^[a-zA-zа-яА-Я\d\._-]+$/.test(alias))) {
                    return 'Английские и русские буквы, арабские цифры, - и _';
                }
            }
        }
    });

    // Открывает ссылку с README
    $('#read-docs').click(function(e) {
        e.preventDefault();
        window.open(
            'https://github.com/taxnuke/url-shortener/blob/master/README.md',
            '_blank'
        );
    });

    // Обрабатываем отправку формы
    mainForm.validator().on('submit', function(e) {
        if (e.isDefaultPrevented()) {
            $('#result-group').slideUp({ duration: 500 });
        } else {
            e.preventDefault();

            $('#result-group').slideUp({ duration: 100 });
            $('#validation-err').fadeOut();

            const
                alias = shortLink.val(),
                href = longLink.val();

            if (!href) {
                return;
            }

            let data = {
                'href': href
            };

            if (alias) {
                data.name = alias;
            }

            $.ajax({
                'url': '/api/v1/aliases?lang=ru',
                'dataType': 'json',
                'method': 'POST',
                'data': data,
                'cache': false,
                'success': function(data) {
                    if (data.status === 'ok') {
                        shortenedLink.val('short.taxnuke.ru/' + data.payload.name);
                        $('#result-group').slideDown();
                    } else {
                        let failReason = data.reason;
                        $('#validation-err>span').html(failReason);
                        $('#validation-err').fadeIn();
                    }
                },
                'error': function(data) {
                    if (data.status !== 404) {
                        var responseJSON = data.responseJSON;
                        console.error(responseJSON);
                    } else {
                        console.error(
                            'Что-то пошло очень не так, сервер не ответил'
                        );
                    }
                }
            });
        }
    });

    snowStorm.followMouse = false;
    snowStorm.animationInterval = 40;
    snowStorm.vMaxX = 4;
    snowStorm.vMaxY = 3;
});
