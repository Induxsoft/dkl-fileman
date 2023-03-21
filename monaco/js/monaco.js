
var _monacoVID=0;

function init_monaco()
{
    if (typeof monaco !=="undefined")
    {
        monaco.languages.register({id:"dkl"});
        monaco.languages.setMonarchTokensProvider("dkl",dkl_syntax);
        _monacoEditor=monaco.editor.create(document.getElementById("_code_editor"), {value:_monaco_code,language:_monaco_lang});
        _monacoVID=_monacoEditor.getModel().getAlternativeVersionId();
        _monacoEditor.getModel().onDidChangeContent((event) => {
        _monacoIsDirty=_monacoVID!=_monacoEditor.getModel().getAlternativeVersionId();
        
        if (_monacoIsDirty) 
            $("#isdirty").html("Sucio!");
        else
            $("#isdirty").html("");

        });
    }
    else
        setTimeout(function(){init_monaco();},1000);
}

function change_lang(lang)
{
    monaco.editor.setModelLanguage(_monacoEditor.getModel(), lang)
}

function reziseEditor()
{
    $("#_code_editor").height(window.innerHeight-_monaco_margin);
    if (_monacoEditor!=null)
        _monacoEditor.layout();
}

function saveText()
{
    save(()=>{
        _monacoIsDirty=false;
        _monacoVID=_monacoEditor.getModel().getAlternativeVersionId();
        });
}

function save(callback_success, callback_fail)
{
    var params={".":{text:_monacoEditor.getValue()}};

    $.ajax({
        type: "POST",
        url: _monaco_uri,
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
            alert("Ocurrió un error al invocar el servicio."+r);
        }

    }).always(function(){
        location.reload();
    });
}

function quit(path){
    if(_monacoIsDirty)
        if(confirm("Se han realizado cambios en el archivo. ¿Desea guardarlos?"))
            saveText();

    window.location.href=path;
}



function myJQueryCode() {
    $(document).ready(() => {
        $(document).ready(function(){
            reziseEditor();
            window.onresize=function(){
                reziseEditor();
            };
        
            init_monaco(); 
            });
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