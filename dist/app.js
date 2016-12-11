webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var game_1 = __webpack_require__(1);
	(function () {
	    var game = new game_1.Game();
	    document.getElementById("restart").addEventListener("click", function (event) {
	        //document.getElementById("game").removeChild();
	        var conatiner = document.getElementById("gameContainer");
	        while (conatiner.firstChild) {
	            conatiner.removeChild(conatiner.firstChild);
	        }
	        game = null;
	        game = new game_1.Game();
	    });
	})();


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _1 = __webpack_require__(2);
	var collidables_1 = __webpack_require__(363);
	var player_1 = __webpack_require__(364);
	var model_1 = __webpack_require__(351);
	var collisionDetection_1 = __webpack_require__(367);
	var creepingDarkness_1 = __webpack_require__(368);
	var Game = (function () {
	    function Game() {
	        var _this = this;
	        this.fps = 60;
	        this.context = new _1.Context();
	        this.tileMap = new _1.TileMap();
	        this.creepingDarkness = new creepingDarkness_1.CreepingDarkness();
	        this.renderCalls = [];
	        this.collision = new collisionDetection_1.CollisionDetection();
	        this.tileSizeX = 25;
	        this.tileSizeY = 25;
	        this.started = false;
	        var doneLoading = this.context.doneListener();
	        doneLoading.subscribe(function () {
	            _this.render = new _1.Render();
	            _this.start();
	        });
	        this.context.init(1200, 800);
	        this.collidables = new collidables_1.Collidables(this.context);
	        this.tileMap.create(this.context, this.tileSizeX, this.tileSizeY);
	        this.creepingDarkness.init(this.context, this.tileMap.tiles);
	        this.player = new player_1.Player(new model_1.Vector(200, 600), this.context, 42, 50);
	    }
	    Game.prototype.start = function () {
	        this.initKeyBindings();
	        setInterval(this.run(), (1000 / this.fps));
	    };
	    Game.prototype.run = function () {
	        var _this = this;
	        var loops = 0, skipTicks = 1000 / this.fps, maxFrameSkip = 10, nextGameTick = (new Date).getTime();
	        return function () {
	            loops = 0;
	            while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
	                //Todo gamelogic update
	                if (_this.player.dead == true) {
	                    break;
	                }
	                _this.renderCalls = [];
	                if (_this.started) {
	                    _this.tileMap.refreshCollidableTiles();
	                    _this.collidables.update(_this.tileMap.collidableTiles);
	                    _this.creepingDarkness.update(_this.player.repelingDarkness);
	                    _this.collision.checkCollidables(_this.player, _this.collidables);
	                    _this.checkKeys();
	                    _this.collision.checkIfWallCollision(_this.player, _this.tileMap, _this.tileSizeX);
	                    _this.player.update();
	                    _this.checkSolid();
	                }
	                nextGameTick += skipTicks;
	                loops++;
	            }
	            if (loops) {
	                _this.context.gl.clear(_this.context.gl.DEPTH_BUFFER_BIT | _this.context.gl.COLOR_BUFFER_BIT);
	                if (_this.player.dead == true) {
	                    _this.renderCalls.push(_this.player.createDeathCall());
	                }
	                else {
	                    _this.renderCalls.push(_this.player.createRenderCall());
	                }
	                _this.renderCalls.push(_this.collidables.createRenderCall());
	                _this.renderCalls.push(_this.tileMap.createRenderCall());
	                _this.render.render(_this.renderCalls);
	            }
	        };
	    };
	    Game.prototype.checkKeys = function () {
	        if (this.leftKeyPress) {
	            this.player.moveLeft();
	        }
	        if (this.rightKeyPress) {
	            this.player.moveRight();
	        }
	        if (this.jumpKeyPress) {
	            this.player.jump();
	        }
	    };
	    Game.prototype.checkSolid = function () {
	        var tilesToCheck = this.collision.detectPossibleCollisions(this.player.position, this.tileMap.tiles, this.tileSizeX);
	        var groundCollision = this.collision.checkCollision(tilesToCheck, this.player.getCollisionArea(), this.player);
	        if (!groundCollision) {
	            this.player.fall();
	        }
	        else {
	            groundCollision = this.player.groundCollision();
	        }
	        var wallCollision = this.collision.checkCollision(tilesToCheck, this.player.getCollisionArea(), this.player);
	        if (wallCollision) {
	            this.player.wallCollision();
	        }
	        if (groundCollision && !wallCollision) {
	            this.player.resetJump();
	        }
	    };
	    Game.prototype.initKeyBindings = function () {
	        var _this = this;
	        document.body.addEventListener("keydown", function (event) {
	            var keyCode = event.keyCode;
	            switch (keyCode) {
	                case 65:
	                    _this.leftKeyPress = true;
	                    break;
	                case 68:
	                    _this.rightKeyPress = true;
	                    break;
	                case 87:
	                    _this.jumpKeyPress = true;
	            }
	        });
	        document.body.addEventListener("keyup", function (event) {
	            var keyCode = event.keyCode;
	            switch (keyCode) {
	                case 65:
	                    _this.leftKeyPress = false;
	                    break;
	                case 68:
	                    _this.rightKeyPress = false;
	                    break;
	                case 87:
	                    _this.jumpKeyPress = false;
	                    break;
	            }
	        });
	        document.getElementById("start").addEventListener("click", function (event) {
	            _this.started = true;
	        });
	    };
	    return Game;
	}());
	exports.Game = Game;


/***/ },

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var context_1 = __webpack_require__(3);
	exports.Context = context_1.Context;
	var game_1 = __webpack_require__(1);
	exports.Game = game_1.Game;
	var tileMap_1 = __webpack_require__(358);
	exports.TileMap = tileMap_1.TileMap;
	var render_1 = __webpack_require__(362);
	exports.Render = render_1.Render;


/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var $ = __webpack_require__(4);
	var rxjs_1 = __webpack_require__(5);
	var model_1 = __webpack_require__(351);
	var Context = (function () {
	    function Context() {
	    }
	    Context.prototype.doneListener = function () {
	        var _this = this;
	        return new rxjs_1.Observable(function (observer) {
	            _this.observer = observer;
	        });
	    };
	    Context.prototype.init = function (width, height) {
	        this.initContext(width, height);
	        this.initShaders();
	    };
	    Context.prototype.initContext = function (width, height) {
	        var div = document.createElement("div");
	        var container = document.getElementById("gameContainer");
	        this.canvas = document.createElement("canvas");
	        this.canvas.width = width;
	        this.canvas.height = height;
	        div.id = "game";
	        div.style.display = "block";
	        div.appendChild(this.canvas);
	        container.appendChild(div);
	        this.gl = this.canvas.getContext("experimental-webgl");
	        console.log("Context initialized...");
	    };
	    Context.prototype.initShaders = function () {
	        var _this = this;
	        $.when(this.loadShader(model_1.ShaderType.Vertex), this.loadShader(model_1.ShaderType.Fragment)).then(function (vertexData, fragmentData) {
	            var vertexShader = _this.compileShader(vertexData[0], model_1.ShaderType.Vertex);
	            var fragmentShader = _this.compileShader(fragmentData[0], model_1.ShaderType.Fragment);
	            _this.shaderProgram = _this.gl.createProgram();
	            _this.gl.attachShader(_this.shaderProgram, vertexShader);
	            _this.gl.attachShader(_this.shaderProgram, fragmentShader);
	            _this.gl.linkProgram(_this.shaderProgram);
	            if (!_this.gl.getProgramParameter(_this.shaderProgram, _this.gl.LINK_STATUS)) {
	                alert("Unable to initialize the shader program: " + _this.gl.getProgramInfoLog(_this.shaderProgram));
	            }
	            _this.gl.useProgram(_this.shaderProgram);
	            _this.initTextures(_this.gl);
	        });
	    };
	    Context.prototype.initTextures = function (gl) {
	        var _this = this;
	        this.texture = gl.createTexture();
	        var textureImage = new Image();
	        textureImage.onload = function () {
	            _this.handleTextureLoaded(textureImage, _this.texture, gl);
	        };
	        textureImage.src = "/assets/sprites.png";
	    };
	    Context.prototype.handleTextureLoaded = function (image, texture, gl) {
	        gl.bindTexture(gl.TEXTURE_2D, texture);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	        gl.generateMipmap(gl.TEXTURE_2D);
	        gl.bindTexture(gl.TEXTURE_2D, null);
	        gl.clearColor(1, 1, 1, 1);
	        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	        gl.enable(gl.BLEND);
	        this.observer.next(null);
	    };
	    Context.prototype.compileShader = function (source, shaderType) {
	        var shader;
	        if (shaderType == model_1.ShaderType.Fragment) {
	            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
	        }
	        else if (shaderType == model_1.ShaderType.Vertex) {
	            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
	        }
	        this.gl.shaderSource(shader, source);
	        this.gl.compileShader(shader);
	        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
	            console.log("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
	            return null;
	        }
	        return shader;
	    };
	    Context.prototype.loadShader = function (shaderType) {
	        var shaderSource = "";
	        if (shaderType == model_1.ShaderType.Fragment) {
	            shaderSource = "src/shader/fragmentShader.c";
	        }
	        else if (shaderType == model_1.ShaderType.Vertex) {
	            shaderSource = "src/shader/vertexShader.c";
	        }
	        var promise = $.ajax({ url: shaderSource });
	        return promise;
	    };
	    return Context;
	}());
	exports.Context = Context;


/***/ },

/***/ 351:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var shaderType_1 = __webpack_require__(352);
	exports.ShaderType = shaderType_1.ShaderType;
	var tile_1 = __webpack_require__(353);
	exports.Tile = tile_1.Tile;
	var vector_1 = __webpack_require__(354);
	exports.Vector = vector_1.Vector;
	var square_1 = __webpack_require__(355);
	exports.Square = square_1.Square;
	var powerUp_1 = __webpack_require__(356);
	exports.PowerUp = powerUp_1.PowerUp;
	var powerUpCounter_1 = __webpack_require__(357);
	exports.PowerUpCounter = powerUpCounter_1.PowerUpCounter;


/***/ },

/***/ 352:
/***/ function(module, exports) {

	"use strict";
	(function (ShaderType) {
	    ShaderType[ShaderType["Vertex"] = 1] = "Vertex";
	    ShaderType[ShaderType["Fragment"] = 2] = "Fragment";
	})(exports.ShaderType || (exports.ShaderType = {}));
	var ShaderType = exports.ShaderType;


/***/ },

/***/ 353:
/***/ function(module, exports) {

	"use strict";
	var Tile = (function () {
	    function Tile(x, y, width, height, textureType) {
	        this.x = x;
	        this.y = y;
	        this.width = width;
	        this.height = height;
	        this.tileTextureType = textureType;
	    }
	    return Tile;
	}());
	exports.Tile = Tile;


/***/ },

/***/ 354:
/***/ function(module, exports) {

	"use strict";
	var Vector = (function () {
	    function Vector(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    Vector.prototype.add = function (vector) {
	        this.x += vector.x;
	        this.y += vector.y;
	        return this;
	    };
	    Vector.prototype.copy = function (vector) {
	        return new Vector(vector.x, vector.y);
	    };
	    return Vector;
	}());
	exports.Vector = Vector;


/***/ },

/***/ 355:
/***/ function(module, exports) {

	"use strict";
	var Square = (function () {
	    function Square(x, y, width, height) {
	        this.x = x;
	        this.y = y;
	        this.width = width;
	        this.height = height;
	    }
	    return Square;
	}());
	exports.Square = Square;


/***/ },

/***/ 356:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var _1 = __webpack_require__(351);
	var PowerUp = (function () {
	    function PowerUp(x, y, width, height, type) {
	        this.x = x;
	        this.y = y;
	        this.width = width;
	        this.height = height;
	        this.box = new _1.Square(x, y, width, height);
	        this.type = type;
	    }
	    return PowerUp;
	}());
	exports.PowerUp = PowerUp;


/***/ },

/***/ 357:
/***/ function(module, exports) {

	"use strict";
	var PowerUpCounter = (function () {
	    function PowerUpCounter(type) {
	        this.count = 180;
	        this.type = type;
	    }
	    return PowerUpCounter;
	}());
	exports.PowerUpCounter = PowerUpCounter;


/***/ },

/***/ 358:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var model_1 = __webpack_require__(351);
	var renderCall_1 = __webpack_require__(359);
	var textureMapper_1 = __webpack_require__(360);
	var renderHelper_1 = __webpack_require__(361);
	var TileMap = (function () {
	    function TileMap() {
	        this.renderCall = new renderCall_1.RenderCall();
	        this.tiles = [];
	        this.collidableTiles = [];
	        this.textureMapper = textureMapper_1.TextureMapper.getInstance();
	        this.renderHelper = renderHelper_1.RenderHelper.getInstance();
	    }
	    TileMap.prototype.create = function (context, tileSizeX, tileSizeY) {
	        this.context = context;
	        this.tileSizeX = tileSizeX;
	        this.tileSizeY = tileSizeY;
	        var columnNumber = this.context.canvas.width / this.tileSizeX;
	        var rowNumber = this.context.canvas.height / this.tileSizeY;
	        for (var i = 0; i < columnNumber; i++) {
	            this.tiles[i] = [];
	            for (var j = 0; j < rowNumber; j++) {
	                this.tiles[i][j] = new model_1.Tile((tileSizeX * i) + (tileSizeX / 2), (tileSizeY * j) + (tileSizeY / 2), tileSizeX, tileSizeY, 0);
	            }
	        }
	        this.tiles[7][28].tileTextureType = 1;
	        this.tiles[8][28].tileTextureType = 1;
	        this.tiles[9][28].tileTextureType = 1;
	        this.tiles[12][28].tileTextureType = 1;
	        this.tiles[13][28].tileTextureType = 1;
	        this.tiles[7][20].tileTextureType = 1;
	        this.tiles[8][20].tileTextureType = 1;
	        this.tiles[12][20].tileTextureType = 1;
	        this.tiles[13][20].tileTextureType = 1;
	        this.tiles[17][20].tileTextureType = 1;
	        this.tiles[18][20].tileTextureType = 1;
	        this.tiles[20][25].tileTextureType = 1;
	        this.tiles[21][25].tileTextureType = 1;
	        this.tiles[27][28].tileTextureType = 1;
	        this.tiles[28][28].tileTextureType = 1;
	        this.tiles[31][28].tileTextureType = 1;
	        this.tiles[32][28].tileTextureType = 1;
	        this.tiles[33][28].tileTextureType = 1;
	        this.tiles[37][20].tileTextureType = 1;
	        this.tiles[38][20].tileTextureType = 1;
	        this.tiles[39][20].tileTextureType = 1;
	        this.tiles[40][20].tileTextureType = 1;
	        this.tiles[41][20].tileTextureType = 1;
	        this.tiles[42][20].tileTextureType = 1;
	        this.tiles[43][20].tileTextureType = 1;
	        this.tiles[17][25].tileTextureType = 1;
	        this.tiles[18][25].tileTextureType = 1;
	        this.tiles[19][25].tileTextureType = 1;
	        this.tiles[20][25].tileTextureType = 1;
	        this.tiles[21][25].tileTextureType = 1;
	        this.tiles[18][15].tileTextureType = 1;
	        this.tiles[19][15].tileTextureType = 1;
	        this.tiles[20][15].tileTextureType = 1;
	        this.tiles[21][15].tileTextureType = 1;
	        this.tiles[25][22].tileTextureType = 1;
	        this.tiles[26][22].tileTextureType = 1;
	        this.tiles[27][22].tileTextureType = 1;
	        this.tiles[28][22].tileTextureType = 1;
	        this.tiles[25][10].tileTextureType = 1;
	        this.tiles[26][10].tileTextureType = 1;
	        this.tiles[27][10].tileTextureType = 1;
	        this.tiles[28][10].tileTextureType = 1;
	        this.tiles[29][10].tileTextureType = 1;
	        this.tiles[30][10].tileTextureType = 1;
	        this.tiles[31][10].tileTextureType = 1;
	        this.tiles[32][10].tileTextureType = 1;
	        this.tiles[34][11].tileTextureType = 1;
	        this.tiles[35][12].tileTextureType = 1;
	        this.tiles[36][13].tileTextureType = 1;
	        this.tiles[37][14].tileTextureType = 1;
	        this.tiles[38][15].tileTextureType = 1;
	        this.tiles[10][10].tileTextureType = 1;
	        this.tiles[11][10].tileTextureType = 1;
	        this.tiles[12][10].tileTextureType = 1;
	        this.tiles[13][10].tileTextureType = 1;
	        this.tiles[14][10].tileTextureType = 1;
	        this.refreshCollidableTiles();
	    };
	    TileMap.prototype.refreshCollidableTiles = function () {
	        for (var i = 0; i < this.tiles.length; i++) {
	            for (var j = 0; j < this.tiles[i].length; j++) {
	                if (this.tiles[i][j].tileTextureType != 0 && this.tiles[i][j].tileTextureType != 2) {
	                    this.collidableTiles.push(this.tiles[i][j]);
	                }
	            }
	        }
	    };
	    TileMap.prototype.createRenderCall = function () {
	        var vertecies = [];
	        var textureCoords = [];
	        var indecies = [];
	        for (var i = 0; i < this.tiles.length; i++) {
	            for (var j = 0; j < this.tiles[i].length; j++) {
	                if (this.tiles[i][j].tileTextureType != 0) {
	                    vertecies = this.renderHelper.getVertecies(this.tiles[i][j].x, this.tiles[i][j].y, this.tiles[i][j].width, this.tiles[i][j].height, vertecies);
	                    textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, this.tiles[i][j].tileTextureType);
	                    indecies = this.renderHelper.getIndecies(indecies);
	                }
	            }
	        }
	        this.renderCall.vertecies = vertecies;
	        this.renderCall.textureCoords = textureCoords;
	        this.renderCall.indecies = indecies;
	        this.renderCall.context = this.context;
	        return this.renderCall;
	    };
	    return TileMap;
	}());
	exports.TileMap = TileMap;


/***/ },

/***/ 359:
/***/ function(module, exports) {

	"use strict";
	var RenderCall = (function () {
	    function RenderCall() {
	    }
	    return RenderCall;
	}());
	exports.RenderCall = RenderCall;


/***/ },

/***/ 360:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var model_1 = __webpack_require__(351);
	var TextureMapper = (function () {
	    function TextureMapper() {
	    }
	    TextureMapper.prototype.constrcuctor = function () {
	        if (TextureMapper.instance) {
	            throw new Error("Static class cant be instanced!");
	        }
	        TextureMapper.instance = this;
	    };
	    TextureMapper.getInstance = function () {
	        return TextureMapper.instance;
	    };
	    TextureMapper.prototype.mapTexture = function (textureType) {
	        switch (textureType) {
	            case 1: return new model_1.Square(0, 0, 64, 64);
	            case 2: return new model_1.Square(64, 0, 64, 64);
	            case 3: return new model_1.Square(0, 320, 64, 64);
	            case 15: return new model_1.Square(64, 320, 64, 64);
	            case 16: return new model_1.Square(0, 320, 64, 64);
	            case 50: return new model_1.Square(0, 384, 64, 64);
	            case 51: return new model_1.Square(64, 384, 64, 64);
	            case 52: return new model_1.Square(128, 384, 64, 64);
	            case 100: return new model_1.Square(192, 192, 128, 128);
	        }
	    };
	    TextureMapper.instance = new TextureMapper();
	    return TextureMapper;
	}());
	exports.TextureMapper = TextureMapper;


/***/ },

/***/ 361:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var textureMapper_1 = __webpack_require__(360);
	var RenderHelper = (function () {
	    function RenderHelper() {
	        this.textureMapper = textureMapper_1.TextureMapper.getInstance();
	    }
	    RenderHelper.prototype.constrcuctor = function () {
	        if (RenderHelper.instance) {
	            throw new Error("Static class cant be instanced!");
	        }
	        RenderHelper.instance = this;
	    };
	    RenderHelper.getInstance = function () {
	        return RenderHelper.instance;
	    };
	    RenderHelper.prototype.getVertecies = function (x, y, width, height, currentVertecies) {
	        var x1 = x - (width / 2);
	        var x2 = x + (width / 2);
	        var y1 = y - (height / 2);
	        var y2 = y + (height / 2);
	        var newVertecies = [
	            x1, y1,
	            x2, y2,
	            x2, y1,
	            x1, y1,
	            x2, y2,
	            x1, y2
	        ];
	        currentVertecies.push.apply(currentVertecies, newVertecies);
	        return currentVertecies;
	    };
	    RenderHelper.prototype.getIndecies = function (currentIndecies) {
	        var vertexIndices = [
	            currentIndecies.length, currentIndecies.length + 1, currentIndecies.length + 2, currentIndecies.length + 3, currentIndecies.length + 4, currentIndecies.length + 5
	        ];
	        currentIndecies.push.apply(currentIndecies, vertexIndices);
	        return currentIndecies;
	    };
	    RenderHelper.prototype.getTextureCoordinates = function (currentTextureCoordinates, textureType) {
	        var square = this.textureMapper.mapTexture(textureType);
	        var x1 = square.x / 512;
	        var y1 = square.y / 512;
	        var x2 = (square.x + square.width) / 512;
	        var y2 = (square.y + square.height) / 512;
	        var textureCoordinates = [
	            x1, y1,
	            x2, y2,
	            x2, y1,
	            x1, y1,
	            x2, y2,
	            x1, y2
	        ];
	        currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);
	        return currentTextureCoordinates;
	    };
	    RenderHelper.instance = new RenderHelper();
	    return RenderHelper;
	}());
	exports.RenderHelper = RenderHelper;


/***/ },

/***/ 362:
/***/ function(module, exports) {

	"use strict";
	var Render = (function () {
	    function Render() {
	    }
	    Render.prototype.render = function (renderCalls) {
	        for (var _i = 0, renderCalls_1 = renderCalls; _i < renderCalls_1.length; _i++) {
	            var renderCall = renderCalls_1[_i];
	            this.context = renderCall.context;
	            this.gl = this.context.gl;
	            this.shaderProgram = this.context.shaderProgram;
	            var positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
	            this.gl.enableVertexAttribArray(positionLocation);
	            var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
	            var colorLocation = this.gl.getUniformLocation(this.shaderProgram, "u_color");
	            var textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_texture_coord");
	            this.gl.enableVertexAttribArray(textureCoordAttribute);
	            this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "u_sampler"), 0);
	            this.setBuffers(renderCall);
	            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
	            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
	            this.gl.uniform2f(resolutionLocation, renderCall.context.canvas.width, renderCall.context.canvas.height);
	            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
	            this.gl.vertexAttribPointer(textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
	            this.gl.activeTexture(this.gl.TEXTURE0);
	            this.gl.bindTexture(this.gl.TEXTURE_2D, renderCall.context.texture);
	            this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "u_sampler"), 0);
	            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
	            this.gl.drawElements(this.gl.TRIANGLES, renderCall.indecies.length, this.gl.UNSIGNED_SHORT, 0);
	        }
	    };
	    Render.prototype.setBuffers = function (renderCall) {
	        this.vertexBuffer = this.gl.createBuffer();
	        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
	        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.vertecies), this.gl.STATIC_DRAW);
	        this.textureCoordBuffer = this.gl.createBuffer();
	        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
	        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.textureCoords), this.gl.STATIC_DRAW);
	        this.indeciesBuffer = this.gl.createBuffer();
	        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
	        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indecies), this.gl.STATIC_DRAW);
	    };
	    return Render;
	}());
	exports.Render = Render;


/***/ },

/***/ 363:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var model_1 = __webpack_require__(351);
	var renderCall_1 = __webpack_require__(359);
	var renderHelper_1 = __webpack_require__(361);
	var Collidables = (function () {
	    function Collidables(context) {
	        this.powerUps = [];
	        this.renderHelper = renderHelper_1.RenderHelper.getInstance();
	        this.updateCount = 0;
	        this.powerUpOffset = 30;
	        this.context = context;
	    }
	    Collidables.prototype.createRenderCall = function () {
	        var renderCall = new renderCall_1.RenderCall();
	        var vertecies = [];
	        var textureCoords = [];
	        var indecies = [];
	        for (var _i = 0, _a = this.powerUps; _i < _a.length; _i++) {
	            var powerUp = _a[_i];
	            vertecies = this.renderHelper.getVertecies(powerUp.box.x, powerUp.box.y, powerUp.box.width, powerUp.box.height, vertecies);
	            textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, powerUp.type);
	            indecies = this.renderHelper.getIndecies(indecies);
	        }
	        renderCall.vertecies = vertecies;
	        renderCall.textureCoords = textureCoords;
	        renderCall.indecies = indecies;
	        renderCall.context = this.context;
	        return renderCall;
	    };
	    Collidables.prototype.update = function (tiles) {
	        this.updateCount++;
	        if (this.updateCount > 120) {
	            var type = Math.floor(Math.random() * 2) + 15;
	            var i = this.getUnocupiedPosition(tiles);
	            if (i >= 0) {
	                if (type == 15) {
	                    this.powerUps.push(new model_1.PowerUp(tiles[i].x, tiles[i].y - this.powerUpOffset, 25, 25, type));
	                }
	                else {
	                    this.powerUps.push(new model_1.PowerUp(tiles[i].x, tiles[i].y - this.powerUpOffset, 25, 25, type));
	                }
	            }
	            this.updateCount = 0;
	        }
	    };
	    Collidables.prototype.getUnocupiedPosition = function (tiles) {
	        var index = -1;
	        for (var j = 0; j < 10; j++) {
	            var i = Math.floor(Math.random() * tiles.length);
	            var ocupied = false;
	            for (var _i = 0, _a = this.powerUps; _i < _a.length; _i++) {
	                var powerUp = _a[_i];
	                if (tiles[i].x == powerUp.box.x && (tiles[i].y - this.powerUpOffset) == powerUp.box.y) {
	                    ocupied = true;
	                }
	            }
	            if (!ocupied) {
	                index = i;
	                break;
	            }
	        }
	        return index;
	    };
	    return Collidables;
	}());
	exports.Collidables = Collidables;


/***/ },

/***/ 364:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var model_1 = __webpack_require__(351);
	var textureMapper_1 = __webpack_require__(360);
	var renderCall_1 = __webpack_require__(359);
	var renderHelper_1 = __webpack_require__(361);
	var animate_1 = __webpack_require__(365);
	var gravity_1 = __webpack_require__(366);
	var Player = (function () {
	    function Player(position, context, spriteSizeX, spriteSizeY) {
	        this.defaultJumpSpeed = -10;
	        this.jumpSpeed = this.defaultJumpSpeed;
	        this.repelingDarkness = false;
	        this.dead = false;
	        this.extraJumpSpeed = 0;
	        this.runningAnimation = new animate_1.Animate();
	        this.inverse = false;
	        this.velocity = new model_1.Vector(0, 0);
	        this.drag = 0.4;
	        this.moving = false;
	        this.gravity = new gravity_1.Gravity();
	        this.jumping = false;
	        this.powerUpCounters = [];
	        this.textureMapper = textureMapper_1.TextureMapper.getInstance();
	        this.renderHelper = renderHelper_1.RenderHelper.getInstance();
	        this.position = position;
	        this.lastStablePosition = new model_1.Vector(this.position.x, this.position.y);
	        this.context = context;
	        this.spriteSizeX = spriteSizeX;
	        this.spriteSizeY = spriteSizeY;
	        //this.animate.frames.push(new Point(1, 282));
	        this.runningAnimation.frames.push(this.textureMapper.mapTexture(50));
	        this.runningAnimation.frames.push(this.textureMapper.mapTexture(51));
	        this.runningAnimation.frames.push(this.textureMapper.mapTexture(52));
	    }
	    Player.prototype.createRenderCall = function () {
	        var call = new renderCall_1.RenderCall();
	        var x = this.position.x;
	        var x1;
	        var x2;
	        if (this.inverse) {
	            x2 = x - (this.spriteSizeX / 2);
	            x1 = x + (this.spriteSizeX / 2);
	        }
	        else {
	            x2 = x + (this.spriteSizeX / 2);
	            x1 = x - (this.spriteSizeX / 2);
	        }
	        var y1 = this.position.y - (this.spriteSizeY / 2);
	        var y2 = this.position.y + (this.spriteSizeY / 2);
	        call.context = this.context;
	        call.vertecies = [
	            x1, y1,
	            x2, y2,
	            x2, y1,
	            x1, y1,
	            x2, y2,
	            x1, y2
	        ];
	        var x1 = this.runningAnimation.getCurrentFrame().x / 512;
	        var y1 = this.runningAnimation.getCurrentFrame().y / 512;
	        var x2 = (this.runningAnimation.getCurrentFrame().x + this.runningAnimation.getCurrentFrame().width) / 512;
	        var y2 = (this.runningAnimation.getCurrentFrame().y + this.runningAnimation.getCurrentFrame().height) / 512;
	        call.textureCoords = [
	            x1, y1,
	            x2, y2,
	            x2, y1,
	            x1, y1,
	            x2, y2,
	            x1, y2,
	        ];
	        call.indecies = [0, 1, 2, 3, 4, 5];
	        return call;
	    };
	    Player.prototype.update = function () {
	        this.checkPowerUps();
	        this.position.add(this.velocity);
	        if (this.velocity.x != 0) {
	            this.runningAnimation.next();
	        }
	        if (!this.moving) {
	            if (this.velocity.x > 0) {
	                this.velocity.x -= this.drag;
	                if (this.velocity.x < this.drag) {
	                    this.velocity.x = 0;
	                }
	            }
	            else if (this.velocity.x < 0) {
	                this.velocity.x += this.drag;
	                if (this.velocity.x > this.drag) {
	                    this.velocity.x = 0;
	                }
	            }
	        }
	        this.moving = false;
	    };
	    Player.prototype.moveRight = function () {
	        if (this.velocity.x < 3) {
	            this.velocity.x += 0.5;
	        }
	        this.inverse = false;
	        this.moving = true;
	    };
	    Player.prototype.moveLeft = function () {
	        if (this.velocity.x > -3) {
	            this.velocity.x -= 0.5;
	        }
	        this.inverse = true;
	        this.moving = true;
	    };
	    Player.prototype.getCollisionArea = function () {
	        var collision = new model_1.Square(this.position.x, this.position.y, this.spriteSizeX, this.spriteSizeY);
	        return collision;
	    };
	    Player.prototype.wallCollision = function () {
	        this.position.x -= this.velocity.x;
	        this.velocity.x = 0;
	    };
	    Player.prototype.fall = function () {
	        this.gravity.apply(this.velocity);
	    };
	    Player.prototype.groundCollision = function () {
	        var groundCollision = this.velocity.y > 0;
	        this.position.y -= this.velocity.y;
	        this.velocity.y = 0;
	        return groundCollision;
	    };
	    Player.prototype.getNextCollisionArea = function (row) {
	        if (row) {
	            this.position.x += this.velocity.x;
	        }
	        else {
	            this.position.y += this.velocity.y;
	        }
	        return this.getCollisionArea();
	    };
	    Player.prototype.jump = function () {
	        if (!this.jumping) {
	            this.velocity.y = (this.jumpSpeed - this.extraJumpSpeed);
	            this.jumping = true;
	        }
	    };
	    Player.prototype.resetJump = function () {
	        this.jumping = false;
	    };
	    Player.prototype.addPowerUp = function (powerUp) {
	        this.powerUpCounters.push(new model_1.PowerUpCounter(powerUp.type));
	    };
	    Player.prototype.createDeathCall = function () {
	        var renderCall = new renderCall_1.RenderCall();
	        var vertecies = [];
	        var textureCoords = [];
	        var indecies = [];
	        vertecies = this.renderHelper.getVertecies(600, 400, 128, 128, vertecies);
	        textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, 100);
	        indecies = this.renderHelper.getIndecies(indecies);
	        renderCall.vertecies = vertecies;
	        renderCall.textureCoords = textureCoords;
	        renderCall.indecies = indecies;
	        renderCall.context = this.context;
	        return renderCall;
	    };
	    Player.prototype.checkPowerUps = function () {
	        this.extraJumpSpeed = 0;
	        this.repelingDarkness = false;
	        for (var i = 0; i < this.powerUpCounters.length; i++) {
	            if (this.powerUpCounters[i].type == 16) {
	                this.extraJumpSpeed = 3;
	            }
	            else if (this.powerUpCounters[i].type == 15) {
	                this.repelingDarkness = true;
	            }
	            this.powerUpCounters[i].count--;
	            if (this.powerUpCounters[i].count <= 0) {
	                this.powerUpCounters.splice(i, 1);
	            }
	        }
	    };
	    return Player;
	}());
	exports.Player = Player;


/***/ },

/***/ 365:
/***/ function(module, exports) {

	"use strict";
	var Animate = (function () {
	    function Animate() {
	        this.frames = [];
	        this.frameIndex = 0;
	        this.frameRenderTimes = 0;
	        this.frameRenderMaxTimes = 4;
	    }
	    Animate.prototype.next = function () {
	        this.frameRenderTimes++;
	        if (this.frameRenderTimes >= this.frameRenderMaxTimes) {
	            this.frameRenderTimes = 0;
	            this.frameIndex++;
	            if (this.frameIndex >= this.frames.length) {
	                this.frameIndex = 0;
	            }
	        }
	    };
	    Animate.prototype.getCurrentFrame = function () {
	        return this.frames[this.frameIndex];
	    };
	    return Animate;
	}());
	exports.Animate = Animate;


/***/ },

/***/ 366:
/***/ function(module, exports) {

	"use strict";
	var Gravity = (function () {
	    function Gravity() {
	    }
	    Gravity.prototype.apply = function (vector) {
	        vector.y += 0.5;
	    };
	    return Gravity;
	}());
	exports.Gravity = Gravity;


/***/ },

/***/ 367:
/***/ function(module, exports) {

	"use strict";
	var CollisionDetection = (function () {
	    function CollisionDetection() {
	    }
	    CollisionDetection.prototype.detectPossibleCollisions = function (position, tiles, tileSize) {
	        var column = Math.floor(position.x / tileSize);
	        var row = Math.floor(position.y / tileSize);
	        var tilesToCheck = [];
	        tilesToCheck.push(tiles[column - 1][row + 1]);
	        tilesToCheck.push(tiles[column][row + 1]);
	        tilesToCheck.push(tiles[column + 1][row + 1]);
	        tilesToCheck.push(tiles[column - 1][row]);
	        tilesToCheck.push(tiles[column][row]);
	        tilesToCheck.push(tiles[column + 1][row]);
	        tilesToCheck.push(tiles[column - 1][row - 1]);
	        tilesToCheck.push(tiles[column][row - 1]);
	        tilesToCheck.push(tiles[column + 1][row - 1]);
	        return tilesToCheck;
	    };
	    CollisionDetection.prototype.checkCollision = function (tiles, rect, player) {
	        var collision = false;
	        for (var _i = 0, tiles_1 = tiles; _i < tiles_1.length; _i++) {
	            var tile = tiles_1[_i];
	            if (tile.tileTextureType != 0) {
	                if (tile.x - tile.width / 2 < rect.x + rect.width / 2 &&
	                    tile.x + tile.width / 2 > rect.x - rect.width / 2 &&
	                    tile.y - tile.height / 2 < rect.y + rect.height / 2 &&
	                    tile.y + tile.height / 2 > rect.y - rect.height / 2) {
	                    if (tile.tileTextureType == 2) {
	                        player.dead = true;
	                    }
	                    collision = true;
	                    break;
	                }
	            }
	        }
	        return collision;
	    };
	    CollisionDetection.prototype.checkIfWallCollision = function (player, tileMap, tileSize) {
	        var wallCollision = true;
	        var i = 0;
	        while (wallCollision && i < 10) {
	            i++;
	            var tilesToCheck = this.detectPossibleCollisions(player.position, tileMap.tiles, tileSize);
	            wallCollision = this.checkCollision(tilesToCheck, player.getNextCollisionArea(true), player);
	            if (wallCollision) {
	                player.wallCollision();
	            }
	        }
	        return wallCollision;
	    };
	    CollisionDetection.prototype.checkCollidables = function (player, collidables) {
	        var collision = false;
	        var rect = player.getCollisionArea();
	        for (var i = 0; i < collidables.powerUps.length; i++) {
	            if (collidables.powerUps[i].box.x - collidables.powerUps[i].box.width / 2 < rect.x + rect.width / 2 &&
	                collidables.powerUps[i].box.x + collidables.powerUps[i].box.width / 2 > rect.x - rect.width / 2 &&
	                collidables.powerUps[i].box.y - collidables.powerUps[i].box.height / 2 < rect.y + rect.height / 2 &&
	                collidables.powerUps[i].box.y + collidables.powerUps[i].box.height / 2 > rect.y - rect.height / 2) {
	                player.addPowerUp(collidables.powerUps[i]);
	                collidables.powerUps.splice(i, 1);
	            }
	        }
	        return collision;
	    };
	    return CollisionDetection;
	}());
	exports.CollisionDetection = CollisionDetection;


/***/ },

/***/ 368:
/***/ function(module, exports) {

	"use strict";
	var CreepingDarkness = (function () {
	    function CreepingDarkness() {
	        this.creepingDarkness = [];
	    }
	    CreepingDarkness.prototype.constructior = function () {
	    };
	    CreepingDarkness.prototype.init = function (context, tiles) {
	        this.tiles = tiles;
	    };
	    CreepingDarkness.prototype.update = function (repel) {
	        if (repel) {
	            var possibleTiles = this.getPossibleDarkness(2, repel);
	            if (possibleTiles.length > 0) {
	                var i = Math.floor(Math.random() * possibleTiles.length);
	                possibleTiles[i].tileTextureType = 0;
	            }
	        }
	        else {
	            var possibleTiles = this.getPossibleDarkness(2, repel);
	            if (possibleTiles.length > 0) {
	                var i = Math.floor(Math.random() * possibleTiles.length);
	                possibleTiles[i].tileTextureType = 2;
	            }
	        }
	    };
	    CreepingDarkness.prototype.repelDarkness = function () {
	    };
	    CreepingDarkness.prototype.getPossibleDarkness = function (type, repel) {
	        var possibleTiles = [];
	        var iInvert = this.tiles.length - 1;
	        var row = 0;
	        var rowInvert = this.tiles[0].length - 1;
	        var rightColumn;
	        var leftColumn;
	        var topRow;
	        var bottomRow;
	        var i = 0;
	        var j = 0;
	        if (repel) {
	            row = this.tiles[0].length / 2;
	            rowInvert = this.tiles[0].length / 2 - 1;
	            i = this.tiles.length / 2;
	            iInvert = this.tiles.length / 2 - 1;
	        }
	        for (; i < this.tiles.length; i++) {
	            topRow = this.row(this.tiles, row, type, j, repel);
	            bottomRow = this.row(this.tiles, rowInvert, type, j, repel);
	            rightColumn = this.column(this.tiles[iInvert], type, j, repel);
	            leftColumn = this.column(this.tiles[i], type, j, repel);
	            iInvert--;
	            row = row < this.tiles[i].length - 1 ? row + 1 : row;
	            rowInvert = rowInvert > 0 ? rowInvert - 1 : rowInvert;
	            j++;
	            if (leftColumn.length > 0 || rightColumn.length > 0 || topRow.length > 0 || bottomRow.length > 0) {
	                break;
	            }
	        }
	        leftColumn.push.apply(leftColumn, rightColumn);
	        leftColumn.push.apply(leftColumn, topRow);
	        leftColumn.push.apply(leftColumn, bottomRow);
	        return leftColumn;
	    };
	    CreepingDarkness.prototype.row = function (tiles, iRow, type, size, repel) {
	        var row = [];
	        var i = 0;
	        var end = tiles.length;
	        if (repel) {
	            i = (tiles.length / 2) - (size + 1);
	            end = (tiles.length / 2) + (size + 1);
	        }
	        for (; i < end; i++) {
	            if (repel) {
	                if (tiles[i][iRow].tileTextureType == type) {
	                    row.push(tiles[i][iRow]);
	                }
	            }
	            else {
	                if (tiles[i][iRow].tileTextureType != type) {
	                    row.push(tiles[i][iRow]);
	                }
	            }
	        }
	        return row;
	    };
	    CreepingDarkness.prototype.column = function (tiles, type, size, repel) {
	        var column = [];
	        var i = 0;
	        var end = tiles.length;
	        if (repel) {
	            i = (tiles.length / 2) - size;
	            end = (tiles.length / 2) + size;
	            i = i < 0 ? 0 : i;
	            if (end > tiles.length - 1) {
	                end = tiles.length - 1;
	            }
	        }
	        for (; i < end; i++) {
	            if (repel) {
	                if (tiles[i].tileTextureType == type) {
	                    column.push(tiles[i]);
	                }
	            }
	            else {
	                if (tiles[i].tileTextureType != type) {
	                    column.push(tiles[i]);
	                }
	            }
	        }
	        return column;
	    };
	    return CreepingDarkness;
	}());
	exports.CreepingDarkness = CreepingDarkness;


/***/ }

});
//# sourceMappingURL=app.js.map