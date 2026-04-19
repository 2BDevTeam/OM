
Dim responseDTO as New Object

Try

Dim userScriptCriterios As New UserScript("getcriteriosdeavaliacaofn")
Dim getCriteriosResult = userScriptCriterios.RunScript(mpage, "", Nothing, "")

If getCriteriosResult.cod <> "0000" Then
    responseDTO = New With {.cod = getCriteriosResult.cod, .codDesc = getCriteriosResult.codDesc,.message=getCriteriosResult.message, .data = Nothing}
Else
    responseDTO = New With {.cod = "0000", .codDesc = "Sucesso", .data = getCriteriosResult.data}
End If

   mpage.Response.ContentType = "application/json"
   mpage.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(responseDTO))

Catch ex as Exception

   mpage.Response.ContentType = "application/json"
   responseDTO= New With {.cod ="0007" ,.codDesc="Error",.message=ex.toString()}
   mpage.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(responseDTO))

Finally
    mpage.Response.End()
End Try
