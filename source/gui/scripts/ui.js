'use strict'

const validators = require('../../helpers/validators')

let mainForm
let hrefField
let aliasField
let resultField
let submitButton
let copyToClipboardButton
let resultBlock

const validatorOpts = {
  delay: 300,
  custom: {
    href: function ($el) {
      const href = $el.val().trim()

      switch (true) {
      case !(validators.regexes.href.test(href)):
        return 'Это не похоже на ссылку!'
      case validators.regexes.noLoopHref.test(href):
        return 'Это может привести к зацикливанию, не дурите, пожалуйста :)'
      }
    },
    alias: function ($el) {
      const alias = $el.val().trim()

      if (!(validators.regexes.alias.test(alias))) {
        return 'Запрещенные символы, справа есть подсказка!'
      }
    }
  }
}

function initUI() {
  hrefField = $('#href')
  aliasField = $('#alias')
  resultField = $('#result-link')
  submitButton = $('#submit-button')
  mainForm = $('#mainForm')
  copyToClipboardButton = $('#copyToClipboard')
  resultBlock = $('#result-block')

  // Подсказка справа в блоке ввода сокращенной ссылки
  $('#alias-helper').popover({
    trigger: 'click',
    placement: 'left',
    container: 'body',
    content:
      'Допускаются только латинские и кириллические буквы, цифры, минус \
      и подчеркивание',
    title: 'Ограничения'
  })

  $(mainForm).validator(validatorOpts)
  $(submitButton).on('click', submit)
  $(copyToClipboardButton).on('click', copyToClipboard)
}

function copyToClipboard() {
  // todo: не работает на мобиле
  document.getElementById('result-link').select()
  document.execCommand('Copy')
}

function notify(message, type = 'warning') {
  $.notify({
    message
  }, {
    type,
    placement: {
      from: 'top',
      align: 'right'
    },
    delay: 1000,
    requestTimeout: 1000
  })
}

function submit() {
  if ($(mainForm).data('bs.validator').validate().hasErrors()) {
    return
  }

  const
    href = hrefField.val(),
    alias = aliasField.val()

  let data = { href }, requestTimeout

  if (alias) {
    data.name = alias
  }

  $.ajax({
    url: '/api/v1/aliases?lang=ru',
    dataType: 'json',
    method: 'POST',
    data: data,
    cache: false,
    beforeSend: () => {
      if ($(submitButton).hasClass('disabled')) {
        return false
      } else {
        requestTimeout = setTimeout(() => notify(
          'Сервис немного залежался, ещё пару секунд...',
          'info'
        ), 2000)
        $(submitButton).val('Обработка...')
        $(submitButton).addClass('disabled')
        $(resultBlock).slideUp(500)
      }
    },
    success: (data) => {
      if (data.status === 'ok') {
        resultField.val(`${window.location.host}/${data.payload.name}`)
        $(resultBlock).slideDown(250)
      } else {
        notify(data.reason)
      }
    },
    error: (data) => {
      if (data.status !== 404) {
        notify('Что-то пошло очень не так, сервер не ответил', 'danger')
      } else {
        var responseJSON = data.responseJSON
        notify(responseJSON, 'danger')
        // todo: кидать исключение
        // console.error(responseJSON)
      }
    },
    complete: () => {
      clearTimeout(requestTimeout)
      $(submitButton).removeClass('disabled')
      $(submitButton).val('Сократить')
    }
  })
}

module.exports.init = initUI
