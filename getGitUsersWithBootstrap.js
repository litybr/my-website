
document.getElementById('button').addEventListener('click', loadFile);

function loadFile() {

    var xhr = new XMLHttpRequest();
    //OPEN - type, url.file, async
    xhr.open('GET', 'https://api.github.com/users', true);
    
    xhr.onload = function() {
        if(this.status == 200){
            var users = JSON.parse(this.responseText);
            console.log(users);
        }
        var output = '';
        for ( var i in users){
            output += '<img src= "' + users[i].avatar_url + '" width="200" height="200" >' +
            '<li class="list-unstyled" style="margin-bottom:20px">' + users[i].login + '</li>';
            document.getElementById('myinfo').innerHTML = output;
        }
    }
    
    xhr.send();
}