/*
    Main API/script page to record incoming audio.
    General Gist: Media Recorder takes a MediaDevice API to know where it's getting audio from
*/

const audioRecorder = {

    /**
     * Starts recording audio
     * @returns {Promise} Resolves if audio recording has successfully started
     */
    start: () => new Promise((resolve, reject) => {

        //Check if we have Audio API is even supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        {
            reject(new OverconstrainedError("No Audio API detected"));
            return; //Don't think we need a return here
        }
    }),
    /**
     * Stops recording audio
     * @returns {Promise} Resolves an audio blob
     */
    stop: () => new Promise((resolve, reject) => {

    }),
    /**
     * Just completely cancels process of creating audio
     * @returns 
     */
    cancel: () => new Promise((resolve, reject) => {

    })
};