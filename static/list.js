import config from "../apikey.js"
const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;


// const MOUNTAINS_KEY = `AXa61V6%2FXJxE8zJezVhN70U9qWt%2BwsYy%2BjtQkZj7dFMID%2FmdDwFu%2BlWAXpHw6deAA7IVCLauk5FAsBiv98OXhA%3D%3D`;

let url = new URL(
  `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?searchWrd=2619990400&ServiceKey=${MOUNTAINS_KEY}&numOfRows=18`
);

const searchButton = document.querySelector("#SearchButton");

let mntiList = [];
let codeList = [];
let imgList = [];

let nameList = [];



let totalResult = 0;
let pageNo = 1;
const groupSize = 5;
const numOfRows = 12;


const mountain_keyword = ``;




// 산 리스트를 가져오는 함수
const getMntiList = async () => {
  const keyword = document.getElementById("SearchName").value;
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  const data = await response.json();
  
  mntiList = data.response.body.items.item;
  nameList = mntiList.map((name) => name.mntnm);
  codeList = mntiList.map((code) => code.mntncd);
  for (let i = 0; i < codeList.length; i++) {
    await getMntiImg(codeList[i], i);
  }
  await render();
};

const getMntiImg = async (mntncd, index) => {
  url = new URL(
    `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?mntiListNo=${mntncd}&numOfRows=${numOfRows}&ServiceKey=${MOUNTAINS_KEY}&_type=json`
  );

  const response = await fetch(url);
  const data = await response.json();
  let imgFileInfo = data.response.body.items.item;
  if (imgFileInfo !== undefined) {
    if (imgFileInfo[0] === undefined) {
      imgList[index] = `https://static.vecteezy.com/system/resources/thumbnails/005/337/799/small/icon-image-not-found-free-vector.jpg`; // 이미지가 없는 경우 noimage사진출력
    } else {
      imgList[index] = `http://www.forest.go.kr/images/data/down/mountain/${imgFileInfo[0].imgfilename}`;
    }
  } else if (imgFileInfo === undefined) {
    imgList[index] = `https://static.vecteezy.com/system/resources/thumbnails/005/337/799/small/icon-image-not-found-free-vector.jpg`;
  }
};




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
  render()
  document.getElementById("SearchName").value = ``;
  searchButton.addEventListener("click", getMntiListByKeyword)
};



//검색 창 엔터키로 입력 기능
document.getElementById("SearchName").addEventListener("keyup", (enterKeyCode) => {
  let enterKey = enterKeyCode.code;
  if (enterKey == "Enter" || enterKey == "NumpadEnter") {
    if(document.getElementById("SearchName").value == "") {
      return;
    } else if(document.getElementById("SearchName").value) {
      getMntiListByKeyword()
      document.getElementById("SearchName").value = ``;
    }
  }
})




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
      <a href="list.html?page=details&mountain_keyword="${mnti.mntnm}"></a>
      </article>
      `;
    })
    .join("");
  document.querySelector(".MountainGroup").innerHTML = mntiHTML;
  paginationRender();
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
      const pageNum = parseInt(event.target.getAttribute("pageNum"));
      moveToPage(pageNum)
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


getMntiList();

document.querySelector(".ShowMountain .heading").addEventListener("click", getMntiList)