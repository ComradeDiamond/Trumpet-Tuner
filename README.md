# Trumpet-Tuner 🎺
## TLDR
Justin cannot read those weird Instrument Tuner apps on the iOS App Store. So here we are. <br />
Also this isn't an iOS app because Apple's trying to charge me $99/year to install my own app on my phone <br />
## Long Version
Have you ever played an E and have no idea if you're in the right octave? <br />
Have you ever been desperately in need of a tuner? <br />
Have you ever just <br />
<img src="https://i.imgur.com/Pfhgpr6.png" />
<img src="https://i.imgur.com/cMu9pfe.png" />
<img src="https://i.imgur.com/FLtAQBT.png" />
<img src="https://i.imgur.com/ciX5oWn.png" />

## Interesting Things To Note
The Audio APIs are extremely unstandardized, inconsistent, and undocumented. <br>
Working with Audio online is a pain - and that's an understatement <br>
* `opus-recorder` does not handle PCM conversion
* `ffmpeg` must be downloaded over Node.js, and even then it throws compatibility errors with `MediaRecorder API`
* Every browser does something dumb with `Media Recorder API`. Chrome only uses `audio/webm`, but then Safari doesn't support that and only uses `audio/ogg`... you get my point
* `AudioContext.decodeAudioData()` does not work with `audio/webm` for some reason
* There's no clear way to convert `audio/webm` to any other audio format. The documentation is also practically nonexistent
        --> To solve this we kind of have to use WebAudioRecorder library and then parse PCM from there