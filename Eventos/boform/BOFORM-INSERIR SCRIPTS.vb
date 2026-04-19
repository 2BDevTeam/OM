Try
   

   if CType(mpage, mainform).propmainformdataset Is Nothing then
        return false
    End If    
     
    if CType(mpage, mainform).propmainformdataset.tables(0).rows.count=0 then
       
            return false   
    End If
    
    Dim bo=CType(mpage, mainform).propmainformdataset.tables(0).rows(0)
    Dim bostamp=""

    Dim estado as String
    estado = CType(mpage, mainform).PropEstadoDoMainForm.ToString()

    Xcutil.LogViewSource(mpage, "Estado do MainForm: " & estado)

    If estado="Alterando" or estado="Adicionando" Then 
       
        bostamp=bo("ebostamp").ToString()

    else
        bostamp=bo("bostamp").ToString()

    End If



    Dim html as String
    Dim scriptJs as String=""
    Dim scriptCss as String=""
    scriptJs+="<script src='https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.3/dexie.min.js' integrity='sha512-3JC1BK1bUkuBNB04s7BR4VVQUNsNbBiwe5p6UqxNjR0FfhFoKT97gJ7lw953MMlKxy4UdIbFAol1Ap1Mt5+Qcw==' crossorigin='anonymous' referrerpolicy='no-referrer'></script>"
    scriptJs+="<script src='https://cdnjs.cloudflare.com/ajax/libs/cleave.js/1.0.2/cleave.min.js'></script>"
    scriptJs+="<script src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'></script>"
    scriptJs+="<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-treetable/3.2.0/jquery.treetable.min.js' integrity='sha512-2pYVakljd2zLnVvVC264Ib+XGvOvu3iFyKCIwLzn77mfbjuVi1dGJUxGjDAI8MjgPgTfSIM/vZirW04LCQmY2Q==' crossorigin='anonymous' referrerpolicy='no-referrer'></script>"
    scriptJs+="<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/jquery-treetable/3.2.0/css/jquery.treetable.css' integrity='sha512-l1bJ1VnsPD+m5ZYhfcl9PrJgbCQixXtQ/zs423QYu0w1xDGXJOSC0TmorOocaYY8md5+YMRcxZ/UgjyOSIlTYw==' crossorigin='anonymous' referrerpolicy='no-referrer' />"
    scriptJs+="<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/jquery-treetable/3.2.0/css/jquery.treetable.css' integrity='sha512-l1bJ1VnsPD+m5ZYhfcl9PrJgbCQixXtQ/zs423QYu0w1xDGXJOSC0TmorOocaYY8md5+YMRcxZ/UgjyOSIlTYw==' crossorigin='anonymous' referrerpolicy='no-referrer' />"
    scriptJs+="<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/jquery-treetable/3.2.0/css/jquery.treetable.theme.default.min.css' integrity='sha512-+QlAY2+q9M7bP5NBnGKrBO5u/asZTHsHJ8yVvw/opoi50KZube+tfc3ojM5MHa0d+vTorqu3Mf/IKyTyxWWbzg==' crossorigin='anonymous' referrerpolicy='no-referrer' />"

     scriptJs +="<script src='https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/ace.js'></script>"
    scriptJs +="<script src='https://unpkg.com/prettier@2.8.8/standalone.js'></script>"

    scriptJs +="<script src='https://unpkg.com/prettier@2.8.8/parser-babel.js'></script>"

    scriptJs +="<script src='https://bossanova.uk/jspreadsheet/v5/jspreadsheet.js'></script>"   
    scriptJs +="<script src='https://jsuites.net/v5/jsuites.js'></script>" 
    scriptJs+="<script src='https://cdn.jsdelivr.net/npm/alasql'></script>"
    scriptJs+="<script src='https://unpkg.com/petite-vue'></script>"
    scriptJs+="<script src='https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js'></script>"
    scriptJs+="<script src='https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js'></script>"
    scriptJs+="<script src='https://fastly.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'></script>"
    scriptCss+="<link rel='stylesheet' href='https://bossanova.uk/jspreadsheet/v5/jspreadsheet.css'/>"
    scriptCss+="<link rel='stylesheet' href='https://jsuites.net/v5/jsuites.css'/>"
    scriptJs+="<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>"
    scriptJs += "<script src='https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.3/dexie.min.js' integrity='sha512-3JC1BK1bUkuBNB04s7BR4VVQUNsNbBiwe5p6UqxNjR0FfhFoKT97gJ7lw953MMlKxy4UdIbFAol1Ap1Mt5+Qcw==' crossorigin='anonymous' referrerpolicy='no-referrer'></script>"
    scriptJs+="<script src='https://cdnjs.cloudflare.com/ajax/libs/cleave.js/1.0.2/cleave.min.js' ></script>"

    scriptJs+="<script src='https://unpkg.com/tabulator-tables@5.5.0/dist/js/tabulator.min.js'></script>"
    scriptCss+=" <link href='https://unpkg.com/tabulator-tables@5.5.0/dist/css/tabulator_bootstrap5.min.css' rel='stylesheet'>"
    scriptJs +="<script src='https://cdn.jsdelivr.net/gh/2BDevTeam/cdns@master/GLOBAL.js'></script>"   

    Dim linhasInput as String="<textarea style='display:none' id='registoJson' name='registoJson' type='text'></textarea>"
    html = $"<div id='bodata' data-bostamp={bostamp} ></div>"
    html+=scriptJs
    html+=linhasInput

   
Dim destination As Object
destination = mpage.master.findcontrol("conteudo").findcontrol("maincontent")
destination.Controls.Add(new LiteralControl(html))



Catch e as Exception
    XcUtil.LogViewSource(mpage,e.toString())
End try