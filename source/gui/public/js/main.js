$(document).ready(function() {
    const
        aliasInput = $('#short-link'),
        hrefInput = $('#long-link'),
        resultInput = $('#shortened-link'),
        mainForm = $('#main-form');

    // Навешиваем валидаторы на форму
    mainForm.validator({
        delay: 150,
        custom: {
            href: function($el) {
                let href = $el.val().trim();

                if (!(/\w+\.\w+/.test(href))) {
                    return 'Не похоже на ссылку!';
                }

                if (/\s/.test(href)) {
                    return 'Оставлен пробельный символ';
                }

                if (/^(https?:\/\/)?short\.taxnuke\.ru\/./.test(href)) {
                    return 'Это может привести к зацикливанию';
                }
            },
            alias: function($el) {
                let alias = $el.val();

                if (!(/^[a-zA-zа-яА-Я\d\._-]+$/.test(alias))) {
                    return 'Только латинский и кириллический алфавиты, цифры, - и _';
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

            const
                alias = aliasInput.val(),
                href = hrefInput.val();

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
                    resultInput.val('short.taxnuke.ru/' + data.payload.name);
                    $('#result-group').slideDown();
                },
                'error': function(data) {
                    resultInput.val(data.responseJSON.reason);
                    $('#result-group').slideDown();
                }
            });
        }
    });

    snowStorm.followMouse = false;
    snowStorm.animationInterval = 40;
    snowStorm.vMaxX = 4;
    snowStorm.vMaxY = 3;
});
