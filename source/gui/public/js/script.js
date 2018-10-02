'use strict';

(function (global, document, undefined) {
  // todo: отрефакторить
  // todo: перегонять галпом в es5
  var linkShortener = function () {
    var mainForm, hrefField, aliasField, resultField, submitButton, copyToClipboardButton, resultBlock

    var initUI = function initUI() {
      hrefField = $('#href')
      aliasField = $('#alias')
      resultField = $('#result-link')
      submitButton = $('#submit-button')
      mainForm = $('#mainForm')
      copyToClipboardButton = $('#copyToClipboard')
      resultBlock = $('#result-block') // Подсказка справа в блоке ввода сокращенной ссылки

      $('#alias-helper').popover({
        trigger: 'click',
        placement: 'left',
        container: 'body',
        content: 'Допускаются только латинские и кириллические буквы, цифры, минус \
          и подчеркивание',
        title: 'Ограничения'
      })
      var validatorOpts = {
        delay: 300,
        custom: {
          href: function href($el) {
            var href = $el.val().trim()

            switch (true) {
            case !/\w+\.\w+/.test(href):
              return 'Это не похоже на ссылку!'

            case /^(https?:\/\/)?short\.taxnuke\.ru\/./.test(href):
              return 'Это может привести к зацикливанию, не дурите, пожалуйста :)'
            }
          },
          alias: function alias($el) {
            var alias = $el.val().trim()

            if (!/^[a-zA-zа-яА-Я\d._-]+$/.test(alias)) {
              return 'Запрещенные символы, справа есть подсказка!'
            }
          }
        }
      }
      $(mainForm).validator(validatorOpts)
      $(submitButton).on('click', submit)
      $(copyToClipboardButton).on('click', copyToClipboard)
    }

    var copyToClipboard = function copyToClipboard() {
      document.getElementById('result-link').select()
      document.execCommand('Copy')
    }

    var notify = function notify(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'warning'
      $.notify({
        message: message
      }, {
        type: type,
        placement: {
          from: 'top',
          align: 'right'
        },
        delay: 1000,
        requestTimeout: 1000
      })
    }

    var submit = function submit() {
      if ($(mainForm).data('bs.validator').validate().hasErrors()) {
        return
      }

      var href = hrefField.val(),
        alias = aliasField.val()
      var data = {
          href: href
        },
        requestTimeout

      if (alias) {
        data.name = alias
      }

      $.ajax({
        url: '/api/v1/aliases?lang=ru',
        dataType: 'json',
        method: 'POST',
        data: data,
        cache: false,
        beforeSend: function beforeSend() {
          if ($(submitButton).hasClass('disabled')) {
            return false
          } else {
            requestTimeout = setTimeout(function () {
              return notify('Сервис немного залежался, ещё пару секунд...', 'info')
            }, 2000)
            $(submitButton).val('Обработка...')
            $(submitButton).addClass('disabled')
            $(resultBlock).slideUp(500)
          }
        },
        success: function success(data) {
          if (data.status === 'ok') {
            resultField.val(''.concat(window.location.host, '/').concat(data.payload.name))
            $(resultBlock).slideDown(250)
          } else {
            notify(data.reason)
          }
        },
        error: function error(data) {
          if (data.status !== 404) {
            notify('Что-то пошло очень не так, сервер не ответил', 'danger')
          } else {
            var responseJSON = data.responseJSON
            notify(responseJSON, 'danger') // todo: кидать исключение
            // console.error(responseJSON)
          }
        },
        complete: function complete() {
          clearTimeout(requestTimeout)
          $(submitButton).removeClass('disabled')
          $(submitButton).val('Сократить')
        }
      })
    }
    /**
      * Публичный API
      */


    return {
      initUI: initUI
    }
  }()

  $(document).ready(function () {
    linkShortener.initUI()
  })
})(window, window.document)