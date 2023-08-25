const FULL_BAND = 2051;

const recorder = new Recorder({
    numberOfChannels: 1,
    encoderApplication: FULL_BAND,
    encoderSampleRate: 24000,
    streamPages: true
});