
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
	onClickPaste:function(){

		// Validación de pegado
		// ...
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
			fileman.dropArea.addEventListener('drop', b => {
				b.preventDefault();
				
				fileman.input.files = b.dataTransfer.files;

				if (b.dataTransfer.files.length < 1){
					alert("Debe seleccionar al menos un archivo.");
					fileman.dropArea.classList.remove('drop_active');
					return;
				}

				let flag = false;
				//console.log(b.dataTransfer.files[0]);return;
				fileman.files.map(e=>{
					if (e.name == b.dataTransfer.files[0].name){
						if(!confirm("El archivo ya existe en el directorio. ¿Desea reemplazarlo?"))
						{
							fileman.dropArea.classList.remove('drop_active');
							flag=true;
						}
					}
				});
	
				if(flag) return;

				
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

		
	},

	upl_file:function(){
		fileman.input.click();	
	},

	do_delete: function (file)
	{
		if (!confirm("¿Está seguro de eliminar el archivo?")) return;

		var rq={};
		rq[file]={
				action:"delete"
		};

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
		rq["."]={
				action:"mkdir",
				path:fname
		};

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(fname + " no se ha podido crear.\n" + data[r].message);
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
			alert("El nombre no debe ir vacio.");
			return;
		}

		var rq={};
		rq[file]={
				action:"rename",
				as:nname
		};

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se ha podido renombrar.\n" + data[r].message);
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
		rq[fname]={
			text:""
		};

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
			}else{
				$(".tool_bar_copy").css("pointer-events","auto");
				$(".tool_bar_cut").css("pointer-events","auto");
			}
		});
	}
};

function myJQueryCode() {
    $(document).ready(() => {
		//
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