/*
    Main API/script page to record incoming audio.
    General Gist: Media Recorder takes a MediaDevice API to know where it's getting audio from
*/

/**
 * Class for Tuning and Audio Recording
 */
class AudioRecorder
{
    /**
     * Constructs an AudioRecorder instance
     */
    constructor(host)
    {
        /**
         * @type {Boolean}
         * Whether or not the AudioRecorder is recording
         */
        this.recording = false;

        /**
         * @type {Blob[]}
         * Data output from AudioRecorder
         */
        this.audioData = [];

        /**
         * @type {MediaRecorder}
         * The actual microphone recording
         */
        this.mediaRecorder = null;

        this.dataAvailable = new CustomEvent("dataAvailable", {
            data: this.audioData
        });
    }

    /**
     * Initializes the AudioRecorder and performs permission checks.
     * @returns {Promise} Resolves if audio recording has successfully started. Rejects with error message if an error occurs
     */
    initialize()
    {
        return new Promise((resolve, reject) => {
            if (this.mediaRecorder != null) return;

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            {
                reject(new Error("No Audio API Detected"));
            }

            //Fetches media stream, and then uses it to create mediaRecorder
            let mediaDevicesPromise = navigator.mediaDevices.getUserMedia({audio: true, video: false});
            
            mediaDevicesPromise.then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                resolve();
            });

            mediaDevicesPromise.catch(err => {
                if (err.message.indexOf("mediaDevices API or getUserMedia method is not supported in this browser.") != -1) 
                {       
                    reject("Audio Recording is not supported on this browser");
                }

                switch(err.name)
                {
                    case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                        reject("An OS AbortError has occured.");
                        break;
                    case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                        reject("Please enable Microphone permissions.");
                        break;
                    case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                        reject("No recording device found.");
                        break;
                    case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                        reject("A Hardware error has occured.");
                        break;
                    case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                        reject("A SecurityError has occured.");
                        break;
                    case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                        reject("Security Settings are blocking Audio Recording");
                        break;
                    default:
                        reject(`An ${err.name} has occured.`);
                }
            });
        });
    }

    /**
     * Starts the AudioRecorder.
     * When audio data is available, dispatches the `dataAvailable` event. This should happen approximately every once in 250 seconds
     * @returns 
     */
    start()
    {
        if (this.mediaRecorder == null)
        {
            console.error("Initialize the AudioRecorder first.");
        }
        else
        {
            this.recording = true;
            this.mediaRecorder.ondataavailable = (e => {
                this.audioData.push(e);
                this.onDataAvailable(this.audioData);
            });

            this.mediaRecorder.start(2000);
        }
    }

    /**
     * Stops the AudioRecorder. If nothing is recording right now, this does nothing.
     */
    stop()
    {
        if (!this.recording) return;

        this.mediaRecorder.ondataavailable = () => {};
        this.mediaRecorder.stop();
        this,this.recording = false;
    }

    /**
     * Event function that is called every time there is Audio Data available.
     * There will be an argument that gets passed in which contains `this.audioData`.
     * @example ```
     * AudioRecorder.prototype.onDataAvailable = (audioData) => { doSomething(audioData) }
     * ```
     */
    onDataAvailable()
    {

    }
}