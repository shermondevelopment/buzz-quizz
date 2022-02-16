export const TemplateCardQuizz = (title, figure) => {
  return `
    <li data-id="">
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