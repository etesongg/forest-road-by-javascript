const MOUNTAINS_KEY = `AXa61V6%2FXJxE8zJezVhN70U9qWt%2BwsYy%2BjtQkZj7dFMID%2FmdDwFu%2BlWAXpHw6deAA7IVCLauk5FAsBiv98OXhA%3D%3D`;

let url = new URL(
  `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?searchWrd=2619990400&ServiceKey=${MOUNTAINS_KEY}&_type=json`
);

let mntiList = [];
let codeList = [];
let imgList = [];

let nameList = [];

// 산 리스트를 가져오는 함수
const getMntiList = async () => {
  const keyword = document.getElementById("SearchName").value;

  url = new URL(
    `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&searchMtNm=${keyword}&_type=json`
  );
  const response = await fetch(url);
  const data = await response.json();
  mntiList = data.response.body.items.item;
  nameList = mntiList.map((name) => name.mntnm);
  codeList = mntiList.map((code) => code.mntncd);
  for (let i = 0; i < codeList.length; i++) {
    await getMntiImg(codeList[i], i); // 인덱스를 인수로 전달
  }
  // console.log(codeList) //421100101, 427700101, 478400101, 317100101, 414800101, 457700101, 441500301, 427206801, 427200401, 116200201

  render(); // 모든 이미지 로딩 후 렌더링 함수 호출
};

const getMntiImg = async (mntncd, index) => {
  url = new URL(
    `http://apis.data.go.kr/1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?mntiListNo=${mntncd}&ServiceKey=${MOUNTAINS_KEY}&_type=json`
  );
  const response = await fetch(url);
  const data = await response.json();
  let imgFileInfo = data.response.body.items.item;
  if (imgFileInfo[0] === undefined) {
    imgList[
      index
    ] = `https://static.vecteezy.com/system/resources/thumbnails/005/337/799/small/icon-image-not-found-free-vector.jpg`; // 이미지가 없는 경우 noimage사진출력
  } else {
    imgList[
      index
    ] = `http://www.forest.go.kr/images/data/down/mountain/${imgFileInfo[0].imgfilename}`;
  }
};

const getMntiListByKeyword = async () => {
  const keyword = document.getElementById("SearchName").value;
  url = new URL(
    `http://openapi.forest.go.kr/openapi/service/cultureInfoService/gdTrailInfoOpenAPI?ServiceKey=${MOUNTAINS_KEY}&searchMtNm=${keyword}&_type=json`
  );
  const response = await fetch(url);
  const data = await response.json();
  mntiList = data.response.body.items.item;
  console.log(mntiList);
  getMntiList();
};

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
};
getMntiList();
