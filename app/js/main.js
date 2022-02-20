let countClickAnswer = 0;
let answerHits = 0;
let numberOfQuestions = 0;
let levels;
let numberOfAnswers = 0;
let id;
let countClickshowResults = 0;
let newQuizz = {}
let myQuizzes = []

/* 
/* Template Result Quizz
*/

const TemplateResultQuizz = () => {
  return `
      <div style="display: none" class="section-result">
      <section class="questions">
      <div class="question-title d-flex justify-content-center align-items-center header-result">
          <h2>88% de acerto: Você é praticamente um aluno de Hogwarts!</h2>
      </div>
      <div class="question-area-images d-flex justify-content-between">
          <div class="question-image d-flex flex-direction-column">
              <img src="https://img.wattpad.com/486cbed0c3cff15cd35b386c8212f45b57457354/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4c6d4c6b54624578474b384e47413d3d2d313033313135333531332e313636366137343230383365333838643130393338393638373634362e6a7067?s=fit&w=720&h=720"
                  alt="question" class="image-result" />
          </div>
          <div class="question-image d-flex flex-direction-column">
              <span class="title-image title-result">
                  Parabéns Potterhead! Bem-vindx a Hogwarts aproveite o loop infinito de comida e clique
                  no botão abaixo
                  para usar o vira-tempo e reiniciar este teste.
              </span>
          </div>
      </div>
    </section>
      <div class="question-options d-flex flex-direction-column align-items-center">
      <button class="reset-quizz" onclick="resetQuiz()">Reiniciar Quizz</button>
      <a href="" class="quizz-back-home">Voltar para home</a>
      </div>
    </div>
  `
}

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
      <div class="question-image d-flex flex-direction-column" data-correct="${answers.isCorrectAnswer ? 'true' : ''}" onclick="checkAnswer(this)">
          <img src="${answers.image}"
              alt="question" class="" />
          <span class="title-image breakword">${answers.text}</span>
      </div>
  `
}

/*
/* Template Quizz Questions
*/

const TemplateQuizzQuestion = (props, answers) => {
  return `
      <section class="questions" data-id=${props.id}>
        <div class="question-title d-flex justify-content-center align-items-center"  style="background: ${props.color}">
            <h2>${props.title}</h2>
        </div>
        <div class="question-area-images d-flex flex-wrap-wrap justify-content-between">
            ${answers.map( (item, index) => {
              numberOfAnswers += 1
              return TemplateAnswers(item)
            } )}
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

function shuffleArray(arr) {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
}

const renderTemplateQuestion = async (element, fetchRouter, callbackTemplate) => {
  const routerRequest = await queryGetApi(fetchRouter)
  numberOfQuestions = routerRequest.questions.length
  const { id, title, image } = routerRequest
  levels = routerRequest.levels
  defineProperyQuizz(title, image)
  routerRequest.questions.map(item => {
      element.innerHTML += callbackTemplate({id, title, image, color: item.color}, shuffleArray(item.answers)).replace(/,/g, '')
  })
  element.innerHTML += TemplateResultQuizz()
}

/*
/* No momento do click do quiz a função openedQuizz e chamada colocando o
*/

function openedQuizz(element) {
    /* salva o id */
    id = element.dataset.id
    /* Esconde o elemento sectionListQuizzToInvisible */
    makeElementInivisble( selectElement('.add-quizz', 'single'), true)
    /* Mostra o elemento questionQuizz */
    makeElementInivisble(selectElement('.quiz-questions', 'single'), false)
    
    renderTemplateQuestion(selectElement('.quiz-questions-area', 'single'), `quizzes/${id}`, TemplateQuizzQuestion)
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

/*
/* Checar Resposta ao click
*/

const checkAnswer = (element) => {
  countClickshowResults += 1;
  countClickAnswer += 1;
  (!!element.dataset.correct === true && countClickAnswer === 1) && countHits()
  !!element.dataset.correct === true ? element.classList.add('check', 'true') : element.classList.add('check', 'false')
  checkAllAnswer(element.parentNode, element.classList[0])
}

/*
/* scrollIntoElement faz um scroll até o proximo elemento irmao
*/

const scrollIntoElement = (element) => {
    element && element.scrollIntoView({ behavior: 'smooth' })
}

/*
/* Verifica se todas as opções foram respondidas 
*/

const checkAllAnswer = (element, childs) => {
 const answers = element.querySelectorAll(`.${childs}`)
 if(answers.length === countClickAnswer) {
   setTimeout(() => scrollIntoElement(element.parentNode.nextElementSibling), 2000)
   countClickAnswer = 0;
 }
 if(countClickshowResults === numberOfAnswers) {
    defineResult()
    makeElementInivisble(selectElement('.section-result', 'single'), false)
    setTimeout(() => scrollIntoElement(element.parentNode.nextElementSibling), 2000)
 }
}

/* 
/* A função countHits conta o total de acertos
*/

const countHits = () => {
  answerHits += 1;
}

/*
/* Definir porcentagem de acertos
*/

const setPercentage = () => {
  return Math.ceil((answerHits * 100) / numberOfQuestions);
}

/*
/* Defini o resultado do card
*/

const defineResult = () => {
  let levelResult = selectElement('.header-result h2', 'single');
  let titleResult = selectElement('.title-result', 'single')
  if(setPercentage() >= 50) {
    selectElement('.image-result').src = levels[1].image
    levelResult.innerHTML = `${setPercentage()}% de acerto: ${levels[1].title}`
    titleResult.innerHTML = `${levels[1].text}`
  } else {
    selectElement('.image-result').src = levels[0].image
    levelResult.innerHTML = `${setPercentage()}% de acerto: ${levels[0].title}`
    titleResult.innerHTML = `${levels[0].text}`
  }
  
}

/*
/*  Reset Quizz
*/

const resetQuiz = () => {
  /* reseta o total de perguntas */
  numberOfQuestions = 0;
  /* reseta o total de acertos */
  answerHits = 0;
  /* Faz um scroll para a primeira pergunta */
  scrollIntoElement(selectElement('.questions', 'single'))
  /* Remove todas as perguntas */
  selectElement('.quiz-questions-area', 'single').innerHTML = ""
  /* Renderiza novamente as perguntas na tela zeradas */
  renderTemplateQuestion(selectElement('.quiz-questions-area', 'single'), `quizzes/${id}`, TemplateQuizzQuestion)
}

/*
/* Create Quizz
*/
const createQuizz = () => {
  selectElement('.add-quizz', 'single').style.display = "none"
  selectElement('.quiz-questions', 'single').style.display = "none"
  selectElement('.create-quizz', 'single').style.display = "flex"
}

const renderTemplateSuccess = (id, title, image) => {
  return `
      <div class="myquizz-success d-flex flex-direction-column align-items-center">
        <h2 class="create-quizz-title">Seu quizz está pronto</h2>
        <div class="card-result">
            <img src="${image}"
                class="image-myquizz" />
            <h2 class="quizz-title">${title}</h2>
        </div>
        <button type="submit" data-id="${id}" class="button" onclick="openedQuizz(this), hidden()">Acessar Quizz</button><br /><br />
        <a href="" class="quizz-back-home">Voltar para home</a>
      </div>
  `
}

const queryPostApi = async () => {
  const addQuizz = await fetch(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newQuizz)
  })
  return await addQuizz.json()
}

function addQuizzInfoBasic(event) {
  event.preventDefault()
  newQuizz = {
    title: selectElement('input[name="titleQuizz"]', 'single').value,
    image: selectElement('input[name="url"]', 'single').value
  }
  /* Esconde o formulario de informações básica */
  selectElement('.post-basic', 'single').style.display = "none"
  selectElement('.post-question', 'single').style.display = "block"
}

function addQuizzQuestions(event) {
  event.preventDefault()
  newQuizz.questions = [
    {
      title: selectElement('input[name="title"]', 'single').value,
      color: selectElement('input[name="color"]', 'single').value,
      answers: [
        {
          text: selectElement('input[name="questionCorrect"]', 'single').value,
          image: selectElement('input[name="questionCorrectImage"]', 'single').value,
          isCorrectAnswer: true
        },
        {
          text: selectElement('input[name="questionIncorrectFirst"]').value,
          image: selectElement('input[name="questionIncorrectImageFirst"]').value,
          isCorrectAnswer: false
        },
        {
          text: selectElement('input[name="questionIncorrectSecond"]').value,
          image: selectElement('input[name="questonIncorrectImageSecond"]').value,
          isCorrectAnswer: false
        },
        {
          text: selectElement('input[name="questionIncorrectThird"]').value,
          image: selectElement('input[name="questionIncorrectImageThird"]').value,
          isCorrectAnswer: false
        }
      ]
    },
    {
      title: selectElement('input[name="titleTwo"]', 'single').value,
      color: selectElement('input[name="colorTwo"]', 'single').value,
      answers: [
        {
          text: selectElement('input[name="questionCorrectTwo"]').value,
          image: selectElement('input[name="urlFirst"]', 'single').value,
          isCorrectAnswer: true,
        },
        {
          text: selectElement('input[name="questiontitle1"]').value,
          image: selectElement('input[name="questioimage1"]').value,
          isCorrectAnswer: false
        },
        {
          text: selectElement('input[name="questiontitle2"]').value,
          image: selectElement('input[name="questionImage2"]').value,
          isCorrectAnswer: false
        },
        {
          text: selectElement('input[name="questiontitle3"]').value,
          image: selectElement('input[name="questionImage3"]').value,
          isCorrectAnswer: false
        },
      ]
    },
    {
      title: selectElement('input[name="titleThree"]', 'single').value,
      color: selectElement('input[name="colorThree"]', 'single').value,
      answers: [
        {
          text: selectElement('input[name="questionCorrect4"]').value,
          image: selectElement('input[name="url4"]', 'single').value,
          isCorrectAnswer: true,
        },
        {
          text: selectElement('input[name="questionInocrrect5"]').value,
          image: selectElement('input[name="url5"]').value,
          isCorrectAnswer: false
        },
        {
          text: selectElement('input[name="questionIncorrect6"]').value,
          image: selectElement('input[name="url6"]').value,
          isCorrectAnswer: false
        },
        {
          text: selectElement('input[name="questionInocrrect7"]').value,
          image: selectElement('input[name="url7"]').value,
          isCorrectAnswer: false
        },
      ]
    }
  ]
  selectElement('.post-question', 'single').style.display = "none"
  selectElement('.post-levels', 'single').style.display = "block"
}

async function addLevels(event){
  event.preventDefault()
  let title = selectElement('input[name="titleLevelThird"]', 'single').value
  let image = selectElement('input[name="urlLevelThird"]', 'single').value
  let text = selectElement('input[name="descriptionLevelThird"]').value
  let minValue = parseInt(selectElement('input[name="hitsThird"]').value)

  newQuizz.levels = [
    {
      title: selectElement('input[name="titleLevel"]', 'single').value,
      image: selectElement('input[name="urlLevel"]', 'single').value,
      text: selectElement('input[name="descriptionLevel"]').value,
      minValue: parseInt(selectElement('input[name="hits"]').value)
    },
    {
      title: selectElement('input[name="titleLevelSecond"]', 'single').value,
      image: selectElement('input[name="urlLevelSecond"]', 'single').value,
      text: selectElement('input[name="descriptionLevelSecond"]').value,
      minValue: parseInt(selectElement('input[name="hitsSecond"]').value)
    }
  ]
  if(title && image && text && minValue) {
    newQuizz.levels.push({
      title,
      image,
      text,
      minValue
    })
  }

  const { id, image: img, title:titulo } = await queryPostApi();
  if(id) {
    myQuizzes.push({id})
    localStorage.setItem('myQuizes', myQuizzes)
  }
  selectElement('.post-levels', 'single').style.display = "none"
  selectElement('.create-quizz-content', 'single').innerHTML = renderTemplateSuccess(id, titulo, img)
  
}

function accordion(element) {
  selectElement('.question', 'all').forEach( item => {
    item.classList.add('closed')
  } )
  element.classList.remove('closed')
}

function hidden() {
  selectElement('.create-quizz', 'single').style.display = "none";
}

renderTemplateScreen(selectElement('.list-quizz-area > .list-quizz > ul', 'single'), 'quizzes', TemplateCardQuizz)