/**
 *  Oozaru JavaScript game engine
 *  Copyright (c) 2015-2018, Fat Cerberus
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
 *  * Neither the name of miniSphere nor the names of its contributors may be
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

import EventLoop from './oozaru/event-loop.js';
import Galileo, { Shader, Texture, Transform, VBO } from './oozaru/galileo.js';
import Pact from './oozaru/pact.js';

const
	Canvas = document.getElementById('screen'),
	GL = Canvas.getContext('webgl');

let eventLoop = new EventLoop(GL);
eventLoop.start();

(async () => {
	let vertSource = await (await fetch('shaders/default.vert.glsl')).text();
	let fragSource = await (await fetch('shaders/default.frag.glsl')).text();
	let image = await loadImageFile('game/images/saiyan.png');

	Galileo.initialize(GL);
	let texture = new Texture(image);
	let shader = new Shader(vertSource, fragSource);
	let vbo = new VBO([
		{ x: -1, y: -1, u: 0.0, v: 1.0 },
		{ x: +1, y: -1, u: 1.0, v: 1.0 },
		{ x: -1, y: +1, u: 0.0, v: 0.0 },
		{ x: +1, y: +1, u: 1.0, v: 0.0 },
	]);
	let transform = new Transform();
	eventLoop.addJob('render', () => {
		shader.draw(vbo, texture, transform);
	}, true);
})();

async function loadImageFile(fileName)
{
	let image = new Image();
	let pact = new Pact();
	image.onload = () => {
		pact.resolve(image);
	};
	image.src = fileName;
	return await pact;
}
