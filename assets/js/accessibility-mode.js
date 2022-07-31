let accessibilityModeIsOn = false;
function accModeSwitch() {
    let body = document.body;
    let navigate = document.getElementById('navigate');
    if (accessibilityModeIsOn == false) {
        body.setAttribute('class', 'accessibility-mode-on');
        navigate.setAttribute('class', 'navigate-accessibility');
        document.getElementById('toolbox').setAttribute('class', 'pos-fixed-accessibility')
        accessibilityModeIsOn = true;
    }
    else {
        body.setAttribute('class', '');
        navigate.setAttribute('class', 'navigate');
        accessibilityModeIsOn = false;
    }
}