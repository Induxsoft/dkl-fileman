
var fileman={

	dropArea : null,
	button : null,
	input : null,
	file : null,
	cookieData:null,
	selectedFiles:[],
	codeExts:null,
	files:null,
	
	onClickCopy:function()
	{
		var clipboard={
			type:"clipboard",
			data:{
				files:fileman.selectedFiles,
				action:"copy",
				path:fileman.folderPath
			}
		};

		this.setCookieData(clipboard);
	},
	onClickCut: function(){
		var clipboard={
			type:"clipboard",
			data:{
				files:fileman.selectedFiles,
				action:"move",
				path:fileman.folderPath
			}
		};

		this.setCookieData(clipboard);
	},
	onClickDelete:function(){
		if (fileman.selectedFiles.length===0){
			alert("No ha seleccionado ningún archivo");
			return;
		}
		if(!confirm("¿Está seguro que desea eliminar los archivos seleccionados?"))
			return;

		var rq={};
		for(const er of fileman.selectedFiles)
		{
			rq[er]={ action:"delete"};
		}

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se ha podido eliminar.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},
	onClickPaste:function(){

		if(fileman.cookieData==null){
			alert("No hay archivos en el portapapeles.");
			return;
		}
		if(fileman.cookieData.data.path == fileman.folderPath)
		{
			alert("No es posible pegar el archivo en el mismo directorio.");
			return;
		}
		var rq={};
		for(const er of fileman.cookieData.data.files)
		{
			rq[er]={
				action:fileman.cookieData.data.action,
				to:fileman.folderPath
			};
		}
		fileman.invoqueCopy(rq,fileman.cookieData.data.path, function(data){
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se pudo pegar.\n" + data[r].message);
			}
			fileman.setCookieData(null);

		},function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},
	invoqueCopy:function(data, fromPath, callback_success, callback_fail)
	{
		fileman.waiting();
		$.ajax({
			type: "POST",
			url: fromPath+"do.fso",
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(r){
				var res = JSON.parse(JSON.stringify(r));
				if (res.success)
				{
					if (callback_success)
						callback_success(res.data);
				}
				else
				{
					if (callback_fail)
						callback_fail(res.message);
				}
			},
			error: function(r){
				alert("Ocurrió un error al invocar el servicio.\n\r"+r.statusText);
			}
		}).always(function(){
			location.reload();
		});
	},
	setCookieData:function(data,success){
		$.ajax({
			type: "POST",
			url: fileman.currentURL,
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(r){
				fileman.cookieData=r;
				if (success)
					success(r);
			},
			error: function(r){
				alert("Ocurrió un error al invocar el servicio.\n\r"+r.statusText);
			}
		});
	},
	addSelectedFile:function(fn)
	{
		fileman.selectedFiles.push(fn);
	},
	delSelectedFile:function(fn)
	{
		fileman.selectedFiles=fileman.selectedFiles.filter(e => e !== fn);
	},
	load_drag : function(){

		fileman.dropArea = document.querySelector(".fileman-viewfolder");
		fileman.button = document.querySelector(".upload_file");
		fileman.input = document.querySelector("#input_file");
		fileman.input_folder = document.querySelector("#input_folder");
		fileman.input_zip = document.querySelector("#input_file_zip");
		fileman.input_websencia = document.querySelector("#input_file_websencia");
		fileman.up_file = document.querySelector("#up_file");
		fileman.up_options = document.querySelector("#upload_options");

		if(fileman.up_file)fileman.up_file.addEventListener('click', () => {
			fileman.up_options.classList.toggle("upload_options_show");
		});
		if(fileman.up_options)fileman.up_options.childNodes.forEach(c => {
			c.addEventListener('click', () => fileman.up_options.classList.remove("upload_options_show"));
		});

		//Encima del control
		fileman.dropArea.addEventListener('dragover', e =>{
			e.preventDefault();
			fileman.dropArea.classList.add('drop_active');
		});
		//Cuando deja el control
		fileman.dropArea.addEventListener('dragleave', e =>{
			e.preventDefault();
			fileman.dropArea.classList.remove('drop_active');
		});
		//Cuando suelta el elemento en el control
		try{
			fileman.dropArea.addEventListener('drop', async b => {
				
				fileman.input.files = b.dataTransfer.files;
				const promise = fileHandler.getFiles(b);
				var formData = new FormData();
				
				b.preventDefault();
				b.stopPropagation();
				
				if(promise) await promise.then( v => {
					
					v.forEach( f => {
						
						let exist=(fileman.files && fileman.files.some(fe => fe.name==f.name));
						
						if (exist && !confirm(`El archivo ${f.name} ya existe en el directorio actual. ¿Desea reemplazarlo?`)){
							//ignore
						}else{
							
							var nf = new File([f.fileObject], f.name, {type:f.type});
							formData.append(f.fullPath, nf, f.name);
						}
					});
				});

				if (Array.from(formData.keys()).length < 1){

					alert("Debe seleccionar al menos un archivo.");
					fileman.dropArea.classList.remove('drop_active');
					return;
				}
				
				fileman.invoqueUpFiles(formData, function(data)
				{
					let res = Object.keys(data);
		
					for(var i=0; i<res.length; i++){
						let r = res[i];
		
						if(!data[r].done)
							alert(r + " no se pudo subir.\n" + data[r].message);
					}
				},
				function(message){
					alert("Ha ocurrido un error al realizar la operación\n\r"+message);
				});
	
				fileman.dropArea.classList.remove('drop_active');
			});
		}catch(error){
			alert("No fué posible subir el archivo.");
		}
		finally{
			fileman.dropArea.classList.remove('drop_active');
		}

		fileman.input.addEventListener('change', e => {
			
			let files = fileman.input.files;

			if(files.length < 1){
				alert("Debe seleccionar al menos un archivo.");
				return;
			}

			fileman.invoqueUpFiles(new FormData(document.getElementById("formData")), function(data)
			{
				let res = Object.keys(data);
	
				for(var i=0; i<res.length; i++){
					let r = res[i];
	
					if(!data[r].done)
						alert(r + " no se pudo subir.\n" + data[r].message);
				}
			},
			function(message){
				alert("Ha ocurrido un error al realizar la operación\n\r"+message);
			});
		});
		fileman.input_zip.addEventListener('change', e => {
			let files = fileman.input_zip.files;
			
			if(files.length < 1){
				alert("Debe seleccionar al menos un archivo.");
				return;
			}
			if(files.length > 1){
				alert("Debe selecionar solo un archivo.");
				return;
			}

			var fd = new FormData();
			var f = files.item(0);

			var nf = new File([f], f.name, {type:f.type})
			fd.append(f.name+"*", nf, f.name);

			fileman.invoqueUpFiles(fd, function(data)
			{
				let res = Object.keys(data);
				let r = res[0];
				if(!data[r].done) alert(r + " no se pudo subir.\n" + data[r].message);
			},
			function(message){
				alert("Ha ocurrido un error al subir el archivo.\n\r"+message);
			});
		});
		fileman.input_websencia.addEventListener('change', e => {
			let files = fileman.input_websencia.files;
			
			if(files.length < 1){
				alert("Debe seleccionar al menos un archivo.");
				return;
			}
			if(files.length > 1){
				alert("Debe selecionar solo un archivo.");
				return;
			}

			var fd = new FormData();
			var f = files.item(0);

			var nf = new File([f], f.name, {type:f.type})
			fd.append(f.name+(fileman.renderWebsencia?"*":""), nf, f.name);

			fileman.invoqueUpFiles(fd, function(data)
			{
				let res = Object.keys(data);
				let r = res[0];
				if(!data[r].done) alert(r + " no se pudo subir.\n" + data[r].message);
			},
			function(message){
				alert("Ha ocurrido un error al subir el archivo.\n\r"+message);
			});
		});
		fileman.input_folder.addEventListener('change', e => {
			
			let files = fileman.input_folder.files;
			
			if(files.length < 1){
				alert("Debe seleccionar al menos una carpeta que contenga archivos.");
				return;
			}

			var fd = new FormData();

			for(let i=0; i<files.length; i++)
			{
				var f = files.item(i);
				var nf = new File([f], f.name, {type:f.type})
				
				fd.append(f.webkitRelativePath, nf, f.name);
			}
			
			fileman.invoqueUpFiles(fd, function(data)
			{
				let res = Object.keys(data);
	
				for(var i=0; i<res.length; i++){
					let r = res[i];
	
					if(!data[r].done)
						alert(r + " no se pudo subir.\n" + data[r].message);
				}
			},
			function(message){
				alert("Ha ocurrido un error al realizar la operación\n\r"+message);
			});
		});
	},

	search:function(view){

		let search = document.querySelector("#input_search");

		if (search.value.trim()=='') return
		
		url=window.location.href;
		let p = url.includes("?") ? '&' : '?';
		url += p+"search="+search.value.trim()+"&view="+view;

		window.location.href=url;
	},

	upl_file:function(){
		fileman.input.click();
	},
	upl_file_zip:function(){
		fileman.input_zip.click();
	},
	upl_file_websencia:function(){
		fileman.input_websencia.click();
	},
	upl_folder:function(){
		fileman.input_folder.click();	
	},

	do_delete: function (file)
	{
		if (!confirm("¿Está seguro de eliminar el archivo?")) return;

		var rq={};
		rq[file]={ action:"delete" };

		fileman.invoque(rq, function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se ha podido eliminar.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},

	do_mkdir: function ()
	{
		var fname=prompt("Ingresa el nombre de la carpeta:");

		if (!fname) return;
		if(fname.includes("/") || fname.includes("\\") || fname.includes(":") || fname.includes("*") || fname.includes("?") || fname.includes("\"") || fname.includes("<") || fname.includes(">") || fname.includes("|")){
			alert("El nombre no debe contener:\n / \\ : * ? \" < > |");
			return;
		}
		var rq={};
		rq["."]={ action:"mkdir", path:fname };

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				
				let r = res[i];

				if(!data[r].done) alert(fname + " no se ha podido crear.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},

	do_rename: function (file)
	{
		var nname=prompt("Ingresa el nuevo nombre:",file);

		if (!nname) return;
		if(nname.trim().length==0){
			alert("El nombre no debe ir vacío.");
			return;
		}

		var rq={};
		rq[file]={ action:"rename", as:nname };

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				
				let r = res[i];

				if(!data[r].done) alert(r + " no se ha podido renombrar.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},
	set_file : function(){

		var fname=prompt("Ingresa el nombre del archivo:");
		if (!fname) return;
		
		if(fname.includes("/") || fname.includes("\\") || fname.includes(":") || fname.includes("*") || fname.includes("?") || fname.includes("\"") || fname.includes("<") || fname.includes(">") || fname.includes("|")){
			alert("El nombre no debe contener:\n / \\ : * ? \" < > |");
			return;
		}
		var rq={};
		rq[fname]={ text:"" };

		fileman.invoque_set_file(rq,function(data)
		{
			let res = Object.keys(data);
			let fileExt = "."+res[0].split('.').pop();

			let r = res[0];
			if(!data[r].txt_done)
				alert(fname + " no se ha podido crear.\n" + data[r].message);
			else
				if(fileman.codeExts[fileExt.toLocaleLowerCase()])
					window.location.href = fileman.folderPath+res[0]+fileman.codeExts[fileExt.toLocaleLowerCase()];
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
		location.reload();
	},
	invoque: function (params,callback_success, callback_fail)
	{
		fileman.waiting();
		$.ajax({
			type: "POST",
			url: fileman.folderPath+"do.fso",
			data: JSON.stringify(params),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(r){
				var res = JSON.parse(JSON.stringify(r));
				if (res.success)
				{
					if (callback_success)
						callback_success(res.data);
				}
				else
				{
					if (callback_fail)
						callback_fail(res.message);
				}
			},
			error: function(r){
				alert("Ocurrió un error al invocar el servicio.\n\r"+r.statusText);
			}

		}).always(function(){
			location.reload();
		});
	},

	invoqueUpFiles: function (formData,callback_success, callback_fail)
	{
		fileman.waiting();
		$.ajax({
			type: "POST",
			url: fileman.folderPath+"upl.fso",
			data: formData,
			cache:false,
			contentType: false,
			processData: false,  // tell jQuery not to process the data
  		
			success: function(r){
				
				var res = JSON.parse(JSON.stringify(r));
				if (res.success)
				{
					if (callback_success)
						callback_success(res.data);
				}
				else
				{
					if (callback_fail)
						callback_fail(res.message);
				}
			},
			error: function(r){
				alert("Ocurrió un error al invocar el servicio.\n\r"+r.statusText);
			}

		}).always(function(){
			location.reload();
		});
	},
	invoque_set_file: function (params,callback_success, callback_fail)
	{
		$.ajax({
			type: "POST",
			url: fileman.folderPath+"set.fso",
			data: JSON.stringify(params),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(r){
				
				var res = JSON.parse(JSON.stringify(r));
				if (res.success)
				{
					if (callback_success)
						callback_success(res.data);
				}
				else
				{
					if (callback_fail)
						callback_fail(res.message);
				}
			},
			error: function(r){
				alert("Ocurrió un error al invocar el servicio.\n\r"+r.statusText);
			}
		});
	},
	checkboxFile:function(cb,fn)
	{
		if($(cb).prop("checked")){
			fileman.addSelectedFile(fn);
		}
		else{
			fileman.delSelectedFile(fn);
		}
		$(document).ready(function(){
			if(fileman.selectedFiles.length<1){
				$("div.tool_bar_copy").css("pointer-events","none");
				$("div.tool_bar_cut").css("pointer-events","none");
				$("div.tool_bar_delete").css("pointer-events","none");
			}else{
				$(".tool_bar_copy").css("pointer-events","auto");
				$(".tool_bar_cut").css("pointer-events","auto");
				$(".tool_bar_delete").css("pointer-events","auto");
			}
		});
	},
	waiting:function(){
		let processing = document.querySelector("#processing");
		processing.classList.add("processing_show");
		document.oncontextmenu = new Function("return false");
	},
	hidde_waiting:function(){
		let processing = document.querySelector("#processing");
		processing.classList.remove("processing_show");
		document.oncontextmenu = new Function("return true");
	}
};

function myJQueryCode() {

    $(document).ready(() => {
		
		fileman.load_drag();
        $(".privileges_select").val("");
        $("#modal_con_select").val("");
        $("#modal_id_select").val("");
	});
}

if(typeof jQuery=='undefined') {

    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqTag.onload = myJQueryCode;
    headTag.appendChild(jqTag);
} else {
     myJQueryCode();
}