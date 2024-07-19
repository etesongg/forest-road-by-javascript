const MOUNTAINS_KEY = `AXa61V6%2FXJxE8zJezVhN70U9qWt%2BwsYy%2BjtQkZj7dFMID%2FmdDwFu%2BlWAXpHw6deAA7IVCLauk5FAsBiv98OXhA%3D%3D`;

let url = new URL(
  `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?searchWrd=2619990400&ServiceKey=${MOUNTAINS_KEY}&numOfRows=18`
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




// 산 리스트를 가져오는 함수
const getMntiList = async () => {
  const keyword = document.getElementById("SearchName").value;
  url = new URL(
    `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  // url.searchParams.set("pageNo", pageNo) //왜 안되는지
  const data = await response.json();
  mntiList = data.response.body.items.item;
  nameList = mntiList.map((name) => name.mntnm);
  codeList = mntiList.map((code) => code.mntncd);
  for (let i = 0; i < codeList.length; i++) {
    await getMntiImg(codeList[i], i); // 인덱스를 인수로 전달
  }
  // console.log(codeList) //421100101, 427700101, 478400101, 317100101, 414800101, 457700101, 441500301, 427206801, 427200401, 116200201, 437200401, 488400801
  render(); // 모든 이미지 로딩 후 렌더링 함수 호출
  // paginationRender();
};

const getMntiImg = async (mntncd, index) => {
  url = new URL(
    `http://apis.data.go.kr/1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?mntiListNo=${mntncd}&numOfRows=${numOfRows}&ServiceKey=${MOUNTAINS_KEY}&_type=json`
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





const getMntiListByKeyword = async () => {
  const keyword = document.getElementById("SearchName").value;
  url = new URL(
    `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  pageNo = 1;
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  const data = await response.json();
  mntiList = data.response.body.items.item;
  render()
  document.getElementById("SearchName").value = ``;
};

searchButton.addEventListener("click", getMntiListByKeyword)





// 산 리스트와 이미지를 렌더링하는 함수
const render = () => {
  let mntiHTML = mntiList
    .map((mnti, index) => {
      let imgSrc = imgList[index] || ""; // 각 산의 이미지를 imgList 배열에서 참조
      return `<article class="Mountain">
      <div class="Image"><a><img src="${imgSrc}" alt="No Image"></a></div>
      <div class="Text">
      <h4 class="Name">${mnti.mntnm}</h4>
      </div>
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
    `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&numOfRows=${numOfRows}&searchMtNm=${keyword}&_type=json`
  );
  url.searchParams.set("pageNo", pageNo)
  const response = await fetch(url);
  const data = await response.json();

  totalResult = data.response.body.totalCount;

  const totalPages = Math.ceil(totalResult/numOfRows)
  const pageGroup = Math.ceil(pageNo / groupSize); //현재 내가 보고 있는 페이지가 속해있는 그룹
  console.log(totalPages)
  let lastPage = pageGroup * groupSize;
  //마지막 페이지그룹이 그룹사이즈보다 작으면? lastPage = totalPage
  if(lastPage > totalPages) {
    lastPage = totalPages;
  }
  let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  


  let pagiNationHTML = ``;
  if (1 < pageNo) {
    pagiNationHTML +=
      `<li class="page-item" onclick="moveToPage(1)">
        <a class="page-link"><<
        </a>
      </li>
      <li class="page-item" onclick="moveToPage(${pageNo - 1})">
        <a class="page-link"><
        </a>
      </li>`
  }
  for(let i = firstPage; i <= lastPage; i++) {
    pagiNationHTML += `<li class="page-item ${i === pageNo ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`
  }
  if (pageNo < totalPages) {
    pagiNationHTML +=
      `<li class="page-item" onclick="moveToPage(${pageNo + 1})">
        <a class="page-link">
          >
          </a>
          </li>
          <li class="page-item" onclick="moveToPage(${totalPages})">
          <a class="page-link">>>
        </a>
      </li>`
  }
  document.querySelector(".pagination").innerHTML = pagiNationHTML;
}
const moveToPage = (pageNum) => {
  pageNo = pageNum;
  getMntiList();
}
getMntiList();
