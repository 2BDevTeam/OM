

Dim responseDTO as New Object
Dim MapToDefaultValue=Function(ByVal value)

  return CType(value, Newtonsoft.Json.Linq.JValue).Value
End Function
Try

  
Dim userScriptProcedCot As New UserScript("getprocedimentocotacaofn")
Dim parmValor As New With {.valor = 500}

Dim getProcResult = userScriptProcedCot.RunScript(mpage, "", parmValor, "")

If getProcResult.cod <> "0000" Then
    responseDTO = New With {.cod = getProcResult.cod, .codDesc = getProcResult.codDesc}
else 

    responseDTO = New With {.cod = "0000", .codDesc = "Sucesso", .data = getProcResult.data}
End If



   mpage.Response.ContentType = "application/json"
   mpage.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(responseDTO))

Catch ex as Exception
 ' XcUtil.LogViewSource(mpage,e.toString())

   mpage.Response.ContentType = "application/json"
   responseDTO= New With {.cod ="0007" ,.codDesc="Error",.message=ex.toString()}
   mpage.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(responseDTO))


Finally
    mpage.Response.End()
End Try