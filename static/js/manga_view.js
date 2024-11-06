

//コマを進む・戻る
let panel = 0;

const next = document.getElementById("nextPanel");
const prev = document.getElementById("prevPanel");

var manga_pages=[];
var num_panels = 9;

//remove [ ] from string
var manga_pages_str = document.getElementById("manga_list").value;
manga_pages_str = manga_pages_str.replace("[", "");
manga_pages_str = manga_pages_str.replace("]", "");
//remove ' from string
manga_pages_str = manga_pages_str.replace(/'/g, "");
//split string to array
manga_pages = manga_pages_str.split(", ");
//decode base64 to image
for (let i = 0; i < num_panels; i++) {
    manga_pages[i] = "data:image/png;base64," + manga_pages[i];
}


console.log(manga_pages);


window.onload = function () { 
    window.scrollTo(0, 270);
    document.querySelector("#manga").setAttribute('src', manga_pages[0]);

};

next.addEventListener('click', () => {
    panel++;
    let currentPanel = manga_pages[panel];
    document.querySelector("#manga").setAttribute('src', manga_pages[panel]);
    if (panel >= num_panels-1) {
        next.style.display = "none";
    }
    if (window.getComputedStyle(prev).getPropertyValue('display') == "none") {
        prev.style.display = "block"
    }
});

prev.addEventListener('click', () => {
    panel--;
    let currentPanel = manga_pages[panel];
    document.querySelector("#manga").setAttribute('src', manga_pages[panel  ]);
    if (panel <= 0) {
        prev.style.display = "none";
    }
    if (window.getComputedStyle(next).getPropertyValue('display') == "none") {
        next.style.display = "block";
    }
});

//ボタンの影
document.querySelectorAll(".button").forEach(e => {
    e.addEventListener('mousedown', () => {
        e.style.boxShadow = "0px 0px 0px";
    });
    e.addEventListener('mouseup', () => {
        e.style.boxShadow = "0px 5px 8px rgba(0,0,0,0.3)";
    });
});


function Base64ToImage(base64img, callback) {
    var img = new Image();
    img.onload = function() {
        callback(img);
    };
    img.src = base64img;
}