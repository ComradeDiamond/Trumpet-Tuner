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
         * @type {MediaRecorder}
         * The actual microphone recording
         */
        this.mediaRecorder = null;

        /**
         * @type {AudioContext}
         * Just an instance of AudioContext we can use later to decode things.
         * It's here so we don't have to constantly re-construct this
         */
        this.audioContext = new AudioContext();
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
            this.mediaRecorder.ondataavailable = (async e => {
                let blobBuffer = await e.data.arrayBuffer();
                let amplitudeArr = await this.#processAudioData(blobBuffer);
                this.onDataAvailable(await amplitudeArr)
            });

            this.mediaRecorder.start(1000);
        }
    }

    /**
     * Private method. Given an audio blob, return an Array of its "amplitudes" as a mono channel.
     * @param {ArrayBuffer[]} blobBuffer An array buffer, created from each audio blob 
     * @return {Array[]} An array consisting of the blob "amplitudes"
     */
    async #processAudioData(blobBuffer)
    {
        const stereoBuffer = await this.audioContext.decodeAudioData(blobBuffer)
        this.#collapseToMono(stereoBuffer);

        return stereoBuffer.getChannelData(0);
    }

    /**
     * Takes an audioBuffer (created by decoding blobBuffer data) and ensures that it collapses to a mono channel so we can FFT it later.
     * @param {AudioBuffer} audioBuffer Stereo Buffer (probably)
     * @after To save time/space, this overwrites the 1st channel of the given audioBuffer with the mono channel data.
     */
    #collapseToMono(audioBuffer)
    {
        const numChannels = audioBuffer.numberOfChannels;
        const numSamples = audioBuffer.length;

        //The way to convert stereo --> mono is to average (in music terms, mix) the sound waves from both channels
        const averageAmplitude = new Float32Array();    //copyToChannel() uses Float32

        for (let sample = 0; sample < numSamples; sample++)
        {
            var sum = 0;

            for (var channel = 0; channel < numChannels; channel++)
            {
                sum += audioBuffer.getChannelData(channel)[sample];
            }
        }
        averageAmplitude.push(sum / numChannels);

        audioBuffer.copyToChannel(averageAmplitude, 0);
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
     * The `audioData` will be an array of sound amplitudes recorded during the data duration
     * There will be an argument that gets passed in which contains the decoded audio data (monochannel)
     * @example ```
     * AudioRecorder.prototype.onDataAvailable = (audioData) => { doSomething(audioData) }
     * ```
     */
    onDataAvailable()
    {

    }
}