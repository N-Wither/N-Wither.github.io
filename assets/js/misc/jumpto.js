if(window.location.search) {
    let params = window.location.search.substring(1).split("&");
    let result = {};
    params.forEach(function(param) {
        let keyValue = param.split("=");
        result[keyValue[0]] = keyValue[1];
    });
    if('jumpto' in result) {
        let route = (await import('./jumpto-route.js')).default
        let link = route[result['jumpto']]
        if(link) {
            window.location.href = link
        }
        else {
            window.location.href = '/404.html'
        }
    }
}