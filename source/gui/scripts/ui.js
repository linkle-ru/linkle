'use strict'

let mainForm
let hrefField
let aliasField
let resultField
let submitButton
let copyToClipboardButton
let resultBlock

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

  $(mainForm).validator({
    delay: 300,
    custom: require('./customValidators')
  })

  $(submitButton).on('click', submit)
  $(copyToClipboardButton).on('click', copyToClipboard)
}

function copyToClipboard() {
  // todo: не работает на мобиле
  document.getElementById('result-link').select()
  document.execCommand('Copy')
}

/**
 * Обертка над jquery notify
 * @param message
 * @param type
 */
function notifyWrapper(message, type = 'warning') {
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

  const href = hrefField.val()
  const alias = aliasField.val()

  let data = { href }
  let requestTimeout

  if (alias) {
    data.name = alias
  }

  $.ajax({
    url: '/api/v1/aliases?lang=ru',
    dataType: 'json',
    method: 'POST',
    data: data,
    cache: false,
    beforeSend: beforeSendAjax,
    success: onSuccessAjax,
    error: onErrorAjax,
    complete: onCompleteAjax
  })

  function onCompleteAjax() {
    clearTimeout(requestTimeout)
    $(submitButton).removeClass('disabled')
    $(submitButton).val('Сократить')
  }

  function onErrorAjax(data) {
    if (data.status !== 404) {
      notifyWrapper('Что-то пошло очень не так, сервер не ответил', 'danger')
    } else {
      notifyWrapper(data.responseJSON, 'danger')
      // todo: кидать исключение
      // console.error(responseJSON)
    }
  }

  function onSuccessAjax(data) {
    if (data.status === 'ok') {
      resultField.val(`${window.location.host}/${data.payload.name}`)
      $(resultBlock).slideDown(250)
    } else {
      notifyWrapper(data.reason)
    }
  }

  function beforeSendAjax() {
    if ($(submitButton).hasClass('disabled')) {
      return false
    } else {
      requestTimeout = setTimeout(() => notifyWrapper(
        'Сервис немного залежался, ещё пару секунд...',
        'info'
      ), 2000)
      $(submitButton).val('Обработка...')
      $(submitButton).addClass('disabled')
      $(resultBlock).slideUp(500)
    }
  }
}

module.exports.init = initUI
