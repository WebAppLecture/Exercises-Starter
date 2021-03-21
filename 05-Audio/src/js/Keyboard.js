export class KeyBoard {

    constructor(keysDomReference, masterSection, oscillatorSection, filterSection) {
        this.audioContext = new window.AudioContext();  
        this.playingNotes = {};
        this.loadedNotes = {};
        this.generateKeyboard(keysDomReference);
        
        this.setupVolume(masterSection);
        this.setupDecay(masterSection);

        this.setupCompressor();
        
        this.setupFilter(filterSection);
        this.setupOscillators(oscillatorSection);
        this.setupDetune(oscillatorSection);
    }

    setupVolume(masterSection) {
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.connect(this.audioContext.destination);
        this.volume = .2;

        this.createFader(
            0, 1, .01, .2, masterSection,
            e => this.volume = e.target.value
        );
    }

    setupDecay(masterSection) {
        this.decayQueue = {};
        this.decayLoop();

        this.decayRange = this.createFader(
            0, 2000, 50, 500, masterSection
        );
    }

    setupCompressor() {
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-50, this.audioContext.currentTime);
        this.compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
        this.compressor.attack.setValueAtTime(0, this.audioContext.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
        this.compressor.connect(this.masterGainNode);
    }

    setupFilter(filterSection) {
        this.filterTable = ["lowpass","highpass","bandpass","lowshelf","highshelf","peaking","notch", "allpass"];
        this.biquadFilterNode = this.audioContext.createBiquadFilter();
        this.biquadFilterNode.type = "lowpass"; 
        this.biquadFilterNode.frequency.setValueAtTime(100, this.audioContext.currentTime);
        this.biquadFilterNode.Q.setValueAtTime(1, this.audioContext.currentTime);
        this.biquadFilterNode.connect(this.masterGainNode);

        this.createFader(0, this.filterTable.length - 1, 1, 0, filterSection, e => this.biquadFilterNode.type = this.filterTable[e.target.value]);
        this.createFader(-3, 3, 0.1, 0, filterSection, e => this.biquadFilterNode.Q.setValueAtTime(10 ** e.target.value, this.audioContext.currentTime));
        this.createFader(1, 4.5, 0.01, 1, filterSection, e => this.biquadFilterNode.frequency.setValueAtTime(10 ** e.target.value, this.audioContext.currentTime));

    }

    setupOscillators(oscillatorContainer) {
        this.oscillatorTable = ["sine", "square", "sawtooth", "triangle"];
        this.primaryOscillators = [];
        this.secondaryOscillators = [];
        this.osci1 = "sine";
        this.osci2 = "sawtooth";

        this.setupOscillator(this.primaryOscillators, this._osci1);
        this.setupOscillator(this.secondaryOscillators, this._osci2);

        this.createFader(
            0, 
            this.oscillatorTable.length - 1, 
            1, 
            this.oscillatorTable.indexOf(this._osci1), 
            oscillatorContainer,
            e => this.osci2 = this.oscillatorTable[e.target.value]
        );

        this.createFader(
            0, 
            this.oscillatorTable.length - 1, 
            1, 
            this.oscillatorTable.indexOf(this._osci2), 
            oscillatorContainer,
            e => this.osci1 = this.oscillatorTable[e.target.value]
        );
    }

    setupDetune(oscillatorContainer) {
        this.detune = 0;
        this.createFader(
            0,
            4,
            0.01,
            0,
            oscillatorContainer,
            e => this.detune = 10 ** e.target.value - 1
        );
    }

    setupOscillator(osciArray, waveForm) {
        let oscillator = this.audioContext.createOscillator();
        oscillator.type = waveForm; 
        osciArray.push(oscillator);
    }

    createFader(min, max, step, value, parent, listener) {
        let fader = document.createElement("input");
        fader.setAttribute("type", "range");
        fader.setAttribute("min", min);
        fader.setAttribute("max", max);
        fader.setAttribute("step", step);
        fader.value = value;
        fader.addEventListener("input", listener);
        parent.appendChild(fader);
        return fader;
    }

    set volume(volume) {
        this.masterGainNode.gain.value = volume;
    }

    set osci1(type) {
        this._osci1 = type;
        this.primaryOscillators.forEach(oscillator => oscillator.type = type);
    }

    set osci2(type) {
        this._osci2 = type;
        this.secondaryOscillators.forEach(oscillator => oscillator.type = type);
    }

    set detune(cents) {
        this._detune = cents;
        this.secondaryOscillators.forEach(oscillator => oscillator.detune.setValueAtTime(cents, this.audioContext.currentTime));
    }

    generateKeyboard(keysDomReference) {
        for(let i = 2; i <= 5; i++) {
            Object.keys(Note.NOTES).forEach(noteName => {
                let note = new Note(noteName, i);
                keysDomReference.appendChild(this.generateKey(note))
            });
        }    
    }

    generateKey(note) {
        let key = document.createElement("div");
        key.classList.add("key");
        key.setAttribute("data-note", note.note);
        key.setAttribute("data-octave", note.octave);
        key.innerHTML = note.note + "<sub>" + note.octave + "</sub>";
        
        key.addEventListener("mousedown",(e) => this.enter(note, e));
        key.addEventListener("mouseup", (e) => this.leave(note, e));

        key.addEventListener("mouseenter",(e) => this.enter(note, e));
        key.addEventListener("mouseleave",(e) => this.leave(note, e));
        return key;
    }

    getSoundSource(note) {
        let oscillator = this.audioContext.createOscillator(),
            oscillator2 = this.audioContext.createOscillator(),
            gainNode = this.audioContext.createGain();
        oscillator.frequency.value = note.frequency;
        oscillator2.frequency.value = note.frequency;
        oscillator.type = this._osci1;
        oscillator2.type = this._osci2;
        
        this.primaryOscillators.push(oscillator);
        this.secondaryOscillators.push(oscillator2);
        oscillator.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.biquadFilterNode);
        oscillator2.detune.setValueAtTime(1000, this.audioContext.currentTime);
        gainNode.gain.value = 0;
        oscillator.start();
        oscillator2.start();
        return gainNode;
    }

    play(note) {
        if(!this.loadedNotes.hasOwnProperty(note.id)) {
            this.loadedNotes[note.id] = this.getSoundSource(note);
        } 
        this.playingNotes[note.id] = true;
        delete this.decayQueue[note.id];
        this.loadedNotes[note.id].gain.value = .7;
    }

    enter(note, event) {
        if(event.button === 0 && event.which === 1) {
            event.target.classList.add("active");
            this.play(note);
        }
    }

    release(note) {
        if(this.playingNotes[note.id]) {
            this.playingNotes[note.id] = false;
            this.decayQueue[note.id] = true;
        }
    }

    leave(note, event) {
        if(event.button === 0 && event.which === 1) {
            event.target.classList.remove("active");
            this.release(note);
        }
    }

    decayLoop() {
        requestAnimationFrame(this.decayLoop.bind(this));
        if(!this.lastCalled) {
            this.lastCalled = performance.now();
            return;
        }
        let delta = (performance.now() - this.lastCalled);
        this.lastCalled = performance.now();
        Object.keys(this.decayQueue).forEach(key => {
            if(this.decayRange.value > 0 && this.loadedNotes[key].gain.value > 0) {
                this.loadedNotes[key].gain.value -= 1/(this.decayRange.value/delta);
            } else {
                this.loadedNotes[key].gain.value = 0;
                delete this.decayQueue[key];
            }           
        })
    }
}


export class Note {

    constructor(note, octave) {
        if(Note.NOTES.hasOwnProperty(note)) {
            this.note = note;      
        } else {
            console.error("Illegal value given for 'note'! Must be one of ", Object.keys(Note.NOTES));
        }
        if(octave >= 0 && octave <= 8) {
            this.octave = octave;
        } else {
            console.error("Illegal value given for 'octave'! Must be between 0 and 8!");
        }      
    }

    get frequency() {
        return Note.NOTES[this.note] * (2 ** (this.octave - 4));
    }

    get id() {
        return this.note + this.octave;
    }

    static get NOTES() {
        return {
            "C": 261.626,
            "C#": 277.183,
            "D": 293.665,
            "D#": 311.127,
            "E": 329.628,
            "F": 349.228,
            "F#": 369.994,
            "G": 391.995,
            "G#": 415.305,
            "A": 440.000,
            "A#": 466.164,
            "B": 493.883,
        };
    }

}