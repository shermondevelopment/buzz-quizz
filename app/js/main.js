/*
/* Template CardQuizz
*/

const TemplateCardQuizz = (id, title, figure) => {
  return `
    <li data-id="${id}" onclick="openedQuizz(this)">
      <figure class="figure-quizz">
        <img class="figure-img" src="${figure}"
          alt="simpson" />
        <div class="figure-gradient">
        </div>
        <figcaption class="quizz-title">${title}
        </figcaption>
      </figure>
    </li>
  `
}


/* Função de Consulta do Tipo GET */

const  queryGetApi = async (router) => {
  const queryUrl = await fetch(`https://mock-api.driven.com.br/api/v4/buzzquizz/${router}`);
  const queryResponseJson = await queryUrl.json()
  return queryResponseJson
}

/* Função selectElement seleciona elementos html */

const selectElement = (element, type) => {
  return (type === 'all') ? document.querySelectorAll(element) : document.querySelector(element);
}

/* Função renderCardQuizzScreen renderiza elementos na tela */

const renderCardQuizzScreen = async () =>  {
  const quizzContainer = selectElement('.list-quizz-area > .list-quizz > ul', 'single')
  const quizzes = await queryGetApi('quizzes')
  quizzes.forEach( item => {
    quizzContainer.innerHTML += TemplateCardQuizz(item.id, item.title, item.image)
  } )
}

/*
/* No momento do click do quiz a função openedQuizz e chamada colocando o
*/

function openedQuizz(elementQuizz) {
 const sectionListQuizzToInvisible = selectElement('.add-quizz', 'single')
 const quizzQuestion = selectElement('.quiz-questions', 'single')
 /* esconde a lista de quizz */
 makeElementInivisble(sectionListQuizzToInvisible, true)
 /* mostra um unico quizz */
 makeElementInivisble(quizzQuestion, false)
}

const makeElementInivisble = (element, invisible) => {
  invisible ? element.style.display = "none" : element.style.display = "block"
}

renderCardQuizzScreen()