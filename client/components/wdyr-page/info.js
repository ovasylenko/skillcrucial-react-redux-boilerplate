import React from 'react'

const Info = () => {
  return (
    <article className="w-full max-w-screen-xl px-3 py-2 bg-gray-50 text-gray-600">
      <h1 className="text-2xl mb-2">Проблема повторного рендера компонентов</h1>
      <section className="text-gray-700">
        <p className="my-3">
          Чтобы получить максимальную производительность своего React-приложения, необходимо следить
          за тем, чтобы перерендеринг компонентов не выполнялся произвольно, без сопутствующего
          обновления данных.
        </p>
        <p className="my-3">
          Для того, чтобы не упустить из вида нежелательный перерендер компонентов, существует
          библиотека{' '}
          <a
            className="text-blue-500 hover:text-blue-600"
            href="https://github.com/welldone-software/why-did-you-render"
          >
            why-did-you-render
          </a>
          .
        </p>
        <p className="my-3">
          Ее подключение подробно описано по ссылке. <b>WDYR</b> уже интегрирован в boilerplate и
          будет автоматически добавлять сообщения в консоль, если выполняется рендер какого-либо
          компонента. Обращаясь к данным в консоли, вы сможете отследить и исключить нежелательные
          рендеры.
        </p>
        <p className="my-3">
          Для того, чтобы добавить компонент в список отслеживаемых, добавьте к нему перед экспортом
          свойство <b>whyDidYouRender=true</b>.
        </p>
        <p className="my-3">
          Чтобы увидеть работу библиотеки воочую, откройте консоль и несколько раз нажмите на кнопку
          ниже. Пропсы меняются не для всех компонентов, но вместе с этим нежелательный перерендер
          происходит.
        </p>
        <p className="my-3">
          <b>Важно: WDYR</b> нельзя использовать на продакшне, потому как он замедляет работу
          приложения. Если в режиме разработки вы ничего не видите, убедитесь, что в переменных
          окружения значение для <b>NODE_ENV=development</b>.
        </p>
      </section>
    </article>
  )
}

Info.propTypes = {}

export default Info
