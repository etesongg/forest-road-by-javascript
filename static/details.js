import config from "../apikey.js";

const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;
const WEATHER_URL = config.URL.weather_url;
const WEATHER_KEY = config.KEY.weather_key;

let url = new URL(
  `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}`
);

const mountain_keyword = "한라산";

// 산 정보만 뽑을 경우
const getMntData = async () => {
  url = new URL(
    `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}&searchWrd=${mountain_keyword}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("getMntData", data);
  const mntilistNo = data.response.body.items.item.mntilistno; // 산 코드
  const mntiadd = Array.isArray(data.response.body.items.item)
    ? data.response.body.items.item[0].mntiadd
    : data.response.body.items.item.mntiadd; // 산 주소
  await getMntImgData(mntilistNo);
  await getTrailData();
  await translateToAddress(mntiadd);
};
getMntData();

const getMntImgData = async (mntilistNo) => {
  url = new URL(
    `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?_type=json&mntiListNo=${mntilistNo}&ServiceKey=${MOUNTAINS_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("getMntImgData", data);
  const MntImgFile = Array.isArray(data.response.body.items.item)
    ? data.response.body.items.item[0].imgfilename
    : data.response.body.items.item.imgfilename;
  displayMntInfoFigure(MntImgFile);
};

const displayMntInfoFigure = (MntImgFile) => {
  document.querySelector(
    ".details-mnt-information figure"
  ).innerHTML = `<img src="http://www.forest.go.kr/images/data/down/mountain/${MntImgFile}" alt="">`;
};

const getTrailData = async () => {
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?_type=json&searchMtNm=${mountain_keyword}&serviceKey=${MOUNTAINS_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("getTrailData", data);
  const mntncd = data.response.body.items.item.mntncd;
  await displayMntInfoArticle(data.response.body.items.item);
  await getMntTrail(mntncd);
};
// mntncd	산코드
// mntnm 	산명
// subnm 	산정보부제
// areanm 	산정보소재지
// mntheight 	산정보높이
// aeatreason 	100대명산 선정이유
// overview 	산정보개관
// details 	산정보내용
// transport 	대중교통정보설명
// tourisminf 	주변관광정보설명
// etccourse	산정보주변관광정보기타코스설명
const displayMntInfoArticle = (info) => {
  const mntiDetails =
    info.details.length >= 300
      ? `${info.details.slice(0, 300)}...`
      : info.details;
  document.querySelector(".details-mnt-information article").innerHTML = `
        <h5><b>${info.mntnm}</b></h5>
        <p><span>고도 |</span> <span>${info.mntheight} m</span></p>
        <p><span>지역 |</span> <span>${info.areanm}</span></p>
        <p><span>소개 |</span> <span>${mntiDetails}</span></p>
        
        <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
    <i class="fa-solid fa-circle-info"></i> 추가 정보
  </a>
    <div class="collapse" id="collapseExample">
    <div class="card card-body">
        <b>추가로 100대명산 선정이유 | ${info.aeatreason}
        <br>산정보개관 | ${info.overview}
        <br>대중교통정보설명 | ${info.transport}
        <br>주변관광정보설명 | ${info.tourisminf}</b>
    </div>
    </div>`;

  openTrailCourse(info.etccourse);
};

const getMntTrail = async (mntncd) => {
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoImgOpenAPI?_type=json&searchWrd=${mntncd}&serviceKey=${MOUNTAINS_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("getMntTrail", data);
  const trailArray = data.response.body.items.item;
  displayMntTrailInfo(trailArray);
};

// 산행 content, HTML 엔티티로 인코딩
const decodeHTMLEntities = (text) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  return doc.documentElement.textContent;
};

// titl	산행추가제목
// content	산행추가설명
// image	산행이미지순번
// 신행 아니고 그냥 관련 사진? 같은 느낌
const displayMntTrailInfo = async (trailArray) => {
  const MntTrailInfoHTML = trailArray
    .map((trail) => {
      const splitTitle = trail.titl.includes("-")
        ? trail.titl.split("-")[1]
        : trail.titl;
      const decodedContent = decodeHTMLEntities(trail.content);
      return `
        <div class="card" style="width: 18rem;">
        <img src="http://www.forest.go.kr/swf/foreston/mountain/${trail.image}" class="card-img-top" alt="...">
        <div class="card-body">
            <p class="card-text">
            <strong>${splitTitle}</strong><br>
            ${decodedContent}
            </p>
        </div>
        </div>`;
    })
    .join("");
  document.querySelector(".details-mnt-related-images > .row").innerHTML =
    MntTrailInfoHTML;
};

const translateToAddress = async (mntAdress) => {
  naver.maps.Service.geocode(
    { address: mntAdress },
    function (status, response) {
      console.log(mntAdress);
      if (status === naver.maps.Service.Status.ERROR) {
        console.log("Something wrong!");
        console.log("Status:", status);
        console.log("Response:", response);
        return;
      }
      // 성공 시의 response 처리
      const { x, y } = response.v2.addresses[0];
      console.log(`y : ${x} x : ${y}`);
      return initMap(y, x), callWeather(y, x);
    }
  );
};

// 지도 생성
var map = null;

function initMap(x, y) {
  var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(x, y),
    zoom: 15,
  });

  var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(x, y),
    map: map,
  });
}

const openTrailCourse = (etccourse) => {
  const trailCourseIcon = document.querySelector(".fa-location-arrow");
  trailCourseIcon.setAttribute("data-bs-content", etccourse);
  new bootstrap.Popover(trailCourseIcon, {
    html: true,
  }); // 부트스트랩 popover 초기화 해줘야 함, html 태그 인식되도록 하기
};

// 상단 버튼 효과 추가하기 (영화)

// const callWeather = async (y, x) => {
//     url = new URL(`${WEATHER_URL}data/2.5/weather?lat=${y}&lon=${x}&lang=kr&units=metric&appid=${WEATHER_KEY}`)
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log('callWeather',data)
//     const currTemp = Math.round(data.main.temp * 10) / 10;
// //   const currTime = getYmd10(data.dt);
//   const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
// //   console.log("기준시간:", getYmd10(data.dt));
//   displayWeather(currTemp, iconUrl)
// }

// const displayWeather = (currTemp, iconUrl) => {
//     document.querySelector(".details-mnt-weather").innerHTML = `
//     <div class="card">
//         <div class="card-body">
//             현재날씨
//             <p class="card-text">${currTemp}</p>
//         </div>
//         <img src="${iconUrl}" class="card-img-top" alt="...">
//     </div>
//     `
// }
