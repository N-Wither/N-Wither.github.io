if(CSS.paintWorklet){
    CSS.paintWorklet.addModule('/assets/js/csspainters/worklets/gradientdots.js');
}
else {
    console.warn("CSS Paint API not supported, please use latest Chromium browsers or enable it in Experimental Features if yor are using Safari.");
}