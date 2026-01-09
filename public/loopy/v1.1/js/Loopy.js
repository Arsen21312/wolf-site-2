/**********************************

LOOPY!
- with edit & play mode

**********************************/

Loopy.MODE_EDIT = 0;
Loopy.MODE_PLAY = 1;

Loopy.TOOL_INK = 0;
Loopy.TOOL_DRAG = 1;
Loopy.TOOL_ERASE = 2;
Loopy.TOOL_LABEL = 3;

function Loopy(config){

	var self = this;
	self.config = config;

	// Loopy: EMBED???
	self.embedded = _getParameterByName("embed");
	self.embedded = !!parseInt(self.embedded); // force to Boolean

	// Offset & Scale?!?!
	self.offsetX = 0;
	self.offsetY = 0;
	self.offsetScale = 1;

	// Mouse
	Mouse.init(document.getElementById("canvasses")); // TODO: ugly fix, ew

	// Pan & zoom helpers
	var clamp = function(value, min, max){
		return Math.max(min, Math.min(max, value));
	};
	var getBaseTransform = function(scale){
		var canvasses = document.getElementById("canvasses");
		var CW = canvasses.clientWidth - _PADDING - _PADDING;
		var CH = canvasses.clientHeight - _PADDING_BOTTOM - _PADDING;
		var s = 1/scale;
		var tx = 0;
		var ty = 0;
		if(self.embedded){
			tx -= _PADDING/2;
			ty -= _PADDING/2;
		}
		tx -= (CW+_PADDING)/2;
		ty -= (CH+_PADDING)/2;
		tx = s*tx;
		ty = s*ty;
		tx += (CW+_PADDING)/2;
		ty += (CH+_PADDING)/2;
		return { s: s, tx: tx, ty: ty };
	};

	// Zoom with mouse wheel
	var canvasses = document.getElementById("canvasses");
	canvasses.addEventListener("wheel", function(event){
		if(self.modal && self.modal.isShowing) return;
		event.preventDefault();

		var rect = canvasses.getBoundingClientRect();
		var sx = event.clientX - rect.left;
		var sy = event.clientY - rect.top;
		var before = getBaseTransform(self.offsetScale);
		var worldX = sx*before.s + before.tx - self.offsetX;
		var worldY = sy*before.s + before.ty - self.offsetY;

		var factor = event.deltaY > 0 ? 0.9 : 1.1;
		var nextScale = clamp(self.offsetScale * factor, 0.35, 2.5);
		var after = getBaseTransform(nextScale);

		self.offsetScale = nextScale;
		self.offsetX = sx*after.s + after.tx - worldX;
		self.offsetY = sy*after.s + after.ty - worldY;
		publish("resize");
	}, { passive: false });
	
	// Model
	self.model = new Model(self);

	// Loopy: SPEED!
	self.signalSpeed = 3;

	// Sidebar
	self.sidebar = new Sidebar(self);
	self.sidebar.showPage("Edit"); // start here

	// Play/Edit mode
	self.mode = Loopy.MODE_EDIT;

	// Tools
	self.toolbar = new Toolbar(self);
	self.tool = Loopy.TOOL_INK;
	self.ink = new Ink(self);
	self.drag = new Dragger(self);
	self.erase = new Eraser(self);
	self.label = new Labeller(self);

	// Play Controls
	self.playbar = new PlayControls(self);
	self.playbar.showPage("Editor"); // start here

	// Modal
	self.modal = new Modal(self);

	// External control (help/examples/save)
	window.addEventListener("message", function(event){
		if(event.origin && event.origin !== window.location.origin) return;
		var payload = event.data || {};
		if(payload.type === "loopy-load-example"){
			if(!payload.data) return;
			try{
				var dataString = payload.data;
				if(typeof dataString !== "string") dataString = JSON.stringify(dataString);
				self.model.deserialize(dataString);
				self.setMode(Loopy.MODE_EDIT);
				self.model.center(true);
				publish("resize");
			}catch(e){}
		}
		if(payload.type === "loopy-save"){
			publish("modal",["save_link"]);
		}
		if(payload.type === "loopy-export"){
			publish("export/file");
		}
		if(payload.type === "loopy-open-howto"){
			publish("modal",["howto"]);
		}
		if(payload.type === "loopy-open-examples"){
			publish("modal",["examples"]);
		}
		if(payload.type === "loopy-open-credits"){
			publish("modal",["credits"]);
		}
	});

	//////////
	// INIT //
	//////////

	self.init = function(){
		self.loadFromURL(); // try it.
	};

	///////////////////
	// UPDATE & DRAW //
	///////////////////

	// Update
	self.update = function(){
		Mouse.update();
		if(self.wobbleControls>=0) self.wobbleControls--; // wobble
		if(!self.modal.isShowing){ // modAl
			self.model.update(); // modEl
		}
	};
	setInterval(self.update, 1000/30); // 30 FPS, why not.

	// Draw
	self.draw = function(){
		if(!self.modal.isShowing){ // modAl
			self.model.draw(); // modEl
		}
		requestAnimationFrame(self.draw);
	};

	// TODO: Smarter drawing of Ink, Edges, and Nodes
	// (only Nodes need redrawing often. And only in PLAY mode.)

	//////////////////////
	// PLAY & EDIT MODE //
	//////////////////////

	self.showPlayTutorial = false;
	self.wobbleControls = -1;
	self.setMode = function(mode){

		self.mode = mode;
		publish("loopy/mode");

		// Play mode!
		if(mode==Loopy.MODE_PLAY){
			self.showPlayTutorial = true; // show once!
			if(!self.embedded) self.wobbleControls=45; // only if NOT embedded
			self.sidebar.showPage("Edit");
			self.playbar.showPage("Player");
			self.sidebar.dom.setAttribute("mode","play");
			self.toolbar.dom.setAttribute("mode","play");
			document.getElementById("canvasses").removeAttribute("cursor"); // TODO: EVENT BASED
		}else{
			publish("model/reset");
		}

		// Edit mode!
		if(mode==Loopy.MODE_EDIT){
			self.showPlayTutorial = false; // donezo
			self.wobbleControls = -1; // donezo
			self.sidebar.showPage("Edit");
			self.playbar.showPage("Editor");
			self.sidebar.dom.setAttribute("mode","edit");
			self.toolbar.dom.setAttribute("mode","edit");
			document.getElementById("canvasses").setAttribute("cursor", self.toolbar.currentTool); // TODO: EVENT BASED
		}

	};

	/////////////////
	// SAVE & LOAD //
	/////////////////

	self.dirty = false;

	// YOU'RE A DIRTY BOY
	subscribe("model/changed", function(){
		if(!self.embedded) self.dirty = true;
	});

	subscribe("export/file", function(){
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + self.model.serialize());
		element.setAttribute('download', "system_model.loopy");

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	});

	subscribe("import/file", function(){
		let input = document.createElement('input');
		input.type = 'file';
		input.onchange = e => {
			var file = e.target.files[0];
			var reader = new FileReader();
			reader.readAsText(file,'UTF-8');
			reader.onload = readerEvent => {
				var content = readerEvent.target.result;
				self.model.deserialize(content);
			}
		};
		input.click();
	});

	self.saveToURL = function(embed){

		// Create link
		var dataString = self.model.serialize();
		var uri = dataString; // encodeURIComponent(dataString);
		var base = window.location.origin + window.location.pathname;
		var historyLink = base+"?data="+uri;
		var link;
		if(embed){
			link = base+"?embed=1&data="+uri;
		}else{
			link = historyLink;
		}

		// NO LONGER DIRTY!
		self.dirty = false;

		// PUSH TO HISTORY
		window.history.replaceState(null, null, historyLink);

		return link;
	};
	
	// "BLANK START" DATA:
	var _blankData = "[[[1, 360, 230, 0.6, %22%25D0%259F%25D1%2580%25D0%25B8%25D1%2587%25D0%25B8%25D0%25BD%25D0%25B0%22, 2], [2, 540, 360, 0.6, %22%25D0%25A1%25D0%25BB%25D0%25B5%25D0%25B4%25D1%2581%25D1%2582%25D0%25B2%25D0%25B8%25D0%25B5%22, 4]], [[1, 2, 120, 1], [2, 1, -120, -1]], [[360, 120, %22%25D0%259F%25D0%25B5%25D1%2582%25D0%25BB%25D0%25B8%2520%25D1%2581%25D1%2582%25D0%25B0%25D0%25B8%2520%25E2%2580%2594%2520%25D1%2581%25D0%25B8%25D0%25BC%25D1%2583%25D0%25BB%25D1%258F%25D1%2582%25D0%25BE%25D1%2580%2520%25D0%25BF%25D1%2580%25D0%25B8%25D1%2587%25D0%25B8%25D0%25BD%2520%25D0%25B8%2520%25D1%2581%25D0%25BB%25D0%25B5%25D0%25B4%25D1%2581%25D1%2582%25D0%25B2%25D0%25B8%25D0%25B9%2520%25D0%25BF%25D0%25BE%2520%25D0%25B2%25D0%25BE%25D0%25BB%25D1%2587%25D1%258C%25D0%25B8.%250A%25D0%259D%25D0%25B0%25D1%2580%25D0%25B8%25D1%2581%25D1%2583%25D0%25B9%25D1%2582%25D0%25B5%2520%25D1%2583%25D0%25B7%25D0%25BB%25D1%258B%2520%25D0%25B8%2520%25D1%2581%25D0%25B2%25D1%258F%25D0%25B7%25D0%25B8%252C%2520%25D0%25B7%25D0%25B0%25D1%2582%25D0%25B5%25D0%25BC%2520%25D0%25BD%25D0%25B0%25D0%25B6%25D0%25BC%25D0%25B8%25D1%2582%25D0%25B5%2520%25C2%25AB%25D0%2597%25D0%25B0%25D0%25BF%25D1%2583%25D1%2581%25D0%25BA%25C2%25BB.%250A%25D0%25A1%25D0%25BF%25D1%2580%25D0%25B0%25D0%25B2%25D0%25BA%25D0%25B0%2520%25D0%25B8%2520%25D0%25BF%25D1%2580%25D0%25B8%25D0%25BC%25D0%25B5%25D1%2580%25D1%258B%2520%25D0%25B4%25D0%25BE%25D1%2581%25D1%2582%25D1%2583%25D0%25BF%25D0%25BD%25D1%258B%2520%25D0%25B2%2520%25D0%25B2%25D0%25B5%25D1%2580%25D1%2585%25D0%25BD%25D0%25B5%25D0%25B9%2520%25D0%25BF%25D0%25B0%25D0%25BD%25D0%25B5%25D0%25BB%25D0%25B8.%22]], 3%5D";

	self.loadFromURL = function(){
		var data = _getParameterByName("data");
		if(!data) data=decodeURIComponent(_blankData);
		self.model.deserialize(data);
	}; 


	///////////////////////////
	//////// EMBEDDED? ////////
	///////////////////////////

	self.init();

	if(self.embedded){

		// Hide all that UI
		self.toolbar.dom.style.display = "none";
		self.sidebar.dom.style.display = "none";

		// If *NO UI AT ALL*
		var noUI = !!parseInt(_getParameterByName("no_ui")); // force to Boolean
		if(noUI){
			_PADDING_BOTTOM = _PADDING;
			self.playbar.dom.style.display = "none";
		}

		// Fullscreen canvas
		document.getElementById("canvasses").setAttribute("fullscreen","yes");
		self.playbar.dom.setAttribute("fullscreen","yes");
		publish("resize");

		// Center & SCALE The Model
		self.model.center(true);
		subscribe("resize",function(){
			self.model.center(true);
		});

		// Autoplay!
		self.setMode(Loopy.MODE_PLAY);

		// Also, HACK: auto signal
		var signal = _getParameterByName("signal");
		if(signal){
			signal = JSON.parse(signal);
			var node = self.model.getNode(signal[0]);
			node.takeSignal({
				delta: signal[1]*0.33
			});
		}

	}else{

		// Center all the nodes & labels

		// If no nodes & no labels, forget it.
		if(self.model.nodes.length>0 || self.model.labels.length>0){

			// Get bounds of ALL objects...
			var bounds = self.model.getBounds();
			var left = bounds.left;
			var top = bounds.top;
			var right = bounds.right;
			var bottom = bounds.bottom;

			// Re-center!
			var canvasses = document.getElementById("canvasses");
			var cx = (left+right)/2;
			var cy = (top+bottom)/2;
			var offsetX = (canvasses.clientWidth+50)/2 - cx;
			var offsetY = (canvasses.clientHeight-80)/2 - cy;

			// MOVE ALL NODES
			for(var i=0;i<self.model.nodes.length;i++){
				var node = self.model.nodes[i];
				node.x += offsetX;
				node.y += offsetY;
			}

			// MOVE ALL LABELS
			for(var i=0;i<self.model.labels.length;i++){
				var label = self.model.labels[i];
				label.x += offsetX;
				label.y += offsetY;
			}

		}

	}

	// NOT DIRTY, THANKS
	self.dirty = false;

	// SHOW ME, THANKS
	document.body.style.opacity = "";

	// GO.
	requestAnimationFrame(self.draw);


}
