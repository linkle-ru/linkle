<template>
  <v-footer class="pa-3 body-2">
    <div>&copy; {{ new Date().getFullYear() }} Семён Фомин</div>
    <v-spacer/>
    <v-dialog
      v-model="licenseAgreement"
      width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Пользовательское соглашение</span>
        </v-card-title>
        <v-card-text>
          <ol>
            <li>
              Пользуясь этим ресурсом, я соглашаюсь с тем, что не буду использовать его для рассылки спама,
              вредноносного программного обеспечения, распространения и приобретения запрещенных законодательством
              РФ материалов в любой форме.
            </li>
            <li>Автор данного ресурса оставляет за собой право распоряжаться моими сокращенными ссылками (удалять,
            подменять содержимое, удалять), в случае, если они не удовлетворяют требованиям настоящего
            пользовательского соглашения.
            </li>
            <li>Взаимодействие с данным ресурсом я произвожу на свой страх и риск, автор не несёт никакой
            ответственности за прямой или косвенный ущерб, причененный путём использованием данного ресурса мной
            или кем-либо.
            </li>
            <li>При обнаружении вредноносной ссылки я обязаюсь сообщить о ней автору ресурса по электронному
            адресу
              <a href="mailto:bad-link@taxnuke.ru">
                bad-link@taxnuke.ru
              </a>
            </li>
          </ol>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="licenseAgreement = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <a
      href="#"
      @click="licenseAgreement = true">Пользовательское соглашение</a>
    <a
      class="ml-2"
      href="https://github.com/taxnuke/url-shortener/blob/master/README.md"
      target="_blank">Документация и REST API
    </a>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    licenseAgreement: false
  })
}
</script>
