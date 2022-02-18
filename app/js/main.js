/*
/* Template CardQuizz
*/

const TemplateCardQuizz = (props) => {
    return `
    <li data-id="${props.id}" onclick="openedQuizz(this)">
      <figure class="figure-quizz">
        <img class="figure-img" src="${props.image}"
          alt="simpson" />
        <div class="figure-gradient">
        </div>
        <figcaption class="quizz-title">
         ${props.title}
        </figcaption>
      </figure>
    </li>
  `
}

const TemplateAnswers = (answers) => {
  return `
      <div class="question-image d-flex flex-direction-column" data-correct=${answers.isCorrectAnswer}>
          <img src="${answers.image}"
              alt="question" class="" />
          <span class="title-image">${answers.text}</span>
      </div>
  `
}

/*
/* Template Quizz Questions
*/

const TemplateQuizzQuestion = (props, answers) => {
  return `
      <section class="questions" data-id=${props.id} onclick="checkAnswer()">
        <div class="question-title d-flex justify-content-center align-items-center">
            <h2>${props.title}</h2>
        </div>
        <div class="question-area-images d-flex flex-wrap-wrap justify-content-between">
            ${answers.map( item => TemplateAnswers(item) )}
        </div>
     </section>
  `
}

/* Função de Consulta do Tipo GET */

const queryGetApi = async(router) => {
    const queryUrl = await fetch(`https://mock-api.driven.com.br/api/v4/buzzquizz/${router}`);
    const queryResponseJson = await queryUrl.json()
    return queryResponseJson
}

/* Função selectElement seleciona elementos html */

const selectElement = (element, type) => {
    return (type === 'all') ? document.querySelectorAll(element) : document.querySelector(element);
}

/* Função renderCardQuizzScreen renderiza elementos na tela */

const renderTemplateScreen = async (element, fetchRouter, callbackTemplate) => {
    const routerRequest = await queryGetApi(fetchRouter)
    routerRequest.forEach(item => {
        element.innerHTML += callbackTemplate(item)
    })
}

const renderTemplateQuestion = async (element, fetchRouter, callbackTemplate) => {
  const routerRequest = await queryGetApi(fetchRouter)
  console.log(routerRequest)
  const { id, title, image } = routerRequest
  defineProperyQuizz(title, image)
  routerRequest.questions.forEach(item => {
      element.innerHTML += callbackTemplate({id, title, image}, item.answers).replace(/,/g, '')
  })
}

/*
/* No momento do click do quiz a função openedQuizz e chamada colocando o
*/

function openedQuizz(element) {
    /* Esconde o elemento sectionListQuizzToInvisible */
    makeElementInivisble( selectElement('.add-quizz', 'single'), true)
    /* Mostra o elemento questionQuizz */
    makeElementInivisble(selectElement('.quiz-questions', 'single'), false)
    
    renderTemplateQuestion(selectElement('.quiz-questions-area', 'single'), `quizzes/${element.dataset.id}`, TemplateQuizzQuestion)
}

/*
/* makeElementInvisible mostra e esconde o elemento especificado nos parametros 
*/

const makeElementInivisble = (element, invisible) => {
    invisible ? element.style.display = "none" : element.style.display = "block"
}

/*
/* Define Propery of Quizz
/* Ex: title, image
*/

const defineProperyQuizz = (title, image) => {
  selectElement('.title-quizz', 'single').innerHTML = title
  selectElement('.quiz-image').src = image
}

renderTemplateScreen(selectElement('.list-quizz-area > .list-quizz > ul', 'single'), 'quizzes', TemplateCardQuizz)