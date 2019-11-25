/* Author: Pablo Sagastizabal */

const urlServer = 'http://localhost:5000/api/';

getAllErrors();

function generateError() {
    try {
        let r = new XMLHttpRequest();
        r.onreadystatechange = function() {
            if (r.readyState == 4 && r.status == 200) {
            let logs = JSON.parse(r.responseText);
            displayLog(logs);
            } else return;
        };

        r.open("POST", `${urlServer}log`, true);
        r.send();
    } catch {
        console.log("There was an error trying to... generate an error.");
    }
}

function getAllErrors() {
    try {
        let r = new XMLHttpRequest();
        r.onreadystatechange = function () {
            if (r.readyState == 4 && r.status == 200) {
                let logs = JSON.parse(r.responseText);
                displayLog(logs);
            } else return;
        }
        
        r.open("GET", `${urlServer}log`, true);
        r.send();
    } catch {
        console.log('There was an error trying to connect to server logger.');
    }
    
}

function displayLog(logs) {
    const element = document.getElementById("logs");
    
    logs.forEach(log => {
                   let newDiv = document.createElement("div");
                   let divContent = document.createTextNode(log);
                   if (log.match("Frequently Error Reported Vía Email")) {
                       newDiv.classList.add('mail-notification');
                   }
                   newDiv.appendChild(divContent);
                   element.appendChild(newDiv);
                });
    /* Go to the bottom in the log container.*/ 
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

