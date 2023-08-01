/*
    Main API/script page to record incoming audio.
    General Gist: Media Recorder takes a MediaDevice API to know where it's getting audio from
*/

const AudioRecorder = function() {

    /**
     * Stores whether or not audio recorder is active
     */
    this.recording = false;

    /**
     * Stores audio data. This should be an array of blobs
     */
    this.audioData = [];

    /**
     * The actual thing doing the data. Make sure you call this.start() so the `mediaRecorder` exists to begin with.
     */
    this.mediaRecorder = null;

    /**
     * Starts recording audio
     * @returns {Promise} Resolves if audio recording has successfully started
     */
    this.start = function() 
    {
        return new Promise((resolve, reject) => {

            //Check if we have Audio API is even supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
            {
                //If mediaRecorder is on, now it doesn't do anything because microphone perms are revoked
                this.mediaRecorder = null;

                reject(new OverconstrainedError("No Audio API detected"));
                return; //Don't think we need a return here
            }

            navigator.mediaDevices.getUserMedia({audio: true, video: false})
                .then(stream => {
                    this.recording = true;
                    
                    //Every set interval, we want new data to be processed in the FFT
                    this.audioData = [];

                    if (!this.mediaRecorder)
                    {
                        this.mediaRecorder = new MediaRecorder(stream);

                        this.mediaRecorder.ondataavailable(e => {
                            this.audioData.push(e.data);
                        });
                    }

                    //Start recording!
                    this.mediaRecorder.start();
                });
            });
    }

    /**
     * Stops recording audio
     * @returns {Promise} Resolves an audio blob
     */
    this.stop = function() {
        return new Promise((resolve, reject) => {

        })
    };

    /**
     * Just completely cancels process of creating audio
     * @returns {Promise}
     */
    this.cancel = function() {
        return new Promise((resolve, reject) => {

        });
    }
};

export default AudioRecorder;