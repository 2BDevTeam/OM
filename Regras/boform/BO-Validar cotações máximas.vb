
Try


    Dim bo=mainformdataset.tables(0).rows(0)
    Dim bo3=mainformdataset.tables("bo3").rows(0)

    'Xcutil.LogViewSource(mpage, "Iniciando validação de cotações para a requisição: " & bo3("u_requis").ToString())

    if bo("ndos")=40 Then 

        return True

    End If

    Dim userScript As New UserScript("validarcotacoesfn")

    Dim incrementa=False 
    Dim estado as String
    estado = CType(mpage, mainform).PropEstadoDoMainForm.ToString()

    If estado<>"Alterando" Then 
       
       incrementa=True

    End If

    

    Dim param As New With {.requisicao = bo3("u_requis").ToString(), .incrementa = incrementa}
    Dim result = userScript.RunScript(mpage, "", param, "")

    XcUtil.LogViewSource(mpage, "Resultado da validação de cotações: " & Newtonsoft.Json.JsonConvert.SerializeObject(result))
    


    
    If result.cod = "0007" Then
        Xcutil.LogViewSource(mpage, "Erro interno ao validar cotações: " & result.message)
        XcUtil.alerta(mpage, "Erro interno ao validar cotações", 3, 15000)
        Return False
    End If


    If result.cod <> "0000" Then
       
        XcUtil.alerta(mpage, result.codDesc, 3, 15000)
        Return False
    End If


    
    If result.data.excede Then
        XcUtil.alerta(mpage, result.message, 3, 15000)
        Return False
    End If
    
    Return True


Catch ex As Exception

    Xcutil.LogViewSource(mpage, ex.Message & vbCrLf & ex.StackTrace)
    Return False
    
End Try
