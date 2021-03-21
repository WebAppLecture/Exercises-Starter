/**
 * https://artandlogic.com/2019/07/unlocking-the-web-audio-api/
 */
export class BufferLoader {

    constructor() {
        this._af_buffers = new Map();
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this._isUnlocked = false;
        this._unlockAudio();
    }
    
    /**
     * A shim to handle browsers which still expect the old callback-based decodeAudioData,
     * notably iOS Safari - as usual.
     * @param arraybuffer
     * @returns {Promise<any>}
     * @private
     */
    _decodeShim(arraybuffer) {
        return new Promise((resolve, reject) => {
            _audioCtx.decodeAudioData(arraybuffer, (buffer) => {
                return resolve(buffer);
            }, (err) => {
                return reject(err);
            });
        });
    }
    
    /**
     * Some browsers/devices will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * Borrows in part from: https://github.com/goldfire/howler.js/blob/master/src/howler.core.js
     */
    _unlockAudio() {
        if (this._isUnlocked) return;

        // Scratch buffer to prevent memory leaks on iOS.
        // See: https://stackoverflow.com/questions/24119684/web-audio-api-memory-leaks-on-mobile-platforms
        const _scratchBuffer = this._audioCtx.createBuffer(1, 1, 22050);

        // We call this when user interaction will allow us to unlock
        // the audio API.
        let unlock = () => {
            let source = this._audioCtx.createBufferSource();
            source.buffer = _scratchBuffer;
            source.connect(this._audioCtx.destination);

            // Play the empty buffer.
            source.start(0);

            // Calling resume() on a stack initiated by user gesture is
            // what actually unlocks the audio on Chrome >= 55.
            if (typeof this._audioCtx.resume === 'function') {
                this._audioCtx.resume();
            }

            // Once the source has fired the onended event, indicating it did indeed play,
            // we can know that the audio API is now unlocked.
            source.onended = function () {
                source.disconnect(0);

                // Don't bother trying to unlock the API more than once!
                this._isUnlocked = true;

                // Remove the click/touch listeners.
                document.removeEventListener('touchstart', unlock, true);
                document.removeEventListener('touchend', unlock, true);
                document.removeEventListener('click', unlock, true);
            };
        };

        // Setup click/touch listeners to capture the first interaction
        // within this context.
        document.addEventListener('touchstart', unlock, true);
        document.addEventListener('touchend', unlock, true);
        document.addEventListener('click', unlock, true);
    }
    
    /**
     * Allow the requester to load a new sfx, specifying a file to load.
     * We store the decoded audio data for future (re-)use.
     * @param {string} sfxFile
     * @returns {Promise<AudioBuffer>}
     */
    async load (sfxFile) {
        if (this._af_buffers.has(sfxFile)) {
            return this._af_buffers.get(sfxFile);
        }

        const _sfxFile = await fetch(sfxFile);
        const arraybuffer = await _sfxFile.arrayBuffer();
        let audiobuffer;

        try {
            audiobuffer = await this._audioCtx.decodeAudioData(arraybuffer);
        } catch (e) {
            // Browser wants older callback based usage of decodeAudioData
            audiobuffer = await this._decodeShim(arraybuffer);
        }

        this._af_buffers.set(sfxFile, audiobuffer);

        return audiobuffer;
    };
    
    /**
     * Play the specified file, loading it first - either retrieving it from the saved buffers, or fetching
     * it from the network.
     * @param sfxFile
     * @returns {Promise<AudioBufferSourceNode>}
     */
    play (sfxFile, volume) {
        return this.load(sfxFile).then((audioBuffer) => {
            const sourceNode = this._audioCtx.createBufferSource(),
                gainNode = this._audioCtx.createGain();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(gainNode);
            gainNode.connect(this._audioCtx.destination);
            gainNode.gain.value = volume || 1;
            sourceNode.start();

            return sourceNode;
        });
    };
    
}