function setLogos() {
    let logos = document.querySelectorAll('.msi-team-logo')
    logos.forEach(logo => {
        if (logo.getAttribute('class').match(/GEN/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/e/e3/Gen.Glogo_square.png" alt="GEN">'
        }
        else if (logo.getAttribute('class').match(/G2/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/77/G2_Esportslogo_square.png" alt="G2">'
        }
        else if (logo.getAttribute('class').match(/MAD/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/3/3c/MAD_Lionslogo_square.png" alt="MAD">'
        }
        else if (logo.getAttribute('class').match(/T1/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a2/T1logo_square.png" alt="T1">'
        }
        else if (logo.getAttribute('class').match(/C9/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/88/Cloud9logo_square.png" alt="C9">'
        }
        else if (logo.getAttribute('class').match(/BLG/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/91/Bilibili_Gaminglogo_square.png" alt="BLG">'
        }
        else if (logo.getAttribute('class').match(/JDG/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/00/JD_Gaminglogo_square.png" alt="JDG">'
        }
        else if (logo.getAttribute('class').match(/GG/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/9/98/Golden_Guardianslogo_square.png" alt="GG">'
        }
        else if (logo.getAttribute('class').match(/R7/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/2/2a/Movistar_R7logo_square.png" alt="R7">'
        }
        else if (logo.getAttribute('class').match(/GAM/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/8/8a/GAM_Esportslogo_square.png" alt="GAM">'
        }
        else if (logo.getAttribute('class').match(/LLL/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/7/76/LOUDlogo_square.png" alt="LLL">'
        }
        else if (logo.getAttribute('class').match(/PSG/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/4/48/PSG_Talonlogo_square.png" alt="PSG">'
        }
        else if (logo.getAttribute('class').match(/DFM/) != null) {
            logo.innerHTML = '<img src="https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/a/a7/DetonatioN_FocusMelogo_square.png" alt="DFM">'
        }
    })
}