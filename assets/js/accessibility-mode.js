let accessibilityModeIsOn = false;
function accModeSwitch() {
    let body = document.body;
    let navigate = document.getElementById('navigate');
    if (accessibilityModeIsOn == false) {
        body.setAttribute('class', 'accessibility-mode-on');
        navigate.setAttribute('class', 'navigate-accessibility');
        document.getElementById('content').setAttribute('class', 'content-a11y');
        document.getElementById('toolbox').setAttribute('class', 'toolbox-a11y');
        accessibilityModeIsOn = true;
    }
    else {
        body.setAttribute('class', '');
        navigate.setAttribute('class', 'navigate');
        document.getElementById('content').setAttribute('class', 'content');
        document.getElementById('toolbox').setAttribute('class', 'toolbox');
        accessibilityModeIsOn = false;
    }
}