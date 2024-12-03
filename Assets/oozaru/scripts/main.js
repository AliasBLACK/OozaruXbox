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
	window.chrome.webview.postMessage(string)
}

main()

async function main()
{
	await Version.initialize()
	//window.chrome.webview.postMessage(result)
	//WebView_CoreWebView2WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e){string message = e.TryGetWebMessageAsString();if (message.StartsWith("my result start")){MessageBox.Show("my result");}}

	// use event handling to intercept errors originating inside the Sphere sandbox, rather than a
	// try-catch.  otherwise the debugger thinks the error is handled and doesn't do a breakpoint,
	// making diagnosing bugs in the engine harder than necessary.
	window.addEventListener('error', (e) => {
		reportException(e.error)
	})
	window.addEventListener('unhandledrejection', (e) => {
		reportException(e.reason)
	})
	const canvas = document.getElementById('screen')
	await Galileo.initialize(canvas)
	await Audialis.initialize()
	await Fontso.initialize()
	InputEngine.initialize(canvas)
	Pegasus.initialize()
	await Pegasus.launchGame('dist')
}

function reportException(thrownValue)
{
	let msg
	if (thrownValue instanceof Error && thrownValue.stack !== undefined)
		msg = thrownValue.stack.replace(/\r?\n/g, '<br>')
	else
		msg = String(thrownValue)
	const readout = document.getElementById('readout')
	readout.classList.add('visible')
	readout.innerHTML = `an error occurred.\r\n\r\n${msg}`
}
