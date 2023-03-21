function myJQueryCode() {
    $(document).ready(() => {
		//
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

let mostrar = document.querySelector(".avanced");
let text_area = document.querySelector("#properties_code");
let select = document.querySelector(".privileges_select");
let properties_web_btn = document.querySelector(".properties_web");
let properties_web_modal = document.querySelector(".properties_web_modal");
let properties_web_modal_cancel = document.querySelector(".properties_web_modal_cancel");
let properties_web_modal_acept = document.querySelector(".properties_web_modal_acept");
let properties_availables = document.querySelector(".properties_web_modal .modal_content");
let all_item_prop = document.querySelectorAll(".item_prop");
let properties_web_modal_options = document.querySelector(".modal_header_controls_container");

let general_meta_title = document.querySelector("#general_meta_title");
let general_meta_description = document.querySelector("#general_meta_description");
let open_graph_meta_title = document.querySelector("#open_graph_meta_title");
let open_graph_meta_url = document.querySelector("#open_graph_meta_url");
let open_graph_meta_image = document.querySelector("#open_graph_meta_image");
let open_graph_meta_description = document.querySelector("#open_graph_meta_description");
let twitter_meta_title = document.querySelector("#twitter_meta_title");
let twitter_meta_url = document.querySelector("#twitter_meta_url");
let twitter_meta_image = document.querySelector("#twitter_meta_image");
let twitter_meta_description = document.querySelector("#twitter_meta_description");


let aply_code_btn = document.querySelector(".aply_code");
let cancel_code_btn = document.querySelector(".cancel_code");

let aply_btn = document.querySelector(".aply");
let modify_btn = document.querySelector(".modify");
let cancel_btn = document.querySelector(".cancel");

let add_priv = document.querySelector("#add_priv");
let remove_priv = document.querySelector("#remove_priv");
let add_priv_group = document.querySelector("#add_priv_group");

let remove_group_btn = document.querySelector(".remove_group");

let modal = document.querySelector(".add_privileges_group_modal");
let modal_cancel_btn = document.querySelector(".modal_cancel");
let modal_acept_btn = document.querySelector(".modal_acept");
let modal_con_select = document.querySelector("#modal_con_select");
let manual_con_input = document.querySelector("#manual_con_select");
let modal_id_select = document.querySelector("#modal_id_select");
let manual_id_input = document.querySelector("#manual_id_select");

var dataPriv = null;
//var dataPrivModified = resource_metadata.privileges;
var dataPrivModified = JSON.parse(JSON.stringify(resource_metadata.privileges));
var privilegeInfo = null;

var folder=folderPath.split("").reverse().join("").slice(-folderPath.indexOf(resource_metadata.name)).split("").reverse().join("");

properties_web_btn.addEventListener('click', e => {
    properties_web_btn.classList.add("hidde_control");
    all_item_prop.forEach(item=>{
        if(item.id != "general")
            item.style.display = "none";

        properties_web_modal_options.childNodes.forEach(i=>{
            i.style.backgroundColor = "transparent";
            i.style.color = "#888";
        });
        properties_web_modal_options.firstChild.style.backgroundColor = "#fff";
        properties_web_modal_options.firstChild.style.color = "#000";
    });
    if(!mostrar.classList.contains("hidde_control"))
        mostrar.classList.add("hidde_control");
    if(text_area.classList.contains("show_control"))
        text_area.classList.remove("show_control");
    
    properties_web_modal.classList.remove("hidde_control");

    if(!properties_web_modal.classList.contains("hidde_control"))
    {
        if (resource_metadata.properties)
        {
            if (resource_metadata.properties.web_meta_tags)
            {
                // General metatags
                if(resource_metadata.properties.web_meta_tags.title){$("#general_meta_title").val(resource_metadata.properties.web_meta_tags.title);}
                if(resource_metadata.properties.web_meta_tags.description){$("#general_meta_description").val(resource_metadata.properties.web_meta_tags.description);}
                if(resource_metadata.properties.web_meta_tags.keywords){$("#general_meta_key_words").val(resource_metadata.properties.web_meta_tags.keywords);}
                if(resource_metadata.properties.web_meta_tags.favicon){$("#general_meta_favicon").val(resource_metadata.properties.web_meta_tags.favicon);}
                if(resource_metadata.properties.web_meta_tags.favicon_mimetype){$("#general_meta_mime_favicon").val(resource_metadata.properties.web_meta_tags.favicon_mimetype);}

                if (resource_metadata.properties.web_meta_tags.og)
                {
                    // Open_graph metatags
                    if(resource_metadata.properties.web_meta_tags.og.url){$("#open_graph_meta_url").val(resource_metadata.properties.web_meta_tags.og.url);}
                    if(resource_metadata.properties.web_meta_tags.og.type){$("#open_graph_meta_type").val(resource_metadata.properties.web_meta_tags.og.type);}
                    if(resource_metadata.properties.web_meta_tags.og.title){$("#open_graph_meta_title").val(resource_metadata.properties.web_meta_tags.og.title);}
                    if(resource_metadata.properties.web_meta_tags.og.description){$("#open_graph_meta_description").val(resource_metadata.properties.web_meta_tags.og.description);}
                    if(resource_metadata.properties.web_meta_tags.og.image){$("#open_graph_meta_image").val(resource_metadata.properties.web_meta_tags.og.image);}
                }

                if (resource_metadata.properties.web_meta_tags.twitter)
                {
                    // Open_graph metatags
                    if(resource_metadata.properties.web_meta_tags.twitter.card){$("#twitter_meta_card").val(resource_metadata.properties.web_meta_tags.twitter.card);}
                    if(resource_metadata.properties.web_meta_tags.twitter.domain){$("#twitter_meta_domain").val(resource_metadata.properties.web_meta_tags.twitter.domain);}
                    if(resource_metadata.properties.web_meta_tags.twitter.url){$("#twitter_meta_url").val(resource_metadata.properties.web_meta_tags.twitter.url);}
                    if(resource_metadata.properties.web_meta_tags.twitter.title){$("#twitter_meta_title").val(resource_metadata.properties.web_meta_tags.twitter.title);}
                    if(resource_metadata.properties.web_meta_tags.twitter.description){$("#twitter_meta_description").val(resource_metadata.properties.web_meta_tags.twitter.description);}
                    if(resource_metadata.properties.web_meta_tags.twitter.image){$("#twitter_meta_image").val(resource_metadata.properties.web_meta_tags.twitter.image);}
                }
            }
        }
    }
});


let general_meta_title_before = "";
general_meta_title.addEventListener('focus', e=>{
    general_meta_title_before = general_meta_title.value;
});
general_meta_title.addEventListener('blur', e=>{
    if(open_graph_meta_title.value == general_meta_title_before || open_graph_meta_title.value=='') open_graph_meta_title.value = general_meta_title.value;
    if(twitter_meta_title.value == general_meta_title_before || twitter_meta_title.value=='') twitter_meta_title.value = general_meta_title.value;
});

let general_meta_description_before = "";
general_meta_description.addEventListener('focus', e=>{
    general_meta_description_before = general_meta_description.value;
});
general_meta_description.addEventListener('blur', e=>{
    if(open_graph_meta_description.value == general_meta_description_before || open_graph_meta_description.value=='') open_graph_meta_description.value = general_meta_description.value;
    if(twitter_meta_description.value == general_meta_description_before || twitter_meta_description.value=='') twitter_meta_description.value = general_meta_description.value;
});

let open_graph_meta_url_before = "";
open_graph_meta_url.addEventListener('focus', e=>{
    open_graph_meta_url_before = open_graph_meta_url.value;
});
open_graph_meta_url.addEventListener('blur', e=>{
    if(twitter_meta_url.value == open_graph_meta_url_before || twitter_meta_url.value=='') twitter_meta_url.value = open_graph_meta_url.value;
});

let open_graph_meta_image_before = "";
open_graph_meta_image.addEventListener('focus', e=>{
    open_graph_meta_image_before = open_graph_meta_image.value;
});
open_graph_meta_image.addEventListener('blur', e=>{
    if(twitter_meta_image.value == open_graph_meta_image_before || twitter_meta_image.value=='') twitter_meta_image.value = open_graph_meta_image.value;
});

let general_meta_favicon = document.querySelector("#general_meta_favicon");
let general_meta_mime_favicon = document.querySelector("#general_meta_mime_favicon");

general_meta_favicon.addEventListener('keyup', e=>{
    switch(general_meta_favicon.value.split('.').pop())
    {
        case "jpg" :
        case "jpeg" :
            general_meta_mime_favicon.value = "image/jpeg";
            break;
        case "ico" :
            general_meta_mime_favicon.value = "image/x-icon";
            break;
        case "png" :
            general_meta_mime_favicon.value = "image/png";
            break;
        case "gif" :
            general_meta_mime_favicon.value = "image/gif";
            break;
        case "svg" :
            general_meta_mime_favicon.value = "image/svg+xml";
            break;
    }
});

properties_web_modal_cancel.addEventListener('click', e=>{
    properties_web_btn.classList.remove("hidde_control");
    properties_web_modal.classList.add("hidde_control");
    mostrar.classList.remove("hidde_control");
});

properties_web_modal_acept.addEventListener('click', e=>{
    save_metadata();
});

mostrar.addEventListener('click', e=> {
    if(!properties_web_btn.classList.contains("hidde_control"))
        properties_web_btn.classList.add("hidde_control");
    if(!properties_web_modal.classList.contains("hidde_control"))
        properties_web_modal.classList.add("hidde_control")

    text_area.classList.add("show_control");
    mostrar.classList.add("hidde_control");

    aply_code_btn.classList.add("show_control");
    cancel_code_btn.classList.add("show_control");

    if (resource_metadata.properties)
    {
        $("#properties_code").val(JSON.stringify(resource_metadata.properties,null,2) );
    }
});

cancel_code_btn.addEventListener('click', e => {

    text_area.classList.remove("show_control");
    aply_code_btn.classList.remove("show_control");
    cancel_code_btn.classList.remove("show_control");
    mostrar.classList.remove("hidde_control");
    properties_web_btn.classList.remove("hidde_control");
});
text_area.addEventListener('keydown', e=>{
    if (e.key == "Tab")
        e.preventDefault();
});
modify_btn.addEventListener('click', e => {
    aply_btn.classList.add("show_control2");
    cancel_btn.classList.add("show_control2");
    modify_btn.classList.add("hidde_control");
    select.classList.remove("disableControl");
    add_priv.classList.remove("disableControl");
    remove_priv.classList.remove("disableControl");
    add_priv_group.classList.remove("disableControl");
    $(".remove_group").removeClass("disableControl");
});

cancel_btn.addEventListener('click', e => {
    aply_btn.classList.remove("show_control2");
    cancel_btn.classList.remove("show_control2");
    modify_btn.classList.remove("hidde_control");
    select.classList.add("disableControl");
    add_priv.classList.add("disableControl");
    remove_priv.classList.add("disableControl");
    add_priv_group.classList.add("disableControl");
    $(".remove_group").addClass("disableControl");

    dataPrivModified = JSON.parse(JSON.stringify(resource_metadata.privileges));
    $(".privileges_group").html(privilegesGroup(null));
    $(".privileges_information").html(privilegesInfo(null));
    $(".privileges_select").html(selectPrivileges(dataPrivModified));

    $(".privileges_select").val("");
    $("#modal_con_select").val("");
    $("#modal_id_select").val("");
    $("#manual_con_select").val("");
    $("#manual_id_select").val("");
});

aply_btn.addEventListener('click', e => {
    aply_privilege();
});

modal_con_select.addEventListener('change', e => {
    if(modal_con_select.value == "Escribir manualmente...")
        manual_con_input.style.zIndex = 0 + "";
    else
        manual_con_input.style.zIndex = -1 + "";

    manual_con_input.value = "";

    let ids=null;
    if(assignable_objects){
        ids = assignable_objects.filter(e => {
            if(modal_con_select.value.toString().toLowerCase() == e.type.toString().toLowerCase())
                return e;
        });
    }

    if(ids)
        $("#modal_id_select").html(idsData(ids));
});

modal_id_select.addEventListener('click', e => {
    if(modal_id_select.value == "Escribir manualmente...")
        manual_id_input.style.zIndex = 0 + "";
    else
        manual_id_input.style.zIndex = -1 + "";

    manual_id_input.value = "";
});


function idsData(data)
{
    let html = ``;
    for(const d of data){
        html += `
            <option value='${d.id}'>${d.caption}</option>
        `;
    }
    html += `<option>Escribir manualmente...</option>`;
    return html;
}


function privilegesInfo(data)
{
    if (!data) return ``;

    let html = ``;
    try {html = `<p class="privileges_description">${data.caption}</p>`;} catch (error) {html = ``;}
    try {html += `<p>${data.rem}</p>`;} catch (error) {html += ``;}

    return html;
}


function privilegesGroup(data)
{
    if(!data) return ``;

    let html = ``;

    for(let dat of data)
    {
        if (dat)
        {
            let user = Object.values(dat);
            if(assignable_objects)
                assignable_objects.filter(e => {
                    if (Object.values(dat) == e.id & Object.keys(dat) == e.type)
                        user = e.caption;
                });

            html += `
                <div class="group">
                    <img src="${fileman_basePath}/icons/${Object.keys(dat)}.icon.png" title="${Object.keys(dat)}" onerror="this.src='${fileman_basePath}/icons/concept.icon.png'"/>
                    <p>${user}</p>
                    <button class="remove_group" title="Eliminar" onclick="remove_concept_privilege('${Object.keys(dat)}','${Object.values(dat)}');"> - </button>
                </div>
            `;
        }
    }
    return html;
}


function selectPrivileges(data){
    if(!data) return ``;
    let html = ``;

    for (const priv of privileges_cat)
    {
        html += `
        <option>${priv.id}</option>
        `;
    }
    for (const newPriv in data)
    {
        let add = true;

        for (const priv of privileges_cat)
            if (priv.id == newPriv)
                add = false; 
        
        if(add) html += ` <option>${newPriv}</option>`;
    }
    return html;
}


select.addEventListener('change', e => {
    privilegeInfo = privileges_cat.filter(p => {
        if(e.target.value == p.id)
            return p;
    });

    $(".privileges_information").html(privilegesInfo(privilegeInfo[0]));
    
    dataPriv = resource_metadata.privileges[e.target.value];
    $(".privileges_group").html(privilegesGroup(dataPrivModified[e.target.value]));
});

aply_code_btn.addEventListener('click', e => {
    try { JSON.parse(text_area.value);} 
    catch (error) {
        alert("El formato es inválido.\n"+error.message);
        return;
    }
    set_metadata();
});

add_priv.addEventListener('click', e => {
    add_privilege();
});

remove_priv.addEventListener('click', e =>{
    remove_privilege();
});

add_priv_group.addEventListener('click', e => {
    if(select.value == "" || !select.value || select.value==null){
        alert("Debe selecionar un privilegio para acceder a esta función.");
        select.focus();
        return;
    }
    modal.classList.add("show_control");
    $('html, body').animate({scrollTop:0}, 'slow');
});

modal_cancel_btn.addEventListener('click', e => {
    modal.classList.remove("show_control");
});

modal_acept_btn.addEventListener('click', e => {
    add_concept_privilege();
});


function add_concept_privilege()
{
    let concept;
    let id;

    if (modal_con_select.value == "Escribir manualmente...") concept = manual_con_input.value.trim().replace(/\s+/g, " ");
    else concept = modal_con_select.value.trim().replace(/\s+/g, " ");
    if (modal_id_select.value == "Escribir manualmente...") id = manual_id_input.value.trim().replace(/\s+/g, " ");
    else{
        id = modal_id_select.value.trim().replace(/\s+/g, " ");
        if(assignable_objects)
            assignable_objects.filter(e => {
                if (concept == e.type & id == e.id)
                    id = e.id;
            });
    }
    if (concept=="" || !concept || concept==null || id=="" || !id || id==null){
        alert("Debe rellenar todos los campos.");
        return;
    }

    if(dataPrivModified[select.value]){
        for (const dat of dataPrivModified[select.value]){

            if (concept == Object.keys(dat) && id == Object.values(dat)){
                alert("Este concepto ya existe, no es posible duplicarlo.");
                return;
            }
        }
    }
    

    modal.classList.remove("show_control");

    var objconcepto = new Object();
    objconcepto[concept] = id;

    if (dataPrivModified[select.value])
    {
        let no = 0;
        for (let ke in dataPrivModified[select.value])
            no = parseInt(ke)+1;

        dataPrivModified[select.value] = Object.assign(dataPrivModified[select.value], {[no]:objconcepto});
    }
    else
        dataPrivModified[select.value] = [objconcepto];

    $(".privileges_group").html(privilegesGroup(dataPrivModified[select.value]));
}


function remove_concept_privilege(concept, id)
{
    let rem = {[concept]:id};
    
    Object.entries(dataPrivModified[select.value]).forEach(([key, value]) => {
        if (JSON.stringify(rem) == JSON.stringify(value)){
            delete dataPrivModified[select.value][key];
        }
    });

    var arr = Object.keys(dataPrivModified[select.value]).map(function (key) {
        return dataPrivModified[select.value][key];
    });

    dataPrivModified[select.value] = JSON.parse(JSON.stringify(arr));
    $(".privileges_group").html(privilegesGroup(dataPrivModified[select.value]));
}


function save_metadata(){
    var rq={};
    rq["web_meta_tags"]={
        title: $("#general_meta_title").val(),
        description: $("#general_meta_description").val(),
        keywords: $("#general_meta_key_words").val(),
        favicon: $("#general_meta_favicon").val(),
        favicon_mimetype: $("#general_meta_mime_favicon").val(),
        og : {
            url : $("#open_graph_meta_url").val(),
            type : $("#open_graph_meta_type").val(),
            title : $("#open_graph_meta_title").val(),
            description : $("#open_graph_meta_description").val(),
            image : $("#open_graph_meta_image").val()
        },
        twitter:{
            card : $("#twitter_meta_card").val(),
            domain : $("#twitter_meta_domain").val(),
            url : $("#twitter_meta_url").val(),
            title : $("#twitter_meta_title").val(),
            description : $("#twitter_meta_description").val(),
            image : $("#twitter_meta_image").val()
        }
    };

    this.folder = resource_metadata.type=="folder" ? folderPath : this.folder;
    let name = resource_metadata.type=="folder" ? "." : resource_metadata.name;
    let fname = name;
	
    var rq2={};
    rq2[fname]={
        properties:rq
    };

    invoque_set_metadata(rq2,function(data)
    {
        let res = Object.keys(data);
        let r = res[0];
        if(!data[r].props_done){
            alert("No se ha podido guardar los metadatos" + "\n" + data[r].message);
            return;
        }
    },
    function(message){
        alert("Ha ocurrido un error al realizar la operación\n\r"+message);
    });
}

function set_metadata()
{
    this.folder = resource_metadata.type=="folder" ? folderPath : this.folder;
    let name = resource_metadata.type=="folder" ? "." : resource_metadata.name;
    let fname = name;
	
    var rq={};
    rq[fname]={
        properties:JSON.parse(text_area.value)
    };

    invoque_set_metadata(rq,function(data)
    {
        let res = Object.keys(data);
        let r = res[0];
        if(!data[r].props_done){
            alert("No se ha podido crear el metadato" + "\n" + data[r].message);
            return;
        }
    },
    function(message){
        alert("Ha ocurrido un error al realizar la operación\n\r"+message);
    });
}


function add_privilege()
{
    let pname = prompt("Ingrese el nombre del privilegio:");
	if (!pname)
        return;

    var rq2={};
    rq2[pname.trim().replace(/\s+/g, " ")]=[];

    const pattern = new RegExp("^[a-zA-Z0-9_ ]+$");
    if(!pattern.test(pname)){
        alert("Solo se permiten caracteres alfanuméricos, espacios y guión bajo.\n\n[ a-z, A-Z, 0-9, _ ]");
        return;
    }
    
    for (const dat in dataPrivModified){

        if (dat == pname){
            alert("El privilegio con el id: " + pname + " ya existe.");
            return;
        }
    }

    dataPrivModified = Object.assign(dataPrivModified, rq2);
    $(".privileges_select").html(selectPrivileges(dataPrivModified));

    $(".privileges_select").val(pname);
    document.querySelector(".privileges_select").dispatchEvent(new Event("change"));
}


function remove_privilege()
{
    pname = select.value;
    delete dataPrivModified[pname];

    $(".privileges_select").html(selectPrivileges(dataPrivModified));
    $(".privileges_group").html(privilegesGroup(dataPrivModified[select.value]));
}

function select_propertie(propertie, btn){

    properties_web_modal_options.childNodes.forEach(i=>{
        i.style.backgroundColor = "transparent";
        i.style.color = "#888";
    });
    btn.style.backgroundColor = "#fff";
    btn.style.color = "#000";
    
    all_item_prop.forEach(item=>{
        item.style.display = "none";
    });

    all_item_prop.forEach(item=>{
        if(item.id == propertie)
            item.style.display = "block";
    });
}

function aply_privilege()
{
    this.folder = resource_metadata.type=="folder" ? folderPath : this.folder;
    let name = resource_metadata.type=="folder" ? "." : resource_metadata.name;
    let fname = name;
    
    var rq={};
    rq[fname]={
        privileges:dataPrivModified
    };

    invoque_set_privileges(rq,function(data)
    {
        let res = Object.keys(data);
        let r = res[0];

        if(!data[r].privs_done){
            alert("No se ha podido crear el privilegio" + "\n" + data[r].message);
            return;
        }
    },
    function(message){
        alert("Ha ocurrido un error al realizar la operación\n\r"+message);
    });
}


function invoque_set_metadata(params,callback_success, callback_fail)
{
    $.ajax({
        type: "POST",
        url: this.folder+"set.fso",
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
}


function invoque_set_privileges(params,callback_success, callback_fail)
{
    $.ajax({
        type: "POST",
        url: this.folder+"set.fso",
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
}
