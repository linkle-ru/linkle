<template>
  <VFooter class="pa-3 body-2">
    <div>
      &copy; {{ new Date().getFullYear() }}
      <a
        href="https://vk.com/taxnuke"
        target="_blank"
      >
        Семён Фомин
      </a>
    </div>
    <VSpacer />
    <VDialog
      v-model="licenseAgreement"
      width="600px"
    >
      <VCard>
        <VCardTitle>
          <span class="headline">
            Пользовательское соглашение
          </span>
        </VCardTitle>
        <VCardText>
          <ol>
            <li>
              Пользуясь этим ресурсом, я соглашаюсь с тем, что не буду
              использовать его для рассылки спама,
              вредноносного программного обеспечения, распространения и
              приобретения запрещенных законодательством
              РФ материалов в любой форме.
            </li>
            <li>
              Автор данного ресурса оставляет за собой право распоряжаться
              моими сокращенными ссылками (удалять,
              подменять содержимое, удалять), в случае, если они не удовлетворяют
              требованиям настоящего
              пользовательского соглашения.
            </li>
            <li>
              Взаимодействие с данным ресурсом я произвожу на свой страх и
              риск, автор не несёт никакой
              ответственности за прямой или косвенный ущерб, причененный путём
              использованием данного ресурса мной
              или кем-либо.
            </li>
            <li>
              При обнаружении вредноносной ссылки я обязаюсь сообщить о
              ней автору ресурса по электронному
              адресу
              <a href="mailto:bad-link@taxnuke.ru">
                bad-link@taxnuke.ru
              </a>
            </li>
          </ol>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="green darken-1"
            flat="flat"
            @click="licenseAgreement = false"
          >
            Закрыть
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <a
      href="#"
      @click="licenseAgreement = true"
    >
      Оферта
    </a>
    <a
      class="ml-2"
      href="https://github.com/taxnuke/url-shortener/blob/master/README.md"
      target="_blank"
    >
      API
    </a>
  </VFooter>
</template>

<script>
export default {
  data: () => ({
    licenseAgreement: false
  })
}
</script>
