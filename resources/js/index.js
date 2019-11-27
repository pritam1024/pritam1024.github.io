let pageNo = 1;
let query = "reactjs";
const URL =
  "https://newsapi.org/v2/everything?apiKey=363d26dd3d664d199ca63adc371e22aa&pageSize=10&page=";
let searchInput = document.getElementsByTagName("input");
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
  searchInput[0].addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      getFiltered();
    }
  });
});
function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    getData(query, pageNo);
  }
}
function getData(query, pgNo = 1) {
  clearInterval(timer);
  let main = document.querySelector("main");
  pageNo = pgNo === 1 ? pgNo : pageNo;
  let searchUrl = URL + pageNo + encodeURI("&q=" + query);
  searchInput[0].value = query;
  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      timer = countDown();
      if (data.articles.length) {
        console.log(data.articles);
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
          a.target = "blank";
          a.innerHTML = "more";
          newsHeader.innerHTML = item.title;
          p.innerHTML = item.content ? item.content : "No Content";
          p.appendChild(a);
          img.alt = "News Image";
          img.src = item.urlToImage
            ? item.urlToImage
            : "./resources/assets/no_image.png";
          img.onerror = "this.onerror=null;this.alt='No Image';";
          newsCard.appendChild(newsHeader);
          cardContent.appendChild(img);
          cardContent.appendChild(p);
          newsCard.appendChild(cardContent);
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
      let timer = document.getElementsByClassName("refresh-timer");
      timer[0].remove();
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
    if (!time) {
      if (document.getElementsByClassName("error").length === 0) {
        location.reload();
      } else {
        location.href = location.origin;
      }
    }
  }, 1000);
  return timer;
}
function getFiltered() {
  query = searchInput[0].value;
  console.log(searchInput);
  if (query && query.length) {
    document.location.search = "query=" + query;
  } else {
    return;
  }
}
