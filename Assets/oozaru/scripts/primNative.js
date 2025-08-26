import Prim from '../runtime/prim.js'
import { ShapeType } from './galileo.js'

export default
class PrimNative
{
	// Some vector math functions.
	static length = function(x, y) { return Math.sqrt(x * x + y * y)}
	static normalize = function(x, y)
	{
		let length = PrimNative.length(x, y)
		return { x: x / length, y: y / length }
	}

	// Wrapping Prim.
	static drawLine(surface, x1, y1, x2, y2, thickness, color) { Prim.drawLine(surface, x1, y1, x2, y2, thickness, color) }
	static drawRectangle(surface, x1, y1, x2, y2, thickness, color) { Prim.drawRectangle(surface, x1, y1, x2 - x1, y2 - y1, thickness, color) }
	static drawFilledRectangle(surface, x1, y1, x2, y2, color) { Prim.drawSolidRectangle(surface, x1, y1, x2 - x1, y2 - y1, color) }
	static drawFilledTriangle(surface, x1, y1, x2, y2, x3, y3, color) { Prim.drawSolidTriangle(surface, x1, y1, x2, y2, x3, y3, color) }
	static drawFilledEllipse(surface, x, y, rx, ry, color) { Prim.drawSolidEllipse(surface, x, y, rx, ry, color) }
	static drawFilledCircle(surface, x, y, radius, color) { Prim.drawSolidCircle(surface, x, y, radius, color) }
	static drawArc(surface, x, y, radius, angle1, angle2, thickness, color) { PrimNative.drawArcInternal(surface, x, y, radius, radius, angle1, angle2, thickness, color) }
	static drawCircle(surface, x, y, radius, thickness, color) { PrimNative.drawArcInternal(surface, x, y, radius, radius, 0, Math.PI * 2, thickness, color) }

	// Draw Line Triangle.
	static drawTriangle(surface, x1, y1, x2, y2, x3, y3, thickness, color)
	{
		let findInnerCoord = function(x, y, leftX, leftY, rightX, rightY)
		{
			let leftOffset = PrimNative.normalize(leftX - x, leftY - y)
			leftOffset = { x: leftOffset.x * thickness, y: leftOffset.y * thickness }
			let rightOffset = PrimNative.normalize(rightX - x, rightY - y)
			rightOffset = { x: rightOffset.x * thickness, y: rightOffset.y * thickness }
			return { x: x + leftOffset.x + rightOffset.x, y: y + leftOffset.y + rightOffset.y }
		}
		let inner1 = { ...findInnerCoord(x1, y1, x3, y3, x2, y2), color: color }
		let inner2 = { ...findInnerCoord(x2, y2, x1, y1, x3, y3), color: color }
		let inner3 = { ...findInnerCoord(x3, y3, x2, y2, x1, y1), color: color }
		Shape.drawImmediate(surface, ShapeType.TriStrip, [
			{ x: x1, y: y1, color: color }, inner1,
			{ x: x2, y: y2, color: color }, inner2,
			{ x: x3, y: y3, color: color }, inner3,
			{ x: x1, y: y1, color: color }, inner1
		])
	}

	// Draw Line Rounded Rectangle.
	static drawRoundedRectangle(surface, x1, y1, x2, y2, rx, ry, thickness, color)
	{
		let vertices = [
			...this.getArcCoords(x2 - rx, y1 + ry, rx, ry, 0, Math.PI / 2, thickness, color),
			...this.getArcCoords(x1 + rx, y1 + ry, rx, ry, Math.PI * .5, Math.PI, thickness, color),
			...this.getArcCoords(x1 + rx, y2 - ry, rx, ry, Math.PI, Math.PI * 1.5, thickness, color),
			...this.getArcCoords(x2 - rx, y2 - ry, rx, ry, -Math.PI / 2, 0, thickness, color),
			...this.getArcCoords(x2 - rx, y1 + ry, rx, ry, 0, Math.PI / 2, thickness, color).slice(0, 2)
		]
		Shape.drawImmediate(surface, ShapeType.TriStrip, vertices)
	}

	// Draw Filled Rounded Rectangle.
	static drawFilledRoundedRectangle(surface, x1, y1, x2, y2, rx, ry, color)
	{
		let vertices = [
			{ x: (x1 + x2) / 2, y: (y1 + y2) / 2, color: color },
			...this.getArcCoords(x2 - rx, y1 + ry, rx, ry, 0, Math.PI / 2, 0, color),
			...this.getArcCoords(x1 + rx, y1 + ry, rx, ry, Math.PI * .5, Math.PI, 0, color),
			...this.getArcCoords(x1 + rx, y2 - ry, rx, ry, Math.PI, Math.PI * 1.5, 0, color),
			...this.getArcCoords(x2 - rx, y2 - ry, rx, ry, -Math.PI / 2, 0, 0, color),
			this.getArcCoords(x2 - rx, y1 + ry, rx, ry, 0, Math.PI / 2, 0, color)[0]
		]
		Shape.drawImmediate(surface, ShapeType.Fan, vertices)
	}

	// Internal draw arc with different X and Y radii.
	static drawArcInternal(surface, x, y, rx, ry, angle1, angle2, thickness, color)
	{
		let vertices = this.getArcCoords(x, y, rx, ry, angle1, angle2, thickness, color)
		Shape.drawImmediate(surface, ShapeType.TriStrip, vertices)
	}

	static getArcCoords(x, y, rx, ry, angle1, angle2, thickness, color)
	{
		let numSegments = Math.ceil(10 * Math.sqrt((rx + ry) / 2.0))
		let increment = Math.PI * 2 / numSegments
		let vertices = []

		for (let i = angle1; i < angle2; i += increment)
		{
			vertices.push({ x: x + Math.cos(i) * rx, y: y - Math.sin(i) * ry, color: color })
			if (thickness > 0) vertices.push({ x: x + Math.cos(i) * (rx - thickness), y: y - Math.sin(i) * (ry - thickness), color: color })
		}
		vertices.push({ x: x + Math.cos(angle2) * rx, y: y - Math.sin(angle2) * ry, color: color })
		if (thickness > 0) vertices.push({ x: x + Math.cos(angle2) * (rx - thickness), y: y - Math.sin(angle2) * (ry - thickness), color: color })
		
		return vertices
	}

	// Ignore for now.
	// static drawEllipse(surface, x, y, rx, ry, thickness, color)
}