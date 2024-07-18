document.addEventListener("DOMContentLoaded", function () {
  const apiUrl =
    "http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI";
  const imageApiUrl =
    "http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoImgOpenAPI";
  const serviceKey =
    "6OOYIpPBcuzSlb9ySCOig5hl2yyAicP6cs%2BG7wM3kb%2B1AdFH9fn5nAymyaCjxrnF5YQnIGxoSnIZlT9cvhjrRg%3D%3D";
  const itemsPerPage = 6; // 페이지당 항목 수
  let currentPage = 1; // 현재 페이지 번호
  const noImageUrl = "https://via.placeholder.com/200?text=No+Image"; // "No Image" 이미지 URL

  // 산 데이터를 가져오는 함수
  function fetchMountains(page) {
    // API 호출 URL 생성
    const url = `${apiUrl}?serviceKey=${serviceKey}&pageNo=${page}&numOfRows=${itemsPerPage}&_type=json`;

    // API 호출
    fetch(url)
      .then((response) => response.json()) // JSON 형태로 응답을 파싱
      .then((data) => {
        console.log("Fetched data:", data); // 가져온 데이터 콘솔에 출력
        displayMountains(data.response.body.items.item); // 산 데이터를 화면에 표시
        setupPagination(data.response.body.totalCount, page); // 페이지네이션 설정
      })
      .catch((error) => console.error("Error fetching data:", error)); // 에러 처리
  }

  // 산 데이터를 화면에 표시하는 함수
  function displayMountains(mountains) {
    const mountainList = document.getElementById(
      "main-mountain-list-container"
    ); // 산 목록을 표시할 HTML 요소
    mountainList.innerHTML = ""; // 기존 내용을 초기화

    mountains.forEach((mountain) => {
      // 각 산에 대해 이미지를 가져오는 함수 호출
      fetchImage(mountain.mntncd)
        .then((imageUrl) => {
          const mountainItem = document.createElement("div");
          mountainItem.className = "mountain-item";
          mountainItem.innerHTML = `
                    
                        <div class="main-mountain-list-item" style="background-image: url(${imageUrl})">
                            <div class="main-mountain-list-overlay">
                                <h3>${mountain.subnm}</h3> <!-- 산 부제 -->
                                <p>지역: ${mountain.areanm}</p> <!-- 지역명 -->
                                <p>높이: ${mountain.mntheight}m</p> <!-- 산 높이 -->
                            </div>
                        </div>
                        <div class="main-mountain-list-item-title">
                        <h2>${mountain.mntnm}</h2> <!-- 산 이름 -->
                        </div>
                    `;
          mountainList.appendChild(mountainItem); // 산 항목을 목록에 추가
        })
        .catch((error) => console.error("Error fetching image:", error));
    });
  }

  // 산 이미지 데이터를 가져오는 함수
  function fetchImage(mntncd) {
    return new Promise((resolve, reject) => {
      const url = `${imageApiUrl}?searchWrd=${mntncd}&ServiceKey=${serviceKey}&_type=json`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (
            data.response.body.items &&
            data.response.body.items.item.length > 0
          ) {
            const image = data.response.body.items.item[0].image; // 첫 번째 이미지를 사용
            const imageUrl = `http://www.forest.go.kr/swf/foreston/mountain/${image}`;
            resolve(imageUrl);
          } else {
            resolve(noImageUrl);
          }
        })
        .catch((error) => {
          resolve(noImageUrl);
          console.error("Error fetching image:", error);
        });
    });
  }

  // 페이지네이션을 설정하는 함수
  function setupPagination(totalItems, currentPage) {
    const pagination = document.getElementById("pagination"); // 페이지네이션을 표시할 HTML 요소
    pagination.innerHTML = ""; // 기존 페이지네이션 초기화
    const totalPages = Math.ceil(totalItems / itemsPerPage); // 전체 페이지 수 계산

    // 각 페이지 버튼을 생성하여 추가
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.className = "pagination-button";
      button.innerText = i; // 버튼에 페이지 번호 표시
      if (i === currentPage) {
        button.style.fontWeight = "bold"; // 현재 페이지 버튼을 굵게 표시
      }
      button.addEventListener("click", () => fetchMountains(i)); // 버튼 클릭 시 해당 페이지로 이동
      pagination.appendChild(button); // 페이지 버튼을 페이지네이션에 추가
    }
  }

  fetchMountains(currentPage); // 초기 페이지 데이터 가져오기
});
