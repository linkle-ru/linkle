;(function(global, document, undefined) {
  const linkShortener = (function() {
    let hrefInput, aliasInput, resultInput;

    const initUI = () => {
      // Подсказка справа в блоке ввода сокращенной ссылки
      $('#nigger').popover({
        trigger: 'hover',
        placement: 'left',
        container: 'body',
        content:
          'Допускаются только латинские и кириллические буквы, цифры, минус \
          и подчеркивание',
        title: 'Ограничения'
      });

      $('#mainForm').validator().on('submit', submit);

      $('#copyToClipboard').on('click', copyToClipboard);

      hrefInput = $('#href');
      aliasInput = $('#alias');
      resultInput = $('#result-link');
    };

    const copyToClipboard = () => {
      document.getElementById('result-link').select();
      document.execCommand('Copy');
    };

    const submit = (e) => {
      if (e.isDefaultPrevented()) {
        return;
      }

      const
        href = hrefInput.val(),
        alias = aliasInput.val();

      let data = {href};

      if (alias) {
          data.name = alias;
      }

      $('#result-area').slideUp();
      $('#result-block').fadeOut();

      $.ajax({
        'url': 'https://short.taxnuke.ru/api/v1/aliases?lang=ru',
        'dataType': 'json',
        'method': 'POST',
        'data': data,
        'cache': false,
        'success': function(data) {
          $('#result-area').slideDown();
          if (data.status === 'ok') {
            resultInput.val('short.taxnuke.ru/' + data.payload.name);
          } else {
            alert(data.reason);
          }
        },
        'error': function(data) {
          if (data.status !== 404) {
            var responseJSON = data.responseJSON;
            console.error(responseJSON);
          } else {
            console.error('Что-то пошло очень не так, сервер не ответил');
          }
        }
      });
    };

    /**
     * Публичный API
     */
     return {initUI};
   })();

   $(document).ready(function() {
     linkShortener.initUI();
   });
 })(window, window.document);
