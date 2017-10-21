$(document).ready(function() {
    $('#main-form').submit(function(e) {
        e.preventDefault();

        const
            alias = $('#short-link').val(),
            href = $('#long-link').val();

        if (!href) {
            return;
        }

        let data = {
            'href': href
        };

        if (alias) {
            data.name = alias;
        }

        console.log(data);

        $.ajax({
            'url': '/api/v1/aliases/',
            'dataType': 'json',
            'method': 'POST',
            'data': data,
            'cache': false,
            'success': function(data) {
                console.log(data);
                $('#result-group input').val('short.taxnuke.ru/' + data.name);
                $('#result-group').slideDown();
            },
            'error': function(data) {
                // $('#result-group').slideDown();
                console.log(data.responseJSON);
            }
        });

    });
});
