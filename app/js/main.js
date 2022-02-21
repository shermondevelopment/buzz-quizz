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

const renderCardQuizzScreen = async() => {
    const quizzContainer = selectElement('.list-quizz-area > .list-quizz > ul', 'single')
    const quizzes = await queryGetApi('quizzes')
    quizzes.forEach(item => {
        quizzContainer.innerHTML += TemplateCardQuizz(item.id, item.title, item.image)
    })
}

/*
/* No momento do click do quiz a função openedQuizz e chamada colocando o
*/

function openedQuizz(element) {
    const sectionListQuizzToInvisible = selectElement('.add-quizz', 'single')
        //const quizzQuestion = selectElement('.quiz-questions', 'single')
        /* esconde a lista de quizz */
    makeElementInivisble(sectionListQuizzToInvisible, true)
        /* mostra um unico quizz */
        //makeElementInivisble(quizzQuestion, false)
    document.getElementById("open-quiz").style.display = 'block';

    let myPromise = queryGetApi(`quizzes/${element.dataset.id}`);
    myPromise.then(titleQuiz);
}

let quantQuestions = 0;
let rightQuestions = 0;
let quizLevels;

function titleQuiz(quiz) {
    document.body.style.overflow = 'hidden';
    let divnova = document.createElement("div");
    divnova.className = "show-quiz figure-quiz";
    divnova.style.backgroundImage = `url(${quiz.image})`;
    divnova.innerHTML = `<div class = "figure-opacity"> </div>`;
    document.getElementById("open-quiz").appendChild(divnova);
    document.getElementById("open-quiz").style.overflow = 'hidden';
    let divp = document.createElement("p");
    divp.className = "title-quiz d-flex justify-content-center align-items-center";
    divp.innerHTML = quiz.title;
    divnova.appendChild(divp);
    quantQuestions = quiz.questions.length;
    quizLevels = quiz.levels;
    for (let i in quiz.questions) questionsQuiz(quiz.questions[i], i);
}

function questionsQuiz(question, qn) {
    let divnova = document.createElement("div");
    divnova.className = "show-questions " + question.title.trim().replaceAll(' ', '-');
    document.getElementById("open-quiz").appendChild(divnova);
    let divtitle = document.createElement("div");
    divtitle.className = "show-title";
    divtitle.style.backgroundColor = question.color;
    divnova.appendChild(divtitle);
    let divp = document.createElement("p");
    divp.className = "title-question d-flex justify-content-center align-items-center";
    divp.innerHTML = question.title;
    divtitle.appendChild(divp);
    let answers = shuffleArray(question.answers);
    for (let i in answers) {
        let divfig = document.createElement("figure");
        divfig.id = `${qn}`;
        divfig.className = "figure-question";
        divfig.setAttribute("data-isTrue", `${answers[i].isCorrectAnswer}`);
        divnova.appendChild(divfig);
        let divimg = document.createElement("img");
        divimg.src = answers[i].image;
        divimg.style.height = "113px";
        divimg.style.width = "163px";
        divimg.style.marginRight = "12px";
        divimg.onclick = questionAnswer;
        divfig.appendChild(divimg);
        let divcap = document.createElement("figcaption");
        divcap.className = "question-caption";
        divcap.innerHTML = answers[i].text;
        divfig.appendChild(divcap);
    }
}

function questionAnswer(answers) {
    const question = answers.explicitOriginalTarget.parentElement.parentElement;
    const atual = answers.explicitOriginalTarget.parentElement;
    for (let i in question.children) {
        if (question.children[i].tagName == 'FIGURE') {
            let answer = question.children[i];
            answer.children[0].style.pointerEvents = 'none';
            if (answer.getAttribute('data-isTrue') == 'false') answer.children[1].style.color = '#FF0B0B';
            else answer.children[1].style.color = '#009C22';
            if (answer != atual) answer.style.opacity = '0.3';
        }
    }
    if (atual.getAttribute('data-isTrue') == 'true') rightQuestions++;
    setTimeout(() => { window.scrollBy(0, 530); }, 2000);
    if (parseInt(atual.id) + 1 == quantQuestions) {
        showResult(question.parentElement);
    }
}

function showResult(div) {
    document.body.style.overflow = 'auto';
    rightQuestions = (rightQuestions / quantQuestions) * 100;
    let nivel = 0;
    for (let i in quizLevels) {
        if (quizLevels[i].minValue <= rightQuestions) {
            nivel = i;
        }
    }
    let divnova = document.createElement("div");
    divnova.className = "show-result";
    div.appendChild(divnova);
    let divtitle = document.createElement("div");
    divtitle.className = "result-title";
    divnova.appendChild(divtitle);
    let divp = document.createElement("p");
    divp.className = "title-question d-flex justify-content-center align-items-center";
    divp.innerHTML = quizLevels[nivel].title;
    divtitle.appendChild(divp);
    let divfig = document.createElement("figure");
    divfig.className = "figure-result";
    divnova.appendChild(divfig);
    let divimg = document.createElement("img");
    divimg.src = quizLevels[nivel].image;
    divimg.style.height = "255px";
    divimg.style.width = "340px";
    divfig.appendChild(divimg);
    let divcap = document.createElement("figcaption");
    divcap.className = "result-caption";
    divcap.innerHTML = quizLevels[nivel].text;
    divfig.appendChild(divcap);
    let button = document.createElement("input");
    button.className = 'result-button';
    button.type = "button";
    divnova.appendChild(button);
    console.log(quizLevels);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const makeElementInivisble = (element, invisible) => {
    invisible ? element.style.display = "none" : element.style.display = "block"
}

renderCardQuizzScreen()