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

import { Mixer, Sample, SampleInstance, Sound, SoundStream } from './audialis.js';
import { DataStream } from './data-stream.js';
import Fido from './fido.js';
import { Font } from './fontso.js';
import Game from './game.js';
import Galileo, { BlendOp, Color, DepthOp, IndexList, Model, Shader, Shape, ShapeType, Surface, Texture, Transform, VertexList } from './galileo.js';
import PrimNative from './primNative.js';
import InputEngine, { Joystick, Key, Keyboard, Mouse, MouseKey } from './input-engine.js';
import JobQueue, { Dispatch, JobToken, JobType } from './job-queue.js';
import Version from './version.js';

const DataType =
{
	Bytes: 0,
	JSON: 1,
	Lines: 2,
	Raw: 3,
	Text: 4,
};

const FileOp =
{
	Read: 0,
	Update: 1,
	Write: 2,
};

// Dropboxes for interop with C#.
globalThis.DirectoryHelperDropbox = {};
globalThis.FileExistsHelperDropbox = {};
globalThis.FileSaveHelperDropbox = {};

const console = globalThis.console;

var mainObject;

export default
class Pegasus
{
	static initialize()
	{
		// register Sphere v2 API globals
		Object.assign(globalThis, {
			// enumerations
			BlendOp,
			DataType,
			DepthOp,
			FileOp,
			JobType,
			Key,
			MouseKey,
			ShapeType,

			// classes and namespaces
			Sphere,
			Color,
			Dispatch,
			FS,
			File,
			FileStream,
			Font,
			IndexList,
			JobToken,
			Joystick,
			Keyboard,
			Mixer,
			Model,
			Mouse,
			SSj,
			Shader,
			Shape,
			Sound,
			Sample,
			SampleInstance,
			SoundStream,
			Surface,
			Texture,
			Transform,
			VertexList,
			PrimNative,
			DirectoryStream
		});
	}

	static async launchGame(rootPath)
	{
		// load the game's JSON manifest
		await Game.initialize(rootPath);

		Dispatch.onRender(() => {
			if (Fido.numJobs === 0)
				return;
			const status = Fido.progress < 1.0
				? `${Math.floor(100.0 * Fido.progress)}% - ${Fido.numJobs} files`
				: `loading ${Fido.numJobs} files`;
			const textSize = Font.Default.getTextSize(status);
			const x = Surface.Screen.width / 2 - textSize.width / 2;
			const y = Surface.Screen.height / 2 - textSize.height / 2;
			Font.Default.drawText(Surface.Screen, x + 1, y + 1, status, Color.Black);
			Font.Default.drawText(Surface.Screen, x, y, status, Color.Silver);
		}, {
			inBackground: true,
			priority: Infinity,
		});

		// start the Sphere v2 event loop
		JobQueue.start();

		await Game.launch();
	}
}

class Sphere
{
	static get APILevel()
	{
		return Version.apiLevel;
	}

	static get Compiler()
	{
		return undefined;
	}

	static get Engine()
	{
		return `${Version.engine} ${Version.version}`;
	}

	static get Game()
	{
		return Game.manifest;
	}

	static get Version()
	{
		return Version.apiVersion;
	}

	static get frameRate()
	{
		return 60;
	}

	static get frameSkip()
	{
		return 0;
	}

	static get fullScreen()
	{
		return Surface.Screen.width == desktopResolution.width;
	}

	static set frameRate(value)
	{
		throw Error(`'Sphere.frameRate' cannot be set in Oozaru`);
	}

	static set frameSkip(value)
	{
		throw Error(`'Sphere.frameSkip' cannot be set in Oozaru`);
	}

	static set fullScreen(value)
	{
		if (value !== false && Surface.Screen.width != desktopResolution.width)
			Galileo.rerez(desktopResolution.width, desktopResolution.height)
	}

	static get main()
	{
		return mainObject;
	}

	static now()
	{
		return JobQueue.now();
	}

	static shutDown()
	{
		print("ShutdownHelper")
	}

	static sleep(numFrames)
	{
		return new Promise((resolve) => {
			Dispatch.later(numFrames, resolve);
		});
	}

	static setResolution(width, height)
	{
		Galileo.rerez(width, height);
	}

	static get desktopResolution()
	{
		return desktopResolution
	}

	static audioEnabled()
	{
		return true
	}

	static openURL(url)
	{
		print("openURLHelper:" + url)
	}
}

class FS
{
	static fullPath(pathName, baseDirName)
	{
		return Game.fullPath(pathName, baseDirName);
	}
}

class File
{
	static async exists(fileName)
	{
		if (!isXbox)
			return Promise.resolve(true)
		return new Promise(resolve => {
			return new Promise(fileExistHelperPromise => {
				FileExistsHelperDropbox[fileName] = fileExistHelperPromise
				print("FileExistsHelper:" + fileName)
			}).then(result => {
				delete FileExistsHelperDropbox[fileName]
				resolve(result)
			})
		})
	}

	static async load(fileName, dataType = DataType.Text)
	{
		// If loading from LocalStorage on HTML5.
		if (!isXbox && fileName.charAt(0) == "~")
		{
			if (dataType != DataType.Bytes && dataType != DataType.Text)
				throw Error("Unable to load data type from LocalStorage. Please use only DataType.Text or DataType.Bytes.")

			let result = localStorage.getItem(fileName.replace("~/", ""))
			if (dataType == DataType.Bytes) result = Uint8Array.fromBase64(result)
			return Promise.resolve(result)
		}

		// Else, load as normal.
		const url = Game.urlOf(fileName);
		switch (dataType) {
			case DataType.Bytes:
				const data = await Fido.fetchData(url);
				return new Uint8Array(data);
			case DataType.JSON:
				return Fido.fetchJSON(url);
			case DataType.Lines:
				const text = await Fido.fetchText(url);
				return text.split(/\r?\n/);
			case DataType.Raw:
				return Fido.fetchData(url);
			case DataType.Text:
				return Fido.fetchText(url);
		}
	}

	static async remove(fileName)
	{
		throw Error(`'File.remove' is not implemented`);
	}

	static async rename(fileName, newFileName)
	{
		throw Error(`'File.rename' is not implemented`)
	}

	static async run(fileName)
	{
		const url = Game.urlOf(fileName);
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.onload = () => {
				resolve();
				script.remove();
			}
			script.onerror = () => {
				reject(Error(`Couldn't load JS script '${url}'`));
				script.remove();
			}
			script.src = url;
			document.head.appendChild(script);
		});
	}

	static async save(fileName, data)
	{
		// If HTML5, save to LocalStorage (if any)
		if (!isXbox && typeof(Storage) !== "undefined")
		{
			if (data instanceof Uint8Array) data = data.toBase64()
			localStorage.setItem(fileName.replace("~/",""), data)
			return Promise.resolve()
		}

		// Else, use C# helpers in UWP build.
		return new Promise(resolve => {
			return new Promise(FileSaveHelperPromise => {
				FileSaveHelperDropbox[fileName] = FileSaveHelperPromise
				print("FileSaveHelper:" + fileName + " " + data.join("|"))
			}).then(() => {
				delete FileSaveHelperDropbox[fileName]
				resolve()
			})
		})
	}
}

class FileStream
{
	#dataStream;
	#fullPath;

	static async fromFile(fileName, fileOp)
	{
		if (fileOp !== FileOp.Read)
			throw RangeError(`Opening files in write mode is not yet supported`);

		const url = Game.urlOf(fileName);
		const data = await Fido.fetchData(url);
		const fileStream = Object.create(this.prototype);
		fileStream.#fullPath = fileName;
		fileStream.#dataStream = new DataStream(data);
		return fileStream;
	}

	constructor()
	{
		throw RangeError(`'new FileStream()' is not supported`);
	}

	get fileName()
	{
		return this.#fullPath;
	}

	get fileSize()
	{
		if (this.#dataStream === null)
			throw Error(`The FileStream has already been disposed`);
		return this.#dataStream.bufferSize;
	}

	get position()
	{
		if (this.#dataStream === null)
			throw Error(`The FileStream has already been disposed`);
		return this.#dataStream.position;
	}

	set position(value)
	{
		if (this.#dataStream === null)
			throw Error(`The FileStream has already been disposed`);
		this.#dataStream.position = value;
	}

	dispose()
	{
		this.#dataStream = null;
	}

	read(numBytes)
	{
		if (this.#dataStream === null)
			throw Error(`The FileStream has already been disposed`);
		return this.#dataStream.readBytes(numBytes).buffer;
	}

	write(data)
	{
		if (this.#dataStream === null)
			throw Error(`The FileStream has already been disposed`);
		throw Error(`'FileStream#write' is not yet implemented.`);
	}
}

class DirectoryStream
{
	#directoryPath
	#directoryContents
	#position = 0

	static async fromURL(path)
	{
		// If HTML5 build, use directories.js pre-built directory.
		if (!isXbox)
		{
			path = path.charAt(path.length - 1) == "/" ? path.substring(0, path.length - 1) : path
			if (!(path in directories)) print(`Path ${path} not found in directories.`)
			let directoryStream = new DirectoryStream(directories[path])
			directoryStream.fileName = path
			return Promise.resolve(directoryStream)
		}

		// Else, use C# helpers in UWP build.
		return new Promise(resolve => {
			new Promise(directoryHelperPromise => {
				DirectoryHelperDropbox[path] = directoryHelperPromise
				print("DirectoryHelper:" + path)
			}).then(result => {
				delete DirectoryHelperDropbox[path]
				let directoryStream = new DirectoryStream(result)
				directoryStream.fileName = path
				resolve(directoryStream)
			})
		})
	}

	constructor(contents)
	{
		if (typeof contents == "string")
			throw RangeError(`'new DirectoryStream(path)' is not supported. Use DirectoryStream.fromURL(path) instead.`);
		this.#directoryContents = contents
	}

	set fileName(value) { this.#directoryPath = value }
	get fileName() { return this.#directoryPath }
	get fileCount() { return this.#directoryContents.length }
	get position() { return this.#position }
	next() { return this.#position < this.fileCount ? { value: this.#directoryContents[this.#position++], done: false } : { done: true } }
	rewind() { this.#position = 0 }
}

class SSj
{
	static log(object)
	{
		console.log(object);
	}

	static now()
	{
		return performance.now() / 1000.0;
	}
}
