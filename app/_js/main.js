import { TemplateCardQuizz } from "./templateCardQuizz.js";

/* Função de Consulta do Tipo GET */

const  queryGetApi = async (router) => {
  const queryUrl = await fetch(`https://mock-api.driven.com.br/api/v4/buzzquizz/${router}`);
  const queryResponseJson = await queryUrl.json()
  return queryResponseJson
}

const selectElement = (element, type) => {
  return (type === 'all') ? document.querySelectorAll(element) : document.querySelector(element);
}

const renderCardQuizzScreen = async () =>  {
  const quizzContainer = selectElement('.list-quizz > ul', 'single')
  const quizzes = await queryGetApi('quizzes')
  quizzes.forEach( item => {
    quizzContainer.innerHTML += TemplateCardQuizz(item.title, item.image)
  } )
}

renderCardQuizzScreen()