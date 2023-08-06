//Fires when page loads
function initialize()
{
    handleAudio();
}

//Starts the audio recorder
function handleAudio()
{
    const recorder = new AudioRecorder();
    recorder.initialize()
        .then(() => {
            recorder.start();

            recorder.onDataAvailable = (audioData) => {
                console.log(audioData);
            };

            //Edit the HTML element that blinks recording
            document.getElementById("circleFlash").classList.add("activated");
            document.getElementById("recStatus").innerText = "Recording";
        }).catch(errMessage => {
            document.getElementById("recStatus").innerText = errMessage;
            console.error(errMessage);
        });
}