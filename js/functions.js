function addListener(obj, eventName, listener) {
    if(obj.addEventListener) {
        obj.addEventListener(eventName, listener, false);
    } else {
        obj.attachEvent("on" + eventName, listener);
    }
}

function getXMLHttpRequest() {
    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }

    return xhr;
}

function send(url, method, parameters, callback, formData) {
    callback = callback || function(){};
    method = method.toUpperCase() || "GET";
    parameters = parameters || '';
    formData = formData || false;

    var xhr = getXMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr);
        }
    };

    if(!formData && parameters != null) {
        if (typeof parameters != 'string') {
            var stringParameters = '';

            for (var variable in parameters) {
                if (parameters.hasOwnProperty(variable)) {
                    if (stringParameters.length > 0) {
                        stringParameters += '&';
                    }

                    stringParameters += variable + '=' + parameters[variable];
                }
            }

            parameters = '?' + stringParameters;
        }
    }

    if(method == "GET" && !formData) {
        xhr.open(method, url + parameters, true);
        xhr.send();
    } else {
        xhr.open(method, url, true);

        if (!formData) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(parameters.substring(1));
        } else {
            xhr.send(parameters);
        }
    }

    return xhr;
}

function getPokemonVariants() {
    return [
        'alola',
        'extra',
        'female',
        'male',
        'mega',
        'shiny'
    ];
}