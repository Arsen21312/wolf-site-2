/***********************

Use the same PAGE UI thing

************************/

function Modal(loopy){

	var self = this;
	self.loopy = loopy;
	PageUI.call(self, document.getElementById("modal_page"));

	// Is showing?
	self.isShowing = false;

	// show/hide
	self.show = function(){
		document.getElementById("modal_container").setAttribute("show","yes");
		self.isShowing = true;
	};
	self.hide = function(){
		document.getElementById("modal_container").setAttribute("show","no");
		if(self.currentPage.onhide) self.currentPage.onhide();
		self.isShowing = false;
	};

	// Close button
	document.getElementById("modal_bg").onclick = self.hide;
	document.getElementById("modal_close").onclick = self.hide;

	// Show... what page?
	subscribe("modal", function(pageName){

		self.show();
		var page = self.showPage(pageName);
		if(!page) return;

		// Do something
		if(page.onshow) page.onshow();

		// Dimensions
		var dom = document.getElementById("modal");
		dom.style.width = self.currentPage.width+"px";
		dom.style.height = self.currentPage.height+"px";

	});

	///////////////////
	// PAGES! /////////
	///////////////////

	// Save as link
	(function(){
		var page = new Page();
		page.width = 500;
		page.height = 155;
		page.addComponent(new ComponentHTML({
			html: "Скопируйте ссылку на модель:"
		}));
		var output = page.addComponent(new ComponentOutput({}));

		var label = document.createElement("div");
		label.style.textAlign = "right";
		label.style.fontSize = "15px";
		label.style.marginTop = "6px";
		label.style.color = "#9fb2d8";
		label.innerHTML = "(Если ссылка слишком длинная, сохраните модель как файл.)";
		page.dom.appendChild(label);

		// chars left...
		var chars = document.createElement("div");
		chars.style.textAlign = "right";
		chars.style.fontSize = "15px";
		chars.style.marginTop = "3px";
		chars.style.color = "#9fb2d8";
		chars.innerHTML = "X из 2048 символов";
		page.dom.appendChild(chars);

		page.onshow = function(){

			// Copy-able link
			var link = loopy.saveToURL();
			output.output(link);
			output.dom.select();

			// Chars left
			var html = link.length+" / 2048 символов";
			if(link.length>2048){
				html += " - может быть слишком длинной для браузеров";
			}
			chars.innerHTML = html;
			chars.style.fontWeight = (link.length>2048) ? "bold" : "100";
			chars.style.fontSize = (link.length>2048) ? "14px" : "15px";

		};

		// or, tweet it
		self.addPage("save_link", page);
	})();

	// Credits
	(function(){
		var page = new Page();
		page.width = 520;
		page.height = 200;
		page.addComponent(new ComponentHTML({
			html: "Основа: <a href='https://ncase.me/loopy/' target='_blank' rel='noopener'>Loopy (Nicky Case)</a>. Переработано <a href='https://neuralwisewolf.com/' target='_blank' rel='noopener'>NeuralWiseWolf</a>."
		}));
		self.addPage("credits", page);
	})();

	// How to
	(function(){
		var page = new Page();
		page.width = 700;
		page.height = 560;
		page.addComponent(new ModalIframe({
			page: page,
			width: 700,
			height: 560,
			src: "pages/howto.html"
		}));
		self.addPage("howto", page);
	})();

	// Examples
	(function(){
		var page = new Page();
		page.width = 700;
		page.height = 560;
		page.addComponent(new ModalIframe({
			page: page,
			width: 700,
			height: 560,
			src: "pages/examples/index.html"
		}));
		self.addPage("examples", page);
	})();

	// Embed info
	(function(){
		var page = new Page();
		page.width = 1020;
		page.height = 520;

		var wrap = document.createElement("div");
		wrap.style.display = "flex";
		wrap.style.gap = "16px";
		wrap.style.alignItems = "stretch";
		wrap.style.height = "100%";

		var left = document.createElement("div");
		left.style.width = "300px";
		left.style.display = "flex";
		left.style.flexDirection = "column";
		left.style.fontSize = "15px";
		left.style.color = "#9fb2d8";

		var title = document.createElement("div");
		title.style.fontWeight = "700";
		title.style.fontSize = "18px";
		title.style.color = "#e9ecf5";
		title.style.marginBottom = "10px";
		title.textContent = "Встроить на сайт";
		left.appendChild(title);

		var note = document.createElement("div");
		note.style.marginBottom = "12px";
		note.textContent = "Выберите размер встроенного блока и скопируйте HTML-код.";
		left.appendChild(note);

		var sizeRow = document.createElement("div");
		sizeRow.style.display = "flex";
		sizeRow.style.gap = "8px";
		sizeRow.style.alignItems = "center";
		sizeRow.style.marginBottom = "12px";

		var widthInput = document.createElement("input");
		widthInput.type = "number";
		widthInput.min = "320";
		widthInput.value = "600";
		widthInput.style.width = "90px";
		widthInput.style.padding = "6px 8px";
		widthInput.style.borderRadius = "8px";
		widthInput.style.border = "1px solid rgba(255,255,255,0.15)";
		widthInput.style.background = "#0b1021";
		widthInput.style.color = "#e9ecf5";

		var heightInput = document.createElement("input");
		heightInput.type = "number";
		heightInput.min = "240";
		heightInput.value = "420";
		heightInput.style.width = "90px";
		heightInput.style.padding = "6px 8px";
		heightInput.style.borderRadius = "8px";
		heightInput.style.border = "1px solid rgba(255,255,255,0.15)";
		heightInput.style.background = "#0b1021";
		heightInput.style.color = "#e9ecf5";

		var sep = document.createElement("span");
		sep.textContent = "×";
		sep.style.color = "#9fb2d8";

		sizeRow.appendChild(widthInput);
		sizeRow.appendChild(sep);
		sizeRow.appendChild(heightInput);
		left.appendChild(sizeRow);

		var label = document.createElement("div");
		label.textContent = "HTML-код для вставки:";
		label.style.marginBottom = "6px";
		left.appendChild(label);

		var textarea = document.createElement("textarea");
		textarea.readOnly = true;
		textarea.style.width = "100%";
		textarea.style.height = "140px";
		textarea.style.resize = "none";
		textarea.style.borderRadius = "8px";
		textarea.style.padding = "8px";
		textarea.style.border = "1px solid rgba(255,255,255,0.12)";
		textarea.style.background = "#0b1021";
		textarea.style.color = "#e9ecf5";
		textarea.style.flex = "1 1 auto";
		left.appendChild(textarea);

		var right = document.createElement("div");
		right.style.flex = "1";
		right.style.height = "100%";
		right.style.background = "transparent";
		right.style.borderRadius = "12px";
		right.style.padding = "0";
		right.style.overflow = "hidden";
		right.style.border = "none";
		right.style.display = "flex";
		right.style.alignItems = "center";
		right.style.justifyContent = "center";
		right.style.position = "relative";

		var preview = document.createElement("iframe");
		preview.style.width = "600px";
		preview.style.height = "420px";
		preview.style.border = "0";
		preview.style.display = "block";
		preview.style.borderRadius = "12px";
		preview.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.12)";
		preview.style.transformOrigin = "center center";
		preview.setAttribute("loading","lazy");
		right.appendChild(preview);

		wrap.appendChild(left);
		wrap.appendChild(right);
		page.dom.appendChild(wrap);

		var updateEmbed = function(){
			var w = parseInt(widthInput.value,10) || 600;
			var h = parseInt(heightInput.value,10) || 420;
			var link = loopy.saveToURL(true);
			preview.src = link;
			var scaleW = right.clientWidth / w;
			var scaleH = right.clientHeight / h;
			var scale = Math.min(scaleW, scaleH);
			if(!isFinite(scale) || scale <= 0){
				scale = 1;
			}
			preview.style.width = w + "px";
			preview.style.height = h + "px";
			preview.style.transform = "scale(" + Math.max(1, Math.min(1.5, scale)) + ")";
			preview.style.transformOrigin = "center center";
			preview.style.borderRadius = "12px";
			preview.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.12)";
			var code = "<iframe src=\\\"" + link + "\\\" width=\\\"" + w + "\\\" height=\\\"" + h + "\\\" style=\\\"border:0\\\" loading=\\\"lazy\\\"></iframe>";
			textarea.value = code;
		};

		widthInput.oninput = updateEmbed;
		heightInput.oninput = updateEmbed;
		page.onshow = updateEmbed;

		self.addPage("embed_info", page);
	})();

	// GIF info
	(function(){
		var page = new Page();
		page.width = 620;
		page.height = 460;
		page.addComponent(new ComponentHTML({
			html: ""+
				"<div style='font-weight:700; font-size:18px; margin-bottom:12px;'>Как сделать GIF</div>"+
				"<div style='font-size:16px; line-height:1.6; color:#9fb2d8;'>"+
				"<div><b>Шаг 1.</b> Установите программу для записи экрана (например, ScreenToGif на Windows или Kap на macOS).</div>"+
				"<div><b>Шаг 2.</b> Запустите запись и проиграйте модель в «Петлях стаи».</div>"+
				"<div><b>Шаг 3.</b> Сохраните файл в формате GIF.</div>"+
				"</div>"+
				"<div style='margin-top:16px; padding:12px; background:#0f172a; border-radius:10px; border:1px solid rgba(255,255,255,0.08);'>"+
				"<div style='color:#c9eeff; font-size:15px;'>Совет: подберите скорость и масштаб, чтобы анимация была читабельной.</div>"+
				"</div>"+
				"<div style='margin-top:14px; background:#0b1021; border-radius:12px; padding:10px; border:1px solid rgba(255,255,255,0.08);'>"+
				"<img src='pages/gif-preview.gif' alt='Пример GIF' style='display:block; width:100%; max-height:180px; object-fit:contain; border-radius:8px;'/>"+
				"</div>"
		}));
		self.addPage("gif_info", page);
	})();


}

function ModalIframe(config){

	var self = this;

	// IFRAME
	var iframe = document.createElement("iframe");
	self.dom = iframe;
	iframe.width = config.width;
	iframe.height = config.height;
	iframe.setAttribute("frameborder","0");
	iframe.style.border = "0";

	// Show & Hide
	if(!config.manual){
		config.page.onshow = function(){
			iframe.src = config.src;
		};
		config.page.onhide = function(){
			iframe.removeAttribute("src");
		};
	}

}
