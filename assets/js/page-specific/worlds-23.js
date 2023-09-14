let teams = {
    JDG: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/00/JD_Gaminglogo_square.png',
    BLG: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1682322954525_Bilibili_Gaming_logo_20211.png',
    LNG: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/d/d5/LNG_Esportslogo_square.png',
    WBG: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1641202879910_3.png',
    GEN: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1655210113163_GenG_logo_200407-05.png',
    T1: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9c/T1logo_SK_telecom.png',
    KT: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/kt_darkbackground.png',
    DK: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1673260049703_DPlusKIALOGO11.png',
    G2: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/77/G2_Esportslogo_square.png',
    FNC: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/fc/Fnaticlogo_square.png',
    MAD: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3c/MAD_Lionslogo_square.png',
    BDS: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/9e/Team_BDSlogo_square.png',
    NRG: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1681501735148_NRG_PRIMARY_LIGHT.png',
    C9: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/88/Cloud9logo_square.png',
    TL: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/f/f4/Team_Liquidlogo_square.png',
    GG: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/98/Golden_Guardianslogo_square.png',
    PSG: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1644501567410_PSG_3.png',
    CFO: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1656307849320_CFO_Logo.png',
    GAM: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8a/GAM_Esportslogo_square.png',
    TW: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1674646643550_TEAMWHALE_LOGO_VERSIONS_W_fullwhite-06-svg.png',
    DFM: 'https://am-a.akamaihd.net/image?resize=120:&f=http://static.lolesports.com/teams/1673415140442_dfm.png',
    LLL: 'https://am-a.akamaihd.net/image?resize=140:&f=http://static.lolesports.com/teams/Logo-LOUD-Esports_Original.png',
    R7: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2a/Movistar_R7logo_square.png'
}

let logos = document.querySelectorAll('.logo[data-team]')
logos.forEach(logo => {
    let name = logo.dataset.team
    logo.innerHTML = `<img src=${teams[name]} alt=${name}>`
    logo.removeAttribute('data-team')
})

let refreshTime = (timeZone, offset) => {
    let times = document.querySelectorAll('.info.time')
    times.forEach(time => {
        if (time.textContent == 'TBD') return;
        let raw = time.textContent + ' ' + offset
        // console.log(raw)
        time.textContent = localeDateTime(raw, timeZone).slice(0, -3)
    })
}

let getCurrentOffset = () => {
    let offset = new Date().getTimezoneOffset() / 60 * (-1)
    return offset >= 0 ? 'GMT+' + offset : 'GMT' + offset
}

let setTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
let setOffset = getCurrentOffset()
refreshTime(setTimeZone, setOffset)

document.getElementById('time-zone-option:you').onclick = () => {
    if(setOffset == getCurrentOffset()) return
    refreshTime(setTimeZone, 'UTC')
    setOffset = getCurrentOffset()
}
document.getElementById('time-zone-option:utc').onclick = () => {
    refreshTime('UTC', setOffset)
    setOffset = 'GMT+0'

}