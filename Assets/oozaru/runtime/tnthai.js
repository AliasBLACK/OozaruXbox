/**
 * TNThaiAnalyzer (https://www.npmjs.com/package/tnthai)
 * The MIT License (MIT)
 * 
 * Copyright © 2025 prapeepat
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { bb } from './tnthai_bb.js';
import { cb } from './tnthai_cb.js';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var doublearray$1 = {exports: {}};

var hasRequiredDoublearray;

function requireDoublearray () {
	if (hasRequiredDoublearray) return doublearray$1.exports;
	hasRequiredDoublearray = 1;
	(function (module) {
		// Copyright (c) 2014 Takuya Asano All Rights Reserved.

		(function () {

		    var TERM_CHAR = "\u0000", // terminal character
		        TERM_CODE = 0,        // terminal character code
		        ROOT_ID = 0,          // index of root node
		        NOT_FOUND = -1,       // traverse() returns if no nodes found
		        BASE_SIGNED = true,
		        CHECK_SIGNED = true,
		        BASE_BYTES = 4,
		        CHECK_BYTES = 4,
		        MEMORY_EXPAND_RATIO = 2;


		    var newBC = function (initial_size) {

		        if (initial_size == null) {
		            initial_size = 1024;
		        }

		        var initBase = function (_base, start, end) {  // 'end' index does not include
		            for (var i = start; i < end; i++) {
		                _base[i] = - i + 1;  // inversed previous empty node index
		            }
		            if (0 < check.array[check.array.length - 1]) {
		                var last_used_id = check.array.length - 2;
		                while (0 < check.array[last_used_id]) {
		                    last_used_id--;
		                }
		                _base[start] = - last_used_id;
		            }
		        };

		        var initCheck = function (_check, start, end) {
		            for (var i = start; i < end; i++) {
		                _check[i] = - i - 1;  // inversed next empty node index
		            }
		        };

		        var realloc = function (min_size) {
		            // expand arrays size by given ratio
		            var new_size = min_size * MEMORY_EXPAND_RATIO;
		            // console.log('re-allocate memory to ' + new_size);

		            var base_new_array = newArrayBuffer(base.signed, base.bytes, new_size);
		            initBase(base_new_array, base.array.length, new_size);  // init BASE in new range
		            base_new_array.set(base.array);
		            base.array = null;  // explicit GC
		            base.array = base_new_array;

		            var check_new_array = newArrayBuffer(check.signed, check.bytes, new_size);
		            initCheck(check_new_array, check.array.length, new_size);  // init CHECK in new range
		            check_new_array.set(check.array);
		            check.array = null;  // explicit GC
		            check.array = check_new_array;
		        };

		        var first_unused_node = ROOT_ID + 1;

		        var base = {
		            signed: BASE_SIGNED,
		            bytes: BASE_BYTES,
		            array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size)
		        };

		        var check = {
		            signed: CHECK_SIGNED,
		            bytes: CHECK_BYTES,
		            array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size)
		        };

		        // init root node
		        base.array[ROOT_ID] = 1;
		        check.array[ROOT_ID] = ROOT_ID;

		        // init BASE
		        initBase(base.array, ROOT_ID + 1, base.array.length);

		        // init CHECK
		        initCheck(check.array, ROOT_ID + 1, check.array.length);

		        return {
		            getBaseBuffer: function () {
		                return base.array;
		            },
		            getCheckBuffer: function () {
		                return check.array;
		            },
		            loadBaseBuffer: function (base_buffer) {
		                base.array = base_buffer;
		                return this;
		            },
		            loadCheckBuffer: function (check_buffer) {
		                check.array = check_buffer;
		                return this;
		            },
		            size: function () {
		                return Math.max(base.array.length, check.array.length);
		            },
		            getBase: function (index) {
		                if (base.array.length - 1 < index) {
		                    return - index + 1;
		                    // realloc(index);
		                }
		                // if (!Number.isFinite(base.array[index])) {
		                //     console.log('getBase:' + index);
		                //     throw 'getBase' + index;
		                // }
		                return base.array[index];
		            },
		            getCheck: function (index) {
		                if (check.array.length - 1 < index) {
		                    return - index - 1;
		                    // realloc(index);
		                }
		                // if (!Number.isFinite(check.array[index])) {
		                //     console.log('getCheck:' + index);
		                //     throw 'getCheck' + index;
		                // }
		                return check.array[index];
		            },
		            setBase: function (index, base_value) {
		                if (base.array.length - 1 < index) {
		                    realloc(index);
		                }
		                base.array[index] = base_value;
		            },
		            setCheck: function (index, check_value) {
		                if (check.array.length - 1 < index) {
		                    realloc(index);
		                }
		                check.array[index] = check_value;
		            },
		            setFirstUnusedNode: function (index) {
		                // if (!Number.isFinite(index)) {
		                //     throw 'assertion error: setFirstUnusedNode ' + index + ' is not finite number';
		                // }
		                first_unused_node = index;
		            },
		            getFirstUnusedNode: function () {
		                // if (!Number.isFinite(first_unused_node)) {
		                //     throw 'assertion error: getFirstUnusedNode ' + first_unused_node + ' is not finite number';
		                // }
		                return first_unused_node;
		            },
		            shrink: function () {
		                var last_index = this.size() - 1;
		                while (true) {
		                    if (0 <= check.array[last_index]) {
		                        break;
		                    }
		                    last_index--;
		                }
		                base.array = base.array.subarray(0, last_index + 2);   // keep last unused node
		                check.array = check.array.subarray(0, last_index + 2); // keep last unused node
		            },
		            calc: function () {
		                var unused_count = 0;
		                var size = check.array.length;
		                for (var i = 0; i < size; i++) {
		                    if (check.array[i] < 0) {
		                        unused_count++;
		                    }
		                }
		                return {
		                    all: size,
		                    unused: unused_count,
		                    efficiency: (size - unused_count) / size
		                };
		            },
		            dump: function () {
		                // for debug
		                var dump_base = "";
		                var dump_check = "";

		                var i;
		                for (i = 0; i < base.array.length; i++) {
		                    dump_base = dump_base + " " + this.getBase(i);
		                }
		                for (i = 0; i < check.array.length; i++) {
		                    dump_check = dump_check + " " + this.getCheck(i);
		                }

		                console.log("base:" + dump_base);
		                console.log("chck:" + dump_check);

		                return "base:" + dump_base + " chck:" + dump_check;
		            }
		        };
		    };


		    /**
		     * Factory method of double array
		     */
		    function DoubleArrayBuilder(initial_size) {
		        this.bc = newBC(initial_size);  // BASE and CHECK
		        this.keys = [];
		    }


		    /**
		     * Append a key to initialize set
		     * (This method should be called by dictionary ordered key)
		     *
		     * @param {String} key
		     * @param {Number} value Integer value from 0 to max signed integer number - 1
		     */
		    DoubleArrayBuilder.prototype.append = function (key, record) {
		        this.keys.push({ k: key, v: record });
		        return this;
		    };

		    /**
		     * Build double array for given keys
		     *
		     * @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
		     * 'k' is a key string, 'v' is a record assigned to that key.
		     * @return {DoubleArray} Compiled double array
		     */
		    DoubleArrayBuilder.prototype.build = function (keys, sorted) {

		        if (keys == null) {
		            keys = this.keys;
		        }

		        if (keys == null) {
		            return new DoubleArray(this.bc);
		        }

		        if (sorted == null) {
		            sorted = false;
		        }

		        // Convert key string to ArrayBuffer
		        var buff_keys =
		            keys.map(function (k) {
		                return {
		                    k: stringToUtf8Bytes(k.k + TERM_CHAR),
		                    v: k.v
		                };
		            });

		        // Sort keys by byte order
		        if (sorted) {
		            this.keys = buff_keys;
		        } else {
		            this.keys =
		                buff_keys.sort(function (k1, k2) {
		                    var b1 = k1.k;
		                    var b2 = k2.k;
		                    var min_length = Math.min(b1.length, b2.length);
		                    for (var pos = 0; pos < min_length; pos++) {
		                        if (b1[pos] === b2[pos]) {
		                            continue;
		                        }
		                        return b1[pos] - b2[pos];
		                    }
		                    return b1.length - b2.length;
		                });
		        }

		        buff_keys = null;  // explicit GC

		        this._build(ROOT_ID, 0, 0, this.keys.length);
		        return new DoubleArray(this.bc);
		    };

		    /**
		     * Append nodes to BASE and CHECK array recursively
		     */
		    DoubleArrayBuilder.prototype._build = function (parent_index, position, start, length) {

		        var children_info = this.getChildrenInfo(position, start, length);
		        var _base = this.findAllocatableBase(children_info);

		        this.setBC(parent_index, children_info, _base);

		        for (var i = 0; i < children_info.length; i = i + 3) {
		            var child_code = children_info[i];
		            if (child_code === TERM_CODE) {
		                continue;
		            }
		            var child_start = children_info[i + 1];
		            var child_len = children_info[i + 2];
		            var child_index = _base + child_code;
		            this._build(child_index, position + 1, child_start, child_len);
		        }
		    };

		    DoubleArrayBuilder.prototype.getChildrenInfo = function (position, start, length) {
		        var current_char = this.keys[start].k[position];
		        var i = 0;
		        var children_info = new Int32Array(length * 3);

		        children_info[i++] = current_char;  // char (current)
		        children_info[i++] = start;         // start index (current)

		        var next_pos = start;
		        var start_pos = start;
		        for (; next_pos < start + length; next_pos++) {
		            var next_char = this.keys[next_pos].k[position];
		            if (current_char !== next_char) {
		                children_info[i++] = next_pos - start_pos;  // length (current)

		                children_info[i++] = next_char;             // char (next)
		                children_info[i++] = next_pos;              // start index (next)
		                current_char = next_char;
		                start_pos = next_pos;
		            }
		        }
		        children_info[i++] = next_pos - start_pos;
		        children_info = children_info.subarray(0, i);

		        return children_info;
		    };

		    DoubleArrayBuilder.prototype.setBC = function (parent_id, children_info, _base) {

		        var bc = this.bc;

		        bc.setBase(parent_id, _base);  // Update BASE of parent node

		        var i;
		        for (i = 0; i < children_info.length; i = i + 3) {
		            var code = children_info[i];
		            var child_id = _base + code;

		            // Update linked list of unused nodes

		            // Assertion
		            // if (child_id < 0) {
		            //     throw 'assertion error: child_id is negative'
		            // }

		            var prev_unused_id = - bc.getBase(child_id);
		            var next_unused_id = - bc.getCheck(child_id);
		            // if (prev_unused_id < 0) {
		            //     throw 'assertion error: setBC'
		            // }
		            // if (next_unused_id < 0) {
		            //     throw 'assertion error: setBC'
		            // }
		            if (child_id !== bc.getFirstUnusedNode()) {
		                bc.setCheck(prev_unused_id, - next_unused_id);
		            } else {
		                // Update first_unused_node
		                bc.setFirstUnusedNode(next_unused_id);
		            }
		            bc.setBase(next_unused_id, - prev_unused_id);

		            var check = parent_id;         // CHECK is parent node index
		            bc.setCheck(child_id, check);  // Update CHECK of child node

		            // Update record
		            if (code === TERM_CODE) {
		                var start_pos = children_info[i + 1];
		                // var len = children_info[i + 2];
		                // if (len != 1) {
		                //     throw 'assertion error: there are multiple terminal nodes. len:' + len;
		                // }
		                var value = this.keys[start_pos].v;

		                if (value == null) {
		                    value = 0;
		                }

		                var base = - value - 1;       // BASE is inverted record value
		                bc.setBase(child_id, base);  // Update BASE of child(leaf) node
		            }
		        }
		    };


		    /**
		     * Find BASE value that all children are allocatable in double array's region
		     */
		    DoubleArrayBuilder.prototype.findAllocatableBase = function (children_info) {

		        var bc = this.bc;

		        // Assertion: keys are sorted by byte order
		        // var c = -1;
		        // for (var i = 0; i < children_info.length; i = i + 3) {
		        //     if (children_info[i] < c) {
		        //         throw 'assertion error: not sort key'
		        //     }
		        //     c = children_info[i];
		        // }

		        // iterate linked list of unused nodes
		        var _base;
		        var curr = bc.getFirstUnusedNode();  // current index
		        // if (curr < 0) {
		        //     throw 'assertion error: getFirstUnusedNode returns negative value'
		        // }

		        while (true) {
		            _base = curr - children_info[0];

		            if (_base < 0) {
		                curr = - bc.getCheck(curr);  // next

		                // if (curr < 0) {
		                //     throw 'assertion error: getCheck returns negative value'
		                // }

		                continue;
		            }

		            var empty_area_found = true;
		            for (var i = 0; i < children_info.length; i = i + 3) {
		                var code = children_info[i];
		                var candidate_id = _base + code;

		                if (!this.isUnusedNode(candidate_id)) {
		                    // candidate_id is used node
		                    // next
		                    curr = - bc.getCheck(curr);
		                    // if (curr < 0) {
		                    //     throw 'assertion error: getCheck returns negative value'
		                    // }

		                    empty_area_found = false;
		                    break;
		                }
		            }
		            if (empty_area_found) {
		                // Area is free
		                return _base;
		            }
		        }
		    };

		    /**
		     * Check this double array index is unused or not
		     */
		    DoubleArrayBuilder.prototype.isUnusedNode = function (index) {
		        var bc = this.bc;
		        var check = bc.getCheck(index);

		        // if (index < 0) {
		        //     throw 'assertion error: isUnusedNode index:' + index;
		        // }

		        if (index === ROOT_ID) {
		            // root node
		            return false;
		        }
		        if (check < 0) {
		            // unused
		            return true;
		        }

		        // used node (incl. leaf)
		        return false;
		    };


		    /**
		     * Factory method of double array
		     */
		    function DoubleArray(bc) {
		        this.bc = bc;       // BASE and CHECK
		        this.bc.shrink();
		    }


		    /**
		     * Look up a given key in this trie
		     *
		     * @param {String} key
		     * @return {Boolean} True if this trie contains a given key
		     */
		    DoubleArray.prototype.contain = function (key) {

		        var bc = this.bc;

		        key += TERM_CHAR;
		        var buffer = stringToUtf8Bytes(key);

		        var parent = ROOT_ID;
		        var child = NOT_FOUND;

		        for (var i = 0; i < buffer.length; i++) {
		            var code = buffer[i];

		            child = this.traverse(parent, code);
		            if (child === NOT_FOUND) {
		                return false;
		            }

		            if (bc.getBase(child) <= 0) {
		                // leaf node
		                return true;
		            } else {
		                // not leaf
		                parent = child;
		                continue;
		            }
		        }
		        return false;
		    };


		    /**
		     * Look up a given key in this trie
		     *
		     * @param {String} key
		     * @return {Number} Record value assgned to this key, -1 if this key does not contain
		     */
		    DoubleArray.prototype.lookup = function (key) {

		        key += TERM_CHAR;
		        var buffer = stringToUtf8Bytes(key);

		        var parent = ROOT_ID;
		        var child = NOT_FOUND;

		        for (var i = 0; i < buffer.length; i++) {
		            var code = buffer[i];
		            child = this.traverse(parent, code);
		            if (child === NOT_FOUND) {
		                return NOT_FOUND;
		            }
		            parent = child;
		        }

		        var base = this.bc.getBase(child);
		        if (base <= 0) {
		            // leaf node
		            return - base - 1;
		        } else {
		            // not leaf
		            return NOT_FOUND;
		        }
		    };


		    /**
		     * Common prefix search
		     *
		     * @param {String} key
		     * @return {Array} Each result object has 'k' and 'v' (key and record,
		     * respectively) properties assigned to matched string
		     */
		    DoubleArray.prototype.commonPrefixSearch = function (key) {

		        var buffer = stringToUtf8Bytes(key);

		        var parent = ROOT_ID;
		        var child = NOT_FOUND;

		        var result = [];

		        for (var i = 0; i < buffer.length; i++) {
		            var code = buffer[i];

		            child = this.traverse(parent, code);

		            if (child !== NOT_FOUND) {
		                parent = child;

		                // look forward by terminal character code to check this node is a leaf or not
		                var grand_child = this.traverse(child, TERM_CODE);

		                if (grand_child !== NOT_FOUND) {
		                    var base = this.bc.getBase(grand_child);

		                    var r = {};

		                    if (base <= 0) {
		                        // If child is a leaf node, add record to result
		                        r.v = - base - 1;
		                    }

		                    // If child is a leaf node, add word to result
		                    r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1));

		                    result.push(r);
		                }
		                continue;
		            } else {
		                break;
		            }
		        }

		        return result;
		    };

		    DoubleArray.prototype.traverse = function (parent, code) {
		        var child = this.bc.getBase(parent) + code;
		        if (this.bc.getCheck(child) === parent) {
		            return child;
		        } else {
		            return NOT_FOUND;
		        }
		    };

		    DoubleArray.prototype.size = function () {
		        return this.bc.size();
		    };

		    DoubleArray.prototype.calc = function () {
		        return this.bc.calc();
		    };

		    DoubleArray.prototype.dump = function () {
		        return this.bc.dump();
		    };


		    // Array utility functions

		    var newArrayBuffer = function (signed, bytes, size) {
		        {
		            switch(bytes) {
		                case 1:
		                return new Int8Array(size);
		                case 2:
		                return new Int16Array(size);
		                case 4:
		                return new Int32Array(size);
		                default:
		                throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
		            }
		        }
		    };

		    var arrayCopy = function (src, src_offset, length) {
		        var buffer = new ArrayBuffer(length);
		        var dstU8 = new Uint8Array(buffer, 0, length);
		        var srcU8 = src.subarray(src_offset, length);
		        dstU8.set(srcU8);
		        return dstU8;
		    };


		    /**
		     * Convert String (UTF-16) to UTF-8 ArrayBuffer
		     *
		     * @param {String} str UTF-16 string to convert
		     * @return {Uint8Array} Byte sequence encoded by UTF-8
		     */
		    var stringToUtf8Bytes = function (str) {

		        // Max size of 1 character is 4 bytes
		        var bytes = new Uint8Array(new ArrayBuffer(str.length * 4));

		        var i = 0, j = 0;

		        while (i < str.length) {
		            var unicode_code;

		            var utf16_code = str.charCodeAt(i++);
		            if (utf16_code >= 0xD800 && utf16_code <= 0xDBFF) {
		                // surrogate pair
		                var upper = utf16_code;           // high surrogate
		                var lower = str.charCodeAt(i++);  // low surrogate

		                if (lower >= 0xDC00 && lower <= 0xDFFF) {
		                    unicode_code =
		                        (upper - 0xD800) * (1 << 10) + (1 << 16) +
		                        (lower - 0xDC00);
		                } else {
		                    // malformed surrogate pair
		                    return null;
		                }
		            } else {
		                // not surrogate code
		                unicode_code = utf16_code;
		            }

		            if (unicode_code < 0x80) {
		                // 1-byte
		                bytes[j++] = unicode_code;

		            } else if (unicode_code < (1 << 11)) {
		                // 2-byte
		                bytes[j++] = (unicode_code >>> 6) | 0xC0;
		                bytes[j++] = (unicode_code & 0x3F) | 0x80;

		            } else if (unicode_code < (1 << 16)) {
		                // 3-byte
		                bytes[j++] = (unicode_code >>> 12) | 0xE0;
		                bytes[j++] = ((unicode_code >> 6) & 0x3f) | 0x80;
		                bytes[j++] = (unicode_code & 0x3F) | 0x80;

		            } else if (unicode_code < (1 << 21)) {
		                // 4-byte
		                bytes[j++] = (unicode_code >>> 18) | 0xF0;
		                bytes[j++] = ((unicode_code >> 12) & 0x3F) | 0x80;
		                bytes[j++] = ((unicode_code >> 6) & 0x3F) | 0x80;
		                bytes[j++] = (unicode_code & 0x3F) | 0x80;

		            } else ;
		        }

		        return bytes.subarray(0, j);
		    };


		    /**
		     * Convert UTF-8 ArrayBuffer to String (UTF-16)
		     *
		     * @param {Uint8Array} bytes UTF-8 byte sequence to convert
		     * @return {String} String encoded by UTF-16
		     */
		    var utf8BytesToString = function (bytes) {

		        var str = "";
		        var code, b1, b2, b3, b4, upper, lower;
		        var i = 0;

		        while (i < bytes.length) {

		            b1 = bytes[i++];

		            if (b1 < 0x80) {
		                // 1 byte
		                code = b1;
		            } else if ((b1 >> 5) === 0x06) {
		                // 2 bytes
		                b2 = bytes[i++];
		                code = ((b1 & 0x1f) << 6) | (b2 & 0x3f);
		            } else if ((b1 >> 4) === 0x0e) {
		                // 3 bytes
		                b2 = bytes[i++];
		                b3 = bytes[i++];
		                code = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
		            } else {
		                // 4 bytes
		                b2 = bytes[i++];
		                b3 = bytes[i++];
		                b4 = bytes[i++];
		                code = ((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
		            }

		            if (code < 0x10000) {
			            str += String.fromCharCode(code);
		            } else {
			            // surrogate pair
			            code -= 0x10000;
			            upper = (0xD800 | (code >> 10));
			            lower = (0xDC00 | (code & 0x3FF));
			            str += String.fromCharCode(upper, lower);
		            }
		        }

		        return str;
		    };


		    // public methods
		    var doublearray = {
		        builder: function (initial_size) {
		            return new DoubleArrayBuilder(initial_size);
		        },
		        load: function (base_buffer, check_buffer) {
		            var bc = newBC(0);
		            bc.loadBaseBuffer(base_buffer);
		            bc.loadCheckBuffer(check_buffer);
		            return new DoubleArray(bc);
		        }
		    };

		    {
			    // In node
		        module.exports = doublearray;
		    }

		})(); 
	} (doublearray$1));
	return doublearray$1.exports;
}

var require$$3 = [
	"กล่าว",
	"กว่า",
	"กัน",
	"กับ",
	"การ",
	"ก็",
	"ก่อน",
	"ขณะ",
	"ขอ",
	"ของ",
	"ขึ้น",
	"คง",
	"ครั้ง",
	"ความ",
	"คือ",
	"จะ",
	"จัด",
	"จาก",
	"จึง",
	"ช่วง",
	"ซึ่ง",
	"ดัง",
	"ด้วย",
	"ด้าน",
	"ตั้ง",
	"ตั้งแต่",
	"ตาม",
	"ต่อ",
	"ต่าง",
	"ต่างๆ",
	"ต้อง",
	"ถึง",
	"ถูก",
	"ถ้า",
	"ทั้ง",
	"ทั้งนี้",
	"ทาง",
	"ที่",
	"ที่สุด",
	"ทุก",
	"ทํา",
	"ทําให้",
	"นอกจาก",
	"นัก",
	"นั้น",
	"นี้",
	"น่า",
	"นํา",
	"บาง",
	"ผล",
	"ผ่าน",
	"พบ",
	"พร้อม",
	"มา",
	"มาก",
	"มี",
	"ยัง",
	"รวม",
	"ระหว่าง",
	"รับ",
	"ราย",
	"ร่วม",
	"ลง",
	"วัน",
	"ว่า",
	"สุด",
	"ส่ง",
	"ส่วน",
	"สําหรับ",
	"หนึ่ง",
	"หรือ",
	"หลัง",
	"หลังจาก",
	"หลาย",
	"หาก",
	"อยาก",
	"อยู่",
	"อย่าง",
	"ออก",
	"อะไร",
	"อาจ",
	"อีก",
	"เขา",
	"เข้า",
	"เคย",
	"เฉพาะ",
	"เช่น",
	"เดียว",
	"เดียวกัน",
	"เนื่องจาก",
	"เปิด",
	"เปิดเผย",
	"เป็น",
	"เป็นการ",
	"เพราะ",
	"เพื่อ",
	"เมื่อ",
	"เรา",
	"เริ่ม",
	"เลย",
	"เห็น",
	"เอง",
	"แต่",
	"แบบ",
	"แรก",
	"และ",
	"แล้ว",
	"แห่ง",
	"โดย",
	"ใน",
	"ให้",
	"ได้",
	"ไป",
	"ไม่",
	"ไว้",
	"้ง"
];

var tnthai$1;
var hasRequiredTnthai;

function requireTnthai () {
	if (hasRequiredTnthai) return tnthai$1;
	hasRequiredTnthai = 1;
	var doublearray = requireDoublearray();
	var assert = function() { };
	var stopwords = require$$3;

	function TNTrie(){
		var base_buffer = new Int32Array(bb);
		var check_buffer = new Int32Array(cb);
	    var trie = doublearray.load(base_buffer, check_buffer);

	    this.prefixes = function(sentence){
	        return trie.commonPrefixSearch(sentence)
	    };
	}

	function ThaiAnalyzer(){
	    var failSegmentRemainText = [];
	    var globalResult = [];
	    var result = [];
	    var inputWord;
	    var ascii_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	    var digits = "0123456789";
	    var punctuation = "!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~";
	    var printable = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \x0b\x0c";
	    var whitespace = " ";
	    var trie = new TNTrie();
	    var thai_unicode_char = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะ ัาำ ิ ี ึ ื ุ ู ฺ ฿เแโใไๅๆ ็ ่ ้ ๊ ๋ ์ ํ ๐๑๒๓๔๕๖๗๘๙' + "\u0e4e\u0e4f\u0e5a\u0e5b";

	    this.isLeadingChar = function(char){
	        return thai_unicode_char.replace(" ","").includes(char)
	    };

	    this.segmenting = function(InputString, option){
	            
	        option = (typeof option !== 'undefined') ? option : { filterStopword : false, multiSolution : false, verbose : false };

	        var filterStopword = (typeof option.filterStopword !== 'undefined') ? option.filterStopword : false;
	        var multiSolution = (typeof option.multiSolution !== 'undefined') ? option.multiSolution : false;
	        var verbose = (typeof option.verbose !== 'undefined') ? option.verbose : false;

	        var Mode;
	        inputWord = InputString; 
	        var segmentResults = [];
	        if (multiSolution){
	            Mode = "Safe";
	            this.safe_segment(InputString);
	            failSegmentRemainText = [];
	            segmentResults = globalResult.slice(0);
	        }
	        if (segmentResults.length == 0){
	            Mode = "Unsafe";
	            this.unsafe_segment(InputString);
	            segmentResults = globalResult.slice(0);
	        }
	        var segmentedResult;
	        globalResult = [];
	        var segmentedSoln = [];
	        if (!multiSolution){
	            segmentResults = [segmentResults[0]];
	        }
	        var FilteredResult = [];
	        if (filterStopword){
	            segmentResults.map(function(solution){
	                segmentedSoln = [];
	                solution.forEach(function(term){
	                    if (!stopwords.includes(term)){
	                        segmentedSoln.push(term);
	                    }
	                });
	                FilteredResult.push(segmentedSoln.slice(0));
	            });
	            if(!multiSolution){
	                segmentedResult = {solution:FilteredResult[0]};
	            }
	            else {
	                segmentedResult = {solution:FilteredResult};
	            }
	        }
	        else {
	            if(!multiSolution){
	                segmentedResult = {solution:segmentResults[0]};
	            }
	            else {
	                segmentedResult = {solution:segmentResults};
	            }
	        }

	        if (verbose){
	            segmentedResult.push({Mode});
	        }
	        return segmentedResult
	    };

	    this.safe_segment = function(remainText){
	        if (failSegmentRemainText.includes(remainText))
	            return false;

	        assert(result.join("") + remainText == inputWord);

	        if (remainText.length > 0){
	            var FirstChar = remainText[0];
	            if (this.isLeadingChar(FirstChar)){
	                var Prefixes = trie.prefixes(remainText);
	                var resultOrCount = false;
	                for (var i = Prefixes.length - 1; i >= 0; i-- ){
	                    var selectedPrefix = Prefixes[i]['k'];
	                    result.push(selectedPrefix);
	                    var suffixRemainText = remainText.substr(selectedPrefix.length);
	                    var prefixResult = this.safe_segment(suffixRemainText);
	                    result.pop();
	                    resultOrCount = resultOrCount || prefixResult;
	                }

	                if (!resultOrCount)
	                    failSegmentRemainText.push(remainText);
	            }
	            else {
	                if (printable.includes(FirstChar)){
	                    if (punctuation.includes(FirstChar)){
	                        var j = 0;
	                        while (punctuation.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.safe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                    if (whitespace.includes(FirstChar)){
	                        var j = 0;
	                        while (whitespace.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.safe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                    if (digits.includes(FirstChar)){
	                        var j = 0;
	                        while (digits.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.safe_segment(remainText.substr(j), trie);
	                        result.pop();
	                    }
	                    if (ascii_letters.includes(FirstChar)){
	                        var j = 0;
	                        while (ascii_letters.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.safe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                }
	                else {
	                    result.push(remainText[0]);
	                    this.safe_segment(remainText.substr(1));
	                    result.pop();
	                }
	            }
	            
	        }
	        else {
	            globalResult.push(result.slice(0));
	            return true
	        }
	    };

	    this.unsafe_segment = function(remainText){
	        if (globalResult.length > 0)    
	            return false;
	        
	        assert(result.join("") + remainText == inputWord);
	       
	        if (remainText.length > 0){
	            var FirstChar = remainText[0];
	            if (this.isLeadingChar(FirstChar)){
	                var Prefixes = trie.prefixes(remainText);
	                for ( var i = Prefixes.length-1; i >= 0; i-- ){
	                    result.push(Prefixes[i]['k']);
	                    this.unsafe_segment(remainText.substr(Prefixes[i]['k'].length));
	                    result.pop();
	                }
	                var j = 0;
	                var unsafePrefixes = "";
	                while( j < remainText.length){
	                    Prefixes = trie.prefixes(remainText.substr(j));
	                    j++;
	                    if (Prefixes.length > 0){
	                        unsafePrefixes = remainText.substr(0,j-1);
	                        break;
	                    }
	                    else {
	                        unsafePrefixes = remainText.substr(0,j);
	                    }
	                    if (j == remainText.length){
	                        unsafePrefixes = remainText;
	                        break
	                    }
	                    if (!this.isLeadingChar(remainText[j])){
	                        unsafePrefixes = remainText.substr(0,j);
	                        break
	                    }
	                }
	                result.push(unsafePrefixes);
	                this.unsafe_segment(remainText.substr(unsafePrefixes.length));
	                result.pop();
	            }
	            else {
	                if (printable.includes(FirstChar)){
	                    if (punctuation.includes(FirstChar)){
	                        var j = 0;
	                        while (punctuation.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.unsafe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                    if (whitespace.includes(FirstChar)){
	                        var j = 0;
	                        while (whitespace.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.unsafe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                    if (digits.includes(FirstChar)){
	                        var j = 0;
	                        while (digits.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.unsafe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                    if (ascii_letters.includes(FirstChar)){
	                        var j = 0;
	                        while (ascii_letters.includes(remainText[j])){
	                            j+=1;
	                            if (remainText.length == j)
	                                break;
	                        }
	                        result.push(remainText.substr(0,j));
	                        this.unsafe_segment(remainText.substr(j));
	                        result.pop();
	                    }
	                }
	                else {
	                    result.push(remainText[0]);
	                    this.unsafe_segment(remainText.substr(1));
	                    result.pop();
	                }
	            }
	        }
	        else {
	            globalResult.push(result.slice(0));
	        }
	    };
	}

	tnthai$1 = ThaiAnalyzer;
	return tnthai$1;
}

var tnthaiExports = requireTnthai();
export var tnthai = /*@__PURE__*/getDefaultExportFromCjs(tnthaiExports);