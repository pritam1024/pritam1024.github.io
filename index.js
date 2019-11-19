let pageNo = 1;
let query = "reactjs";
const URL =
  "https://newsapi.org/v2/everything?apiKey=363d26dd3d664d199ca63adc371e22aa&pageSize=10&page=";
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("query")) {
  query = urlParams.get("query");
}
let timer = countDown();
document.addEventListener("DOMContentLoaded", () => {
  let options = {
    root: null,
    rootMargins: "0px",
    threshold: 0.5
  };
  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.querySelector("footer"));
});

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    getData(query, pageNo);
  }
}
function getData(query, pgNo = 1) {
  clearInterval(timer);
  timer = countDown();
  let main = document.querySelector("main");
  pageNo = pgNo === 1 ? pgNo : pageNo;
  let searchUrl = URL + pageNo + encodeURI("&q=" + query);
  console.log(searchUrl);
  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      if (data.articles.length) {
        data.articles.forEach(item => {
          let a = document.createElement("a");
          let newsCard = document.createElement("div");
          newsCard.className = "news-card";
          let newsHeader = document.createElement("h4");
          let p = document.createElement("p");
          let cardContent = document.createElement("div");
          cardContent.className = "news-content";
          let img = document.createElement("img");
          a.href = item.url;
          a.innerHTML = "more";
          newsHeader.innerHTML = item.title;
          p.innerHTML = item.content;
          p.appendChild(a);
          img.src = item.urlToImage;
          img.alt = "news image";
          newsCard.appendChild(newsHeader);
          cardContent.appendChild(img);
          cardContent.appendChild(p);
          // cardContent.appendChild(a);
          newsCard.appendChild(cardContent);
          // a.appendChild(newsCard);
          main.appendChild(newsCard);
        });
      } else {
        let div = document.createElement("div");
        div.innerHTML = "No content";
        div.className = "error";
        main.appendChild(div);
      }
    })
    .catch(e => {
      let div = document.createElement("div");
      div.innerHTML = "Something Went Wrong";
      div.className = "error";
      main.appendChild(div);
    });
  pageNo++;
}
function countDown() {
  let time = 30;
  const timer = setInterval(function() {
    time -= 1;
    document.getElementById("time").innerHTML = time;
    if (time === 0) location.reload();
  }, 1000);
  return timer;
}
function getFiltered() {
  let input = document.getElementsByTagName("input");
  query = input[0].value.toLowerCase();
  if (query && query.length) {
    document.location.search = "query=" + query;
    let newsCard = document.getElementsByClassName("news-card");
    const newsCardArr = Array.from(newsCard);
    getData(query);
    newsCardArr.forEach(el => el.remove());
  } else {
    return;
  }
}
