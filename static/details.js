import config from "../apikey.js"

const MOUNTAINS_KEY = config.KEY.mountains_key
const MOUNTAINS_URL = config.URL.mountains_url

let url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}`)

// 산 정보만 뽑을 경우
const getData = async() => {
    url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}&searchWrd=설악산`)
    const response = await fetch(url);
    const data = await response.json();
    const mntilistNo = data.response.body.items.item.mntilistno; // 산 코드
    console.log(data)
    getMntImgData(mntilistNo);
    displayMntInfoArticle({
        mntiName: data.response.body.items.item.mntiname,
        mntiHigh: data.response.body.items.item.mntihigh,
        mntiRegion: data.response.body.items.item.mntiadd,
        mntiDetails: data.response.body.items.item.mntidetails
    })
}
getData()

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

const displayMntInfoArticle = (info) => {
    document.querySelector(".details-mnt-information article").innerHTML = `
        <h5><b>${info.mntiName}</b></h5>
        <p><span>고도 |</span> <span>${info.mntiHigh}m</span></p>
        <p><span>지역 |</span> <span>${info.mntiRegion}</span></p>
        <p><span>소개 |</span> <span>${info.mntiDetails}</span></p>`;
}