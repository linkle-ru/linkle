$(document).ready(function() {
    // Открывает ссылку с README
    $('#read-docs').click(function(e) {
        e.preventDefault();
        window.open(
            'https://github.com/taxnuke/url-shortener/blob/master/README.md',
            '_blank'
        );
    });

    $('#main-form').submit(function(e) {
        e.preventDefault();

        $('#result-group').slideUp({duration: 100});

        const
            aliasInput = $('#short-link'),
            hrefInput = $('#long-link'),
            resultInput = $('#shortened-link');

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
    });
});
