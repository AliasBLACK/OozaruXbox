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

import { opentype } from './opentype.js'
import Fido from './fido.js';
import { Color, Shape, ShapeType, Texture, Transform, VertexList } from './galileo.js';
import Game from './game.js';
import earcut from './earcut.js';

var defaultFont;

export default
class Fontso
{
    static async initialize()
    {
		defaultFont = await Font.fromFile('#/default.ttf', 12);
    }
}

// Cache loaded fonts to re-use them.
const LOADED_FONTS = {}
async function parseFont(url)
{
	if (!(url in LOADED_FONTS))
		LOADED_FONTS[url] = opentype.parse(await Fido.fetchData(Game.urlOf(url)))
	return LOADED_FONTS[url]
}

/**
 * Font bezier curves to vertices by pat_lvl17.
 * https://forum.babylonjs.com/t/fast-dynamic-3d-text-in-any-truetype-font/15770
 */

const MAX_BEZIER_STEPS = 10
const BEZIER_STEP_SIZE = 20.0
const FONT_TRANSFORM = new Transform()

export
class Font
{
	#font
	#glyphs = {}
	#lineHeight = 0
	#scale = 0
	#texture = new Texture(1, 1)
	#webglYOffset = 0

	static get Default()
	{
		return defaultFont;
	}

	static async fromFile(...args)
	{
		// Load font.
		let font = new Font()
		font.#font = await parseFont(args[0])

		// Font rendering scale.
		let webglScale = args[2]?.webglScale || 1
		font.#scale = (args[1] / font.#font.unitsPerEm) * webglScale

		// Font lineHeight scale.
		let webglHeightScale = args[2]?.webglHeightScale || 1
		font.#lineHeight = (font.#font.ascender - font.#font.descender) * font.#scale * webglHeightScale

		// Y-Offset
		font.#webglYOffset = args[2]?.webglYOffset || 0

		// Return font object.
		return font
	}

	createGlyph(cp)
	{
		const glyph = this.#font.charToGlyph(String.fromCodePoint(cp))

		if (glyph && glyph.advanceWidth)
		{
			this.#glyphs[cp] =
			{
				index: glyph.index,
				advanceWidth: glyph.advanceWidth
			}

			if (glyph.path && glyph.path.commands && glyph.path.commands.length)
			{
				const polys = []
				glyph.path.commands.forEach(({type, x, y, x1, y1, x2, y2}) => {
					switch (type) {
						case 'M':
						polys.push(new TextMeshPolygon())
						polys[polys.length - 1].moveTo({x, y})
						break
						case 'L':
						polys[polys.length - 1].moveTo({x, y})
						break
						case 'C':
						polys[polys.length - 1].cubicTo({x, y}, {x: x1, y: y1}, {x: x2, y: y2})
						break
						case 'Q':
						polys[polys.length - 1].conicTo({x, y}, {x: x1, y: y1})
						break
						case 'Z':
						polys[polys.length - 1].close()
						break
					}
				})

				// sort contours by descending area
				polys.sort((a, b) => Math.abs(b.area) - Math.abs(a.area))

				// classify contours to find holes and their 'parents'
				const root = []

				for (let i = 0; i < polys.length; ++i) {
					let parent = null
					for (let j = i - 1; j >= 0; --j) {
						// a contour is a hole if it is inside its parent and has different winding
						if (polys[j].inside(polys[i].points[0]) && polys[i].area * polys[j].area < 0 && !polys[j].hasParent) {
						parent = polys[j]
						break
						}
					}
					if (parent) {
						polys[i].hasParent = true
						parent.children.push(polys[i])
					} else {
						root.push(polys[i])
					}
				}

				const totalPoints = polys.reduce((sum, p) => sum + p.points.length, 0)
				var vertices = []

				// Process polys.
				function process(poly, scale, ascender) {
					const coords = []
					const holes = []
					poly.points.forEach(({x, y}) => coords.push(x, y))
					poly.children.forEach(child => {

						// Process holes as separate polys.
						child.children.forEach(process, scale, ascender)
						holes.push(coords.length / 2)
						child.points.forEach(({x, y}) => coords.push(x, y))
					})

					// add vertex data
					earcut(coords, holes).forEach(i => vertices.push({
						x: coords[i * 2] * scale,
						y: (ascender - coords[i * 2 + 1]) * scale
					}))
				}

				root.forEach(i => process(i, this.#scale, this.#font.ascender + this.#webglYOffset))
				
				this.#glyphs[cp].mesh = new Shape(
					ShapeType.Triangles,
					this.#texture,
					new VertexList(vertices)
				)
			}
		}

		return this.#glyphs[cp]
	}

	get height()
	{
		return this.#lineHeight;
	}

	drawText(surface, x, y, text, color = Color.White, wrapWidth)
	{
		this.#texture.clear(color)		
		text = text.toString();
		const lines = wrapWidth !== undefined
			? this.wordWrap(text, wrapWidth)
			: [ text ];
		for (let i = 0, len = lines.length; i < len; ++i)
			this.#renderString(surface, x, y + i * this.#lineHeight, lines[i]);
	}

	getTextSize(text, wrapWidth)
	{
		text = text.toString();
		if (wrapWidth !== undefined) {
			const lines = this.wordWrap(text, wrapWidth);
			return {
				width: wrapWidth,
				height: lines.length * this.#lineHeight,
			};
		}
		else {
			return {
				width: this.widthOf(text),
				height: this.#lineHeight,
			};
		}
	}

	heightOf(text, wrapWidth)
	{
		return this.getTextSize(text, wrapWidth).height;
	}

	widthOf(text)
	{
		text = text.toString();
		let width = 0;
		for (let ptr = 0; ptr < text.length; ptr++)
		{
			const cp = text.charCodeAt(ptr)
			switch (cp)
			{
				case 13: case 10:  // newline
					continue;
				case 8:  // tab
					width += Math.trunc(this.getGlyph(32).advanceWidth * 3 * this.#scale);
					continue;
				default:
					let glyph = this.getGlyph(cp)
					width += Math.trunc(glyph.advanceWidth * this.#scale);
					continue;
			}
		}
		return width;
	}

	getGlyph(cp)
	{
		return this.#glyphs[cp] || this.createGlyph(cp)
	}

	wordWrap(text, wrapWidth)
	{
		text = text.toString();
		const lines = [];
		const codepoints = [];
		let currentLine = "";
		let lineWidth = 0;
		let lineFinished = false;
		let wordWidth = 0;
		let wordFinished = false;
		for (let ptr = 0; ptr < text.length; ptr++)
		{
			const cp = text.charCodeAt(ptr)
			const glyph = this.getGlyph(cp);
			switch (cp) {
				case 13: case 10:  // newline
					if (cp === 13 && text.codePointAt(ptr) == 10)
						++ptr;  // treat CRLF as a single newline
					lineFinished = true;
					break;
				case 8:  // tab
					codepoints.push(cp);
					wordWidth += Math.trunc(this.getGlyph(32).advanceWidth * 3 * this.#scale);
					wordFinished = true;
					break;
				case 32:  // space
					wordFinished = true;
				default:
					codepoints.push(cp);
					wordWidth += Math.trunc(glyph.advanceWidth * this.#scale);
					break;
			}
			if (wordFinished || lineFinished) {
				currentLine += String.fromCodePoint(...codepoints);
				lineWidth += wordWidth;
				codepoints.length = 0;
				wordWidth = 0;
				wordFinished = false;
			}
			if (lineWidth + wordWidth > wrapWidth || lineFinished) {
				lines.push(currentLine);
				currentLine = "";
				lineWidth = 0;
				lineFinished = false;
			}
		}
		currentLine += String.fromCodePoint(...codepoints);
		if (currentLine !== "")
			lines.push(currentLine);
		return lines;
	}

	#renderString(surface, x, y, text)
	{
		x = Math.trunc(x);
        y = Math.trunc(y);
        if (text === "")
			return;  // empty string, nothing to render
		let xOffset = 0;
		for (let ptr = 0; ptr < text.length; ptr++)
		{
			const cp = text.charCodeAt(ptr)
			if (cp == 13) continue
			const glyph = this.getGlyph(cp);
			if (glyph.mesh)
			{
				FONT_TRANSFORM.identity().translate(x + xOffset, y)
				glyph.mesh.draw(surface, FONT_TRANSFORM)
			}

			// Calculate advance.
			xOffset += Math.trunc(glyph.advanceWidth * this.#scale)
		}
	}
}

// class for converting path commands into point data
class TextMeshPolygon
{
	points = []
	children = []
	hasParent = false
	area = 0.0

	distance(p1, p2)
	{
		const dx = p1.x - p2.x, dy = p1.y - p2.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	lerp(p1, p2, t)
	{
		return {x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y}
	}

	cross(p1, p2)
	{
		return p1.x * p2.y - p1.y * p2.x
	}

	moveTo(p)
	{
		this.points.push(p)
	}

	lineTo(p)
	{
		this.points.push(p)
	}

	close()
	{
		let cur = this.points[this.points.length - 1]

		this.points.forEach(next =>
		{
			this.area += 0.5 * this.cross(cur, next)
			cur = next
		})
	}

	conicTo(p, p1)
	{
		const p0 = this.points[this.points.length - 1]
		const dist = this.distance(p0, p1) + this.distance(p1, p)
		const steps = Math.max(2, Math.min(MAX_BEZIER_STEPS, dist / BEZIER_STEP_SIZE))

		for (let i = 1; i <= steps; ++i)
		{
			const t = i / steps
			this.points.push(this.lerp(this.lerp(p0, p1, t), this.lerp(p1, p, t), t))
		}
	}

	cubicTo(p, p1, p2)
	{
		const p0 = this.points[this.points.length - 1]
		const dist = this.distance(p0, p1) + this.distance(p1, p2) + this.distance(p2, p)
		const steps = Math.max(2, Math.min(MAX_BEZIER_STEPS, dist / BEZIER_STEP_SIZE))

		for (let i = 1; i <= steps; ++i)
		{
			const t = i / steps
			const a = this.lerp(this.lerp(p0, p1, t), this.lerp(p1, p2, t), t)
			const b = this.lerp(this.lerp(p1, p2, t), this.lerp(p2, p, t), t)
			this.points.push(this.lerp(a, b, t))
		}
	}

	inside(p)
	{
		const epsilon = 1e-6
		let count = 0, cur = this.points[this.points.length - 1]

		this.points.forEach(next =>
		{
			const p0 = (cur.y < next.y ? cur : next)
			const p1 = (cur.y < next.y ? next : cur)

			if (p0.y < p.y + epsilon && p1.y > p.y + epsilon)
			{
				if ((p1.x - p0.x) * (p.y - p0.y) > (p.x - p0.x) * (p1.y - p0.y))
				{
					count++
				}
			}

			cur = next
		})
		return (count % 2) !== 0
	}
}