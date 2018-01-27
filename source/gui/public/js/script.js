;(function(global, document, undefined) {
  const linkShortener = (function() {
    let
      mainForm, hrefField, aliasField, resultField,
      submitButton, copyToClipboardButton, resultBlock;

    const initUI = () => {
      hrefField = $('#href');
      aliasField = $('#alias');
      resultField = $('#result-link');
      submitButton = $('#submit-button');
      mainForm = $('#mainForm');
      copyToClipboardButton = $('#copyToClipboard');
      resultBlock = $('#result-block');

      // Подсказка справа в блоке ввода сокращенной ссылки
      $('#alias-helper').popover({
        trigger: 'hover',
        placement: 'left',
        container: 'body',
        content:
          'Допускаются только латинские и кириллические буквы, цифры, минус \
          и подчеркивание',
        title: 'Ограничения'
      });

      const validatorOpts = {
        delay: 300,
        custom: {
          href: function($el) {
            const href = $el.val().trim();

            switch (true) {
              case !(/\w+\.\w+/.test(href)):
                return 'Это не похоже на ссылку!';
              case /^(https?:\/\/)?short\.taxnuke\.ru\/./.test(href):
                return 'Это может привести к зацикливанию, не дурите, пожалуйста :)';
            }
          },
          alias: function($el) {
            const alias = $el.val().trim();

            if (!(/^[a-zA-zа-яА-Я\d\._-]+$/.test(alias))) {
              return 'Запрещенные символы, справа есть подсказка!';
            }
          }
        }
      };
      $(mainForm).validator(validatorOpts);
      $(submitButton).on('click', submit);

      $(copyToClipboardButton).on('click', copyToClipboard);
    };

    const copyToClipboard = () => {
      document.getElementById('result-link').select();
      document.execCommand('Copy');
    };

    const notify = (message) => {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message
      },{
        type: 'danger',
        placement: {
          from: 'bottom',
          align: 'center'
        },
        delay: 1000,
        timer: 1000
      });
    };

    const submit = () => {
      if ($(mainForm).data('bs.validator').validate().hasErrors()) {
        return;
      }

      const
        href = hrefField.val(),
        alias = aliasField.val();

      let data = {href};

      if (alias) {
          data.name = alias;
      }

      $.ajax({
        url: 'https://short.taxnuke.ru/api/v1/aliases?lang=ru',
        dataType: 'json',
        method: 'POST',
        data: data,
        cache: false,
        beforeSend: () => {
          if ($(submitButton).hasClass('disabled')) {
            return false;
          } else {
            $(submitButton).val('Обработка...');
            $(submitButton).addClass('disabled');
            $(resultBlock).slideUp(500);
          }
        },
        success: (data) => {
          if (data.status === 'ok') {
            resultField.val('short.taxnuke.ru/' + data.payload.name);
            $(resultBlock).slideDown(250);
          } else {
            notify(data.reason);
          }
        },
        error: (data) => {
          if (data.status !== 404) {
            var responseJSON = data.responseJSON;
            console.error(responseJSON);
          } else {
            notify('Что-то пошло очень не так, сервер не ответил');
          }
        },
        complete: () => {
          $(submitButton).removeClass('disabled');
          $(submitButton).val('Сократить');
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
