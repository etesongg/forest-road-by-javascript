import config from "../apikey.js"

const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;

let url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}`)

const mountain_keyword = '설악산'

// 산 정보만 뽑을 경우
const getMntData = async() => {
    url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}&searchWrd=${mountain_keyword}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('getMntData',data)
    const mntilistNo = data.response.body.items.item.mntilistno; // 산 코드
    await getMntImgData(mntilistNo);
    getTrailData()
}
getMntData()

const getMntImgData = async (mntilistNo) => {
    url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?_type=json&mntiListNo=${mntilistNo}&ServiceKey=${MOUNTAINS_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    const MntImgFile = data.response.body.items.item[0].imgfilename
    displayMntInfoFigure(MntImgFile)
}

const displayMntInfoFigure = (MntImgFile) => {
    document.querySelector(".details-mnt-information figure").innerHTML = `<img src="http://www.forest.go.kr/images/data/down/mountain/${MntImgFile}" alt="">`;
}

const getTrailData = async () => {
    url = new URL(`${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?_type=json&searchMtNm=${mountain_keyword}&serviceKey=${MOUNTAINS_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('getTrailData',data)
    const mntncd = data.response.body.items.item.mntncd
    await displayMntInfoArticle(data.response.body.items.item)
    await getMntTrail(mntncd);
}
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
    const mntiDetails = info.details.length >= 300? `${info.details.slice(0,300)}...`: info.details
    document.querySelector(".details-mnt-information article").innerHTML = `
        <h5><b>${info.mntnm}</b></h5>
        <p><span>고도 |</span> <span>${info.mntheight} m</span></p>
        <p><span>지역 |</span> <span>${info.areanm}</span></p>
        <p><span>소개 |</span> <span>${mntiDetails}</span></p>
        
        <b>추가로 100대명산 선정이유, 산정보개관, 대중교통정보설명, 주변관광정보설명, 산정보주변관광정보기타코스설명 보이게 할 예정</b>`;
}

const getMntTrail = async (mntncd) => {
    url = new URL(`${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoImgOpenAPI?_type=json&searchWrd=${mntncd}&serviceKey=${MOUNTAINS_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('getMntTrail',data)
    const trailArray = data.response.body.items.item
    displayMntTrailInfo(trailArray)
}
// titl	산행추가제목
// content	산행추가설명
// image	산행이미지순번
const displayMntTrailInfo = async (trailArray) => {
    const MntTrailInfoHTML = trailArray.map((trail) => {
        return `
        <img src="http://www.forest.go.kr/swf/foreston/mountain/${trail.image}" alt="">
        <p>${trail.titl}</p>
        <p>${trail.content}</p>`
    }).join("");
    document.querySelector(".details-mnt-trail").innerHTML = MntTrailInfoHTML
}