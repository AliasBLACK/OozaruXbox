/**
 *  Oozaru: Sphere for the Web
 *  Copyright (c) 2016-2024, Fat Cerberus
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *  * Neither the name of Spherical nor the names of its contributors may be
 *    used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
**/

import { Deque } from './deque.js';
import Fido from './fido.js';
import Game from './game.js';

var defaultMixer = null;

export default
class Audialis
{
	static async initialize()
	{
		defaultMixer = new Mixer(44100, 16, 2);
	}
}

export
class Mixer
{
	#audioContext;
	#gainNode;
	#panNode;
	#attachedMixers = [];
	#parent;
	#volume;

	static get Default()
	{
		return defaultMixer;
	}

	constructor(sampleRate, bits, numChannels = 2)
	{
		this.#audioContext = new AudioContext({ sampleRate });
		this.#gainNode = this.#audioContext.createGain();
		this.#panNode = this.#audioContext.createStereoPanner();
		this.#gainNode.gain.value = this.#volume = 1.0;
		this.#gainNode
			.connect(this.#panNode)
			.connect(this.#audioContext.destination);
	}

	get pan()
	{
		return this.#panNode.pan.value;
	}

	get volume()
	{
		return this.#volume;
	}

	get parent()
	{
		return this.#parent;
	}

	set pan(value)
	{
		this.#panNode.pan.value = value;
	}

	set volume(value)
	{
		this.updateVolume(value)
	}

	set parent(value)
	{
		this.#parent = value
	}

	get audioContext()
	{
		return this.#audioContext
	}

	updateVolume(value)
	{
		this.#volume = value
		if (this.#parent)
			value *= this.#parent.#gainNode.gain.value
		this.#gainNode.gain.value = value;
		this.#attachedMixers.forEach(child => child.updateVolume(child.volume))
	}

	attachAudio(audioElement)
	{
		const audioNode = this.#audioContext.createMediaElementSource(audioElement);
		audioNode.connect(this.#gainNode);
		return audioNode;
	}

	attachBuffer(audioBuffer)
	{
		const audioNode = this.#audioContext.createBufferSource();
		audioNode.buffer = audioBuffer;
		audioNode.connect(this.#gainNode)
		return audioNode
	}

	attachScript(numChannels, callback)
	{
		const node = this.#audioContext.createScriptProcessor(0, 0, numChannels);
		node.onaudioprocess = (e) => callback(e.outputBuffer);
		node.connect(this.#gainNode);
		return node;
	}

	attachMixer(parent)
	{
		if (this.#parent != null)
			this.#parent.#attachedMixers.splice(this.#parent.#attachedMixers.indexOf(this), 1)
		this.#parent = parent
		this.#parent.#attachedMixers.push(this)
	}
}

export
class Sound
{
	#audioElement;
	#audioNode = null;
	#currentMixer = null;
	#fileName;
	#audioBuffer;
	#useWebAudio;
	#volume;
	#speed;
	#repeat;
	#playing;
	#instances;

	static async fromFile(fileName)
	{
		const url = Game.urlOf(fileName);
		
		// Try Web Audio API first
		try {
			Fido.startProcessingJob();
			const arrayBuffer = await Fido.fetchData(url);
			
			// Track audio decoding as a processing job
			let audioBuffer;
			try {
				audioBuffer = await defaultMixer.audioContext.decodeAudioData(arrayBuffer);
			} finally {
				Fido.endProcessingJob();
			}
			
			// Create a special sound object that uses Web Audio API
			const sound = new Sound(null); // Pass null to indicate Web Audio usage
			sound.#fileName = Game.fullPath(fileName);
			sound.#audioBuffer = audioBuffer;
			sound.#useWebAudio = true;
			return sound;
		} catch (error) {
			// Fallback to HTMLAudioElement if Web Audio fails
			console.warn('Web Audio API failed, falling back to HTMLAudioElement:', error);
			
			const blob = await Fido.fetch(url);
			const blobUrl = URL.createObjectURL(blob);
			const audioElement = new Audio();
			await new Promise((resolve, reject) => {
				audioElement.onloadedmetadata = () => {
					resolve();
				}
				audioElement.onerror = () => {
					reject(Error(`Couldn't load audio file '${url}'.`));
				};
				audioElement.src = blobUrl;
			});
			const sound = new Sound(audioElement);
			sound.#fileName = Game.fullPath(fileName);
			return sound;
		}
	}

	constructor(source)
	{
		if (source === null) {
			// Web Audio API usage
			this.#audioElement = null;
			this.#useWebAudio = true;
			this.#audioBuffer = null;
			this.#volume = 1.0;
			this.#speed = 1.0;
			this.#repeat = false;
			this.#playing = false;
			this.#instances = new Set();
		}
		else if (source instanceof HTMLAudioElement) {
			this.#audioElement = source;
			this.#audioElement.loop = true;
			this.#useWebAudio = false;
		}
		else if (typeof source === 'string') {
			throw Error("'new Sound' from filename is not supported");
		}
		else {
			throw TypeError(`Invalid value '${source}' passed for 'Sound' source`);
		}
	}

	get fileName()
	{
		return this.#fileName;
	}

	get length()
	{
		if (this.#useWebAudio) {
			return this.#audioBuffer ? this.#audioBuffer.duration : 0;
		}
		return this.#audioElement.duration;
	}

	get playing()
	{
		if (this.#useWebAudio) {
			return this.#playing;
		}
		return !this.#audioElement.paused;
	}

	get position()
	{
		if (this.#useWebAudio) {
			// Web Audio API doesn't expose position easily
			return 0;
		}
		return this.#audioElement.currentTime;
	}

	get repeat()
	{
		if (this.#useWebAudio) {
			return this.#repeat;
		}
		return this.#audioElement.loop;
	}

	get speed()
	{
		if (this.#useWebAudio) {
			return this.#speed;
		}
		return this.#audioElement.playbackRate;
	}

	get volume()
	{
		if (this.#useWebAudio) {
			return this.#volume;
		}
		return this.#audioElement.volume;
	}

	set position(value)
	{
		if (!this.#useWebAudio) {
			this.#audioElement.currentTime = value;
		}
		// Web Audio API position control would require more complex implementation
	}

	set repeat(value)
	{
		if (this.#useWebAudio) {
			this.#repeat = value;
		} else {
			this.#audioElement.loop = value;
		}
	}

	set speed(value)
	{
		if (this.#useWebAudio) {
			this.#speed = value;
		} else {
			this.#audioElement.playbackRate = value;
		}
	}

	set volume(value)
	{
		if (this.#useWebAudio) {
			this.#volume = value;
			// Update all active instances
			for (const instance of this.#instances) {
				if (instance.gainNode) {
					instance.gainNode.gain.value = value;
				}
			}
		} else {
			this.#audioElement.volume = value;
		}
	}

	pause()
	{
		if (this.#useWebAudio) {
			this.#playing = false;
		} else {
			this.#audioElement.pause();
		}
	}

	play(mixer)
	{
		if (this.#useWebAudio) {
			// Use Web Audio API
			this.#playing = true;
			
			// Create a simple playback using the audio buffer
			const source = defaultMixer.audioContext.createBufferSource();
			source.buffer = this.#audioBuffer;
			source.loop = this.#repeat;
			source.playbackRate.value = this.#speed;
			
			// Create gain node for volume
			const gainNode = defaultMixer.audioContext.createGain();
			gainNode.gain.value = this.#volume;
			
			// Connect nodes
			source.connect(gainNode);
			gainNode.connect(defaultMixer.audioContext.destination);
			
			// Start playback
			source.start();
			
			// Store gainNode with source for tween compatibility
			source.gainNode = gainNode;
			
			// Track for stopping
			this.#instances.add(source);
			
			// Clean up when ended
			source.onended = () => {
				this.#instances.delete(source);
				if (this.#instances.size === 0) {
					this.#playing = false;
				}
			};
		} else {
			// Use original HTMLAudioElement path
			if (!mixer)
			{
				if (!this.#currentMixer) mixer = Mixer.Default
			}
			else if (mixer !== this.#currentMixer) {
				this.#currentMixer = mixer;
				if (this.#audioNode !== null)
					this.#audioNode.disconnect();
				this.#audioNode = mixer.attachAudio(this.#audioElement);
			}
			this.#audioElement.play();
		}
	}

	stop()
	{
		if (this.#useWebAudio) {
			this.#playing = false;
			for (const source of this.#instances) {
				try {
					source.stop();
				} catch (e) {
					// Source might already be stopped
				}
			}
			this.#instances.clear();
		} else {
			this.#audioElement.pause();
			this.#audioElement.currentTime = 0.0;
		}
	}
}

export
class Sample
{
	#filename;
	#audioBuffer;

	static async fromFile(fileName)
	{
		const url = Game.urlOf(fileName);
		const arrayBuffer = await Fido.fetchData(url);
		const audioBuffer = await Mixer.Default.audioContext.decodeAudioData(arrayBuffer);

		let sample = new Sample(audioBuffer);
		sample.#filename = Game.fullPath(fileName);
		return sample;
	}
	constructor(source) { this.#audioBuffer = source }
	get fileName() { return this.#filename }
	play(mixer = Mixer.Default, options = {})
	{
		return new SampleInstance (
			this.#audioBuffer,
			mixer,
			options
		)
	}
}

export
class SampleInstance
{
	#audioNode;

	constructor(source, mixer, options)
	{
		if (source instanceof AudioBuffer)
		{
			this.#audioNode = mixer.attachBuffer(source)
			if ("speed" in options) this.#audioNode.playbackRate = options.speed
			if ("loop" in options) this.#audioNode.loop = options.loop
			if ("pan" in options) this.#audioNode.connect(new StereoPannerNode(mixer.audioContext, { pan: options.pan }))
			if ("volume" in options) this.#audioNode.connect(new GainNode(mixer.audioContext, { gain: options.volume }))
			this.#audioNode.start()
		}
	}

	stop()
	{
		this.#audioNode.stop()
	}
}

export
class SoundStream
{
	#audioNode = null;
	#buffers = new Deque();
	#currentMixer = null;
	#inputPtr = 0.0;
	#numChannels;
	#paused = true;
	#sampleRate;
	#timeBuffered = 0.0;

	constructor(frequency = 22050, bits = 8, numChannels = 1)
	{
		if (bits != 32)
			throw RangeError("SoundStream bit depth must be 32-bit under Oozaru");
		this.#numChannels = numChannels;
		this.#sampleRate = frequency;
	}

	get length()
	{
		return this.#timeBuffered;
	}

	pause()
	{
		this.#paused = true;
	}

	play(mixer = Mixer.Default)
	{
		this.#paused = false;
		if (mixer !== this.#currentMixer) {
			if (this.#audioNode !== null)
				this.#audioNode.disconnect();
			this.#audioNode = mixer.attachScript(this.#numChannels, (buffer) => {
				const outputs = [];
				for (let i = 0; i < this.#numChannels; ++i)
					outputs[i] = buffer.getChannelData(i);
				if (this.#paused || this.#timeBuffered < buffer.duration) {
					// not enough data buffered or stream is paused, fill with silence
					for (let i = 0; i < this.#numChannels; ++i)
						outputs[i].fill(0.0);
					return;
				}
				this.#timeBuffered -= buffer.duration;
				if (this.#timeBuffered < 0.0)
					this.#timeBuffered = 0.0;
				const step = this.#sampleRate / buffer.sampleRate;
				let input = this.#buffers.first;
				let inputPtr = this.#inputPtr;
				for (let i = 0, len = outputs[0].length; i < len; ++i) {
					const t1 = Math.floor(inputPtr) * this.#numChannels;
					let t2 = t1 + this.#numChannels;
					const frac = inputPtr % 1.0;

					// FIXME: if `t2` is past the end of the buffer, the first sample from the
					//        NEXT buffer should be used, but actually doing that requires some
					//        reorganization, so just skip the interpolation for now.
					if (t2 >= input.length)
						t2 = t1;

					for (let j = 0; j < this.#numChannels; ++j) {
						const a = input[t1 + j];
						const b = input[t2 + j];
						outputs[j][i] = a + frac * (b - a);
					}
					inputPtr += step;
					if (inputPtr >= Math.floor(input.length / this.#numChannels)) {
						this.#buffers.shift();
						if (!this.#buffers.empty) {
							inputPtr -= Math.floor(input.length / this.#numChannels);
							input = this.#buffers.first;
						}
						else {
							// no more data, fill the rest with silence and return
							for (let j = 0; j < this.#numChannels; ++j)
								outputs[j].fill(0.0, i + 1);
							return;
						}
					}
				}
				this.#inputPtr = inputPtr;
			});
			this.#currentMixer = mixer;
		}
	}

	stop()
	{
		if (this.#audioNode !== null)
			this.#audioNode.disconnect();
		this.#buffers.clear();
		this.#inputPtr = 0.0;
		this.#currentMixer = null;
		this.#audioNode = null;
		this.#paused = true;
		this.#timeBuffered = 0.0;
	}

	write(data)
	{
		this.#buffers.push(data);
		this.#timeBuffered += data.length / (this.#sampleRate * this.#numChannels);
	}
}
