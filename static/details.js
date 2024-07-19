import config from "../apikey.js";
import config from "../apikey.js";

const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;
const WEATHER_URL = config.URL.weather_url;
const WEATHER_KEY = config.KEY.weather_key;

let url = new URL(
  `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}`
);

const mountain_keyword = "설악산";

// 산 정보만 뽑을 경우
const getMntData = async () => {
  url = new URL(
    `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}&searchWrd=${mountain_keyword}`
  );
  const response = await fetch(url);
  const data = await response.json();
  const mntilistNo = data.response.body.items.item[0].mntilistno; // 산 코드
  console.log(data);
  await getMntImgData(mntilistNo);
  await getMntTrail(mntilistNo);
  displayMntInfoArticle({
    mntiName: data.response.body.items.item[0].mntiname,
    mntiHigh: data.response.body.items.item[0].mntihigh,
    mntiRegion: data.response.body.items.item[0].mntiadd,
    mntiDetails: data.response.body.items.item[0].mntidetails,
  });
};
getMntData();

const getMntImgData = async (mntilistNo) => {
  url = new URL(
    `${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?_type=json&mntiListNo=${mntilistNo}&ServiceKey=${MOUNTAINS_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  const MntImgFile = data.response.body.items.item[0].imgfilename;
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
  const MntImgFile = data.response.body.items.item[0].imgfilename;
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
        <h5><b>${info.mntiName}</b></h5>
        <p><span>고도 |</span> <span>${info.mntiHigh}m</span></p>
        <p><span>지역 |</span> <span>${info.mntiRegion}</span></p>
        <p><span>소개 |</span> <span>${mntiDetails}</span></p>`;
};

const getMntTrail = async (mntncd) => {
  url = new URL(
    `${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoImgOpenAPI?_type=json&searchWrd=${mntncd}&serviceKey=${MOUNTAINS_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();

  console.log("숲길", data);
};

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
