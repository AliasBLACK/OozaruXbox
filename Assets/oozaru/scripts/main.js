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
 *  SUBSTITUTE GOODS OR SERVICES LOSS OF USE, DATA, OR PROFITS OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
**/

import Audialis from './audialis.js'
import Fontso from './fontso.js'
import Galileo from './galileo.js'
import InputEngine from './input-engine.js'
import Pegasus from './pegasus.js'
import Version from './version.js'

globalThis.print = function(string)
{
	string = String(string)
	isXbox ?
		window.chrome.webview.postMessage(string) :
		console.log(string)
}

main()

async function main()
{
	await Version.initialize()
	globalThis.global = globalThis

	// Detect if this is the Xbox WebView2 build or HTML5 build.
	global.isXbox = navigator.userAgent.includes("WebView2")
	if (!isXbox) // If HTML5.
	{
		global.HTML5_GetOptimalGameWindowDimensions = HTML5_GetOptimalGameWindowDimensions
		global.desktopResolution = HTML5_GetOptimalGameWindowDimensions()
		global.directories = (await import('../directories.js')).default
	}

	// use event handling to intercept errors originating inside the Sphere sandbox, rather than a
	// try-catch.  otherwise the debugger thinks the error is handled and doesn't do a breakpoint,
	// making diagnosing bugs in the engine harder than necessary.
	window.addEventListener('error', (e) => {
		reportException(e.error)
	})
	window.addEventListener('unhandledrejection', (e) => {
		reportException(e.reason)
	})
	if (!isXbox)
		window.addEventListener('resize', resizeEvent)
	const canvas = document.getElementById('screen')
	await Galileo.initialize(canvas)
	await Audialis.initialize()
	await Fontso.initialize()
	InputEngine.initialize(canvas)
	Pegasus.initialize()
	await Pegasus.launchGame('dist')
	print("Event:GameLoaded")
}

function resizeEvent()
{
	let gameWindowResolution = HTML5_GetOptimalGameWindowDimensions()
	Galileo.rerez(gameWindowResolution.width, gameWindowResolution.height)
}

function reportException(thrownValue)
{
	print((
			thrownValue instanceof Error
			&& thrownValue.stack !== undefined
		) ?
			thrownValue.stack :
			String(thrownValue))
}

function HTML5_GetOptimalGameWindowDimensions()
{
	return window.innerWidth * 0.5625 <= window.innerHeight ?
	{
		width: window.innerWidth,
		height: window.innerWidth * 0.5625
	} :
	{
		height: window.innerHeight,
		width: window.innerHeight * 1.7778
	}
}
