const Api_Key = 'KMGHDGTtYyp8ZQ6PslEt0FGSzsPPNayDVL8SfwGe9yZtqZFk5BMQ9U8763MgRzvc5QykfH9fxyf1ZovtRuDkyQ==';
const apiUrl = 'https://apis.data.go.kr/1400000/service/cultureInfoService2/mntInfoOpenAPI2';

const getLatestNews = async () => {
    const url = new URL(apiUrl);
    url.searchParams.append('ServiceKey', Api_Key);

    try {
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlString = await response.text();
        let XmlNode = new DOMParser().parseFromString(xmlString, "text/xml");
        console.log(xmlToJson(XmlNode));

    } catch (error) {
        console.error('Error fetching the API:', error);
    }
};

getLatestNews();

function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue;
    }

    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
        return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
        obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
            return text + node.nodeValue;
        }, "");
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

window.addEventListener('load', function () {
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function (el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});
function includeHTML() {
    const headerDiv = document.getElementById("headerDiv");
    const footerDiv = document.getElementById("footerDiv");

    if (headerDiv) {
        fetch("layout/navbar.html")
            .then(response => response.text())
            .then(data => {
                headerDiv.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching header:', error);
            });
    }

    if (footerDiv) {
        fetch("layout/footer.html")
            .then(response => response.text())
            .then(data => {
                footerDiv.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching footer:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", includeHTML);