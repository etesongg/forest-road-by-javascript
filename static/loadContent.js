document.addEventListener("DOMContentLoaded", function () {
  const headerDiv = document.getElementById("header");
  const mainDiv = document.getElementById("main");
  const footerDiv = document.getElementById("footer");

  // Header와 Footer는 모든 페이지에서 공통으로 사용
  fetch("includes/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerDiv.innerHTML = data;
    });

  fetch("includes/footer.html")
    .then((response) => response.text())
    .then((data) => {
      footerDiv.innerHTML = data;
    });

  // URL의 쿼리 문자열에 따라 Main 콘텐츠 변경
  const queryParams = new URLSearchParams(window.location.search);
  let page = queryParams.get("page"); // URL에서 'page' 쿼리 파라미터 가져오기

  // page 값에 따라 다른 HTML 파일을 불러옴
  let contentToLoad = "main.html"; // 기본값 설정
  let scriptToLoad = "static/main.js";

  if (page === "details") {
    contentToLoad = "details.html";
    scriptToLoad = "static/details.js";
  } else if (page === "list") {
    contentToLoad = "list.html";
    scriptToLoad = "static/list.js";
  } else if (!page) {
    // 쿼리 파라미터가 없는 경우, 기본값(메인)으로 설정
    page = "main";
  }

  // 메인 콘텐츠를 로드하고, 스크립트를 동적으로 로드합니다.
  fetch(contentToLoad)
    .then((response) => response.text())
    .then((data) => {
      mainDiv.innerHTML = data;
      loadScript(scriptToLoad); // 메인 콘텐츠 로드 후 스크립트 로드
    });

  // 스크립트 동적 로드 함수
  function loadScript(src) {
    const script = document.createElement("script");
    script.src = src;
    script.async = false; // 스크립트가 순차적으로 실행되도록 합니다.
    script.onload = function() {
      console.log(`${src} has been loaded successfully.`);
    };
    script.onerror = function() {
      console.error(`Error loading script: ${src}`);
    };
    document.body.appendChild(script);
  }
});
