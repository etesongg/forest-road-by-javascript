import config from "../apikey.js"
const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;

let url = new URL(
  `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?searchWrd=2619990400&ServiceKey=${MOUNTAINS_KEY}&numOfRows=18`
);

let mntiList = [];
let codeList = [];
let imgList = [];

let nameList = [];



let totalResult = 0;
let pageNo = 1;
const groupSize = 5;
const numOfRows = 12;


const mountain_keyword = ``;


let keyword = "";

// 산 리스트를 가져오는 함수
const getMntiList = async () => {
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  const data = await response.json();
  console.log(keyword)
  
  mntiList = data.response.body.items.item;
  nameList = mntiList.map((name) => name.mntnm);
  codeList = mntiList.map((code) => code.mntncd);
  for (let i = 0; i < codeList.length; i++) {
    await getMntiImg(codeList[i], i);
  }
  render();
  paginationRender();
};
getMntiList()

const getMntiImg = async (mntncd, index) => {
  url = new URL(
    `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?mntiListNo=${mntncd}&numOfRows=${numOfRows}&ServiceKey=${MOUNTAINS_KEY}&_type=json`
  );

  const response = await fetch(url);
  const data = await response.json();
  let imgFileInfo = data.response.body.items.item;
  imgList[index] = (Array.isArray(imgFileInfo) && imgFileInfo.length > 0)
    ? `http://www.forest.go.kr/images/data/down/mountain/${imgFileInfo[0].imgfilename}`
    : `https://static.vecteezy.com/system/resources/thumbnails/005/337/799/small/icon-image-not-found-free-vector.jpg`;
};

// 산 리스트와 이미지를 렌더링하는 함수
const render = () => {
  let mntiHTML = mntiList
    .map((mnti, index) => {
      let imgSrc = imgList[index] || ""; // 각 산의 이미지를 imgList 배열에서 참조
      return `<article class="Mountain">
      <div class="Image"><img src="${imgSrc}" alt="No Image" onError='https://static.vecteezy.com/system/resources/thumbnails/005/337/799/small/icon-image-not-found-free-vector.jpg'></div>
      <div class="Text">
      <h4 class="Name">${mnti.mntnm}</h4>
      </div>
      <a href="index.html?page=details&searchWrd=${mnti.mntnm}"></a>
      </article>
      `;
    })
    .join("");
  document.querySelector(".MountainGroup").innerHTML = mntiHTML;
  paginationRender();
  makeEventListener();
};



const paginationRender = async() => {
  const keyword = document.getElementById("SearchName").value;
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  const data = await response.json();

  totalResult = data.response.body.totalCount;

  let totalPages = Math.ceil(totalResult/numOfRows)
  const pageGroup = Math.ceil(pageNo / groupSize);
  let lastPage = pageGroup * groupSize;
  let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let pagiNationHTML = ``;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  if (pageNo >= 2) {
    pagiNationHTML = `
      <li class="page-item prev ${pageNo === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" pageNum="${1}"><i class="xi-backward"></i></a>
      </li>
      <li class="page-item prev ${pageNo === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" pageNum="${pageNo - 1}"><i class="xi-play"></i></a>
      </li>`;
  }
  for (let i = firstPage; i <= lastPage; i++) {
    pagiNationHTML += `
      <li class="page-item ${i === pageNo ? "active" : ""}">
        <a class="page-link" href="#" pageNum="${i}">${i}</a>
      </li>`;
  }
  if (pageNo < totalPages) {
    pagiNationHTML += `
      <li class="page-item next ${pageNo === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" pageNum="${pageNo + 1}"><i class="xi-play"></i></a>
      </li>
      <li class="page-item next ${pageNo === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" pageNum="${totalPages}"><i class="xi-forward"></i></a>
      </li>`;
  }
  document.querySelector(".pagination").innerHTML = pagiNationHTML;
  document.querySelectorAll(".page-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      const pageNum = parseInt(event.currentTarget.querySelector("a").getAttribute("pageNum"));
      moveToPage(pageNum);
    });
  });
}
const moveToPage = (pageNum) => {
  pageNo = pageNum;
  getMntiList();
  console.log(pageNum)
}


const errorRender = (text) => {
  document.querySelector(".MountainGroup").innerHTML = `
      <div class="errorMessage">
        <p><b>"${text}"</b>은(는) 정보가 없습니다.</p>
      </div>`;
}


// 검색 창에 입력 후 산 목록 가져오기
const getMntiListByKeyword = async () => {
  const keyword = document.getElementById("SearchName").value;
  if (keyword == ``) {
    return;
  }
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  pageNo = 1;
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  const data = await response.json();
  if(data.response.body.items == '') {
    errorRender(keyword)
    return;
  }
  mntiList = data.response.body.items.item;
  console.log('getMntiListByKeyword',mntiList)
  render()
};



//검색 창 엔터키로 입력 기능
document.addEventListener("DOMContentLoaded", function () {
  // 검색 창 엔터키로 입력 기능 설정
  const searchNameInput = document.getElementById("SearchName");
  if (searchNameInput) {
    searchNameInput.addEventListener("keyup", (enterKeyCode) => {
      let enterKey = enterKeyCode.code;
      if (enterKey === "Enter" || enterKey === "NumpadEnter") {
        if (searchNameInput.value.trim() !== "") {
          getMntiListByKeyword();
          searchNameInput.value = ``; // 검색 후 입력 필드 비우기
        }
      }
    });
  }
});

const makeEventListener = () => {
  document.querySelector("#SearchButton").addEventListener("click", getMntiListByKeyword);
  document.querySelector(".ShowMountain .heading").addEventListener("click", getMntiList);
}