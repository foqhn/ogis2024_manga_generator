const icon = document.querySelector("#recIcon");
const direct2 = document.querySelector("#direct2");
const afterRec = document.querySelector("#afterRecorded");
let isRecording = false;
var json_data = [];
var speaker_data = {};
let base64data = '';
let temp_speaker = '';
let current_speaker = '';

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


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
        console.log("Sample Rate: " + localStream.getAudioTracks()[0].getSettings().sampleRate);
        console.log("Sample Width: " + localStream.getAudioTracks()[0].getSettings().sampleSize);
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
    speaker_data['audio'] = base64data;
    json_data.push(speaker_data);
    document.querySelector("#json").value = JSON.stringify(json_data);
    document.querySelector("#form").submit();
});