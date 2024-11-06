const icon = document.querySelector("#recIcon");
const direct2 = document.querySelector("#direct2");
const afterRec = document.querySelector("#afterRecorded");
let isRecording = false;
var json_data = [];
var speaker_data = {};
let base64data = '';
let temp_speaker = '';
let current_speaker = '';
let speaker_gender = 'male';

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

//ボタンの影
document.querySelectorAll(".button").forEach(e => {
    e.addEventListener('mousedown', () => {
        e.style.boxShadow = "0px 0px 0px";
    });
    e.addEventListener('mouseup', () => {
        e.style.boxShadow = "0px 5px 8px rgba(0,0,0,0.3)";
    });
});

$(document).on('mousedown', '#nextBtn', () => {
    nextBtn.style.boxShadow = "0px 0px 0px";
});
$(document).on('mouseup', '#nextBtn', () => {
    nextBtn.style.boxShadow = "0px 5px 8px rgba(0,0,0,0.3)";
});

//録音ボタンの挙動
document.querySelector("#recBtn").addEventListener('click', () => {
    let audioChunks = [];
    if (isRecording) {
        //録音停止
        afterRec.style.display = "flex";
        icon.src = "/static/img/mic.png"
        isRecording = false;
        mediaRecorder.stop();
        console.log("Status: " + mediaRecorder.state);
        mediaRecorder.ondataavailable = function (event) {
            audioChunks.push(event.data);
            let audioURL = window.URL.createObjectURL(event.data);
            console.log(audioURL);
            document.querySelector("#audio").src = audioURL;

        }
        mediaRecorder.onstop = function () {
            let blob = new Blob(audioChunks, { type: 'audio/webm' });
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                base64data = reader.result; 
            }
        }
        localStream.getTracks().forEach(track => track.stop());
        direct2.innerHTML = "この録音を使用する場合は，「次へ」をクリックしてください<br>撮りなおすには再度，マイクボタンをクリックしてください";
    }
    else {
        //録音開始
        icon.src = "/static/img/recSquare.png"
        isRecording = true
        const audio = document.querySelector("#audio");

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                localStream = stream;
                mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
                mediaRecorder.start();
                console.log("Status: " + mediaRecorder.state);
            }).catch(function (err) {
                console.log(err);
            });

        direct2.innerHTML = "";
        afterRec.style.display = "none";
    }
});

document.querySelector("#nextBtn").addEventListener('click', () => {
    speaker_data={};
    speaker_data['name'] = current_speaker;
    speaker_data['gender'] = speaker_gender;
    speaker_data['audio'] = base64data;
    console.log(speaker_data);
    json_data.push(speaker_data);
    document.querySelector("#json").value = JSON.stringify(json_data);
    document.querySelector("#form").submit();
});

document.querySelector("#check").addEventListener('click', () => {
    let name = document.querySelector("#nameInput").value;
    if (name.length > 0) {
        document.querySelector("#checkName").innerHTML = name + "さんで間違いはありませんか？";
        document.querySelector("#doubleCheck").style.display = "flex";
        document.querySelector("#ipt").style.display = "none";
        temp_speaker = name;
        
    }
});

document.querySelector("#reenter").addEventListener('click', () => {
    document.querySelector("#doubleCheck").style.display = "none";
    document.querySelector("#ipt").style.display = "flex";
    temp_speaker = '';
});

document.querySelector("#toRecording").addEventListener('click', () => {
    document.querySelector("#record").style.display = "flex";
    document.querySelector("#name").style.display = "none";
    current_speaker=temp_speaker;//話者を決定
    temp_speaker = '';//temp_speakerを初期化

});

document.querySelector("#backToName").addEventListener('click', () => {
    document.querySelector("#record").style.display = "none";
    document.querySelector("#name").style.display = "flex";
    document.querySelector("#doubleCheck").style.display = "none";
    document.querySelector("#ipt").style.display = "flex";
});
document.querySelector("#nextSpeaker").addEventListener('click', () => {
    document.querySelector("#record").style.display = "none";
    document.querySelector("#name").style.display = "flex";
    document.querySelector("#doubleCheck").style.display = "none";
    document.querySelector("#ipt").style.display = "flex";
    speaker_data={};
    speaker_data['name'] = current_speaker;
    speaker_data['gender'] = speaker_gender;
    speaker_data['audio'] = base64data;
    json_data.push(speaker_data);
    console.log(json_data);
    current_speaker = '';

});


