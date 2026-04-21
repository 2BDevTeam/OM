Dim ExecuteNonQuery = Function(ByVal fQuery As String, ByVal fSqlParameters As List(Of System.Data.SqlClient.SqlParameter)) as Integer
    Dim rowsAffected as Integer
    Using connection as SqlClient.SqlConnection = SqlHelp.GetNewConnection()
        connection.open()
		Using command As New SqlClient.SqlCommand(fQuery, connection)
            if(fSqlParameters IsNot Nothing)
                For Each sqlParameter As System.Data.SqlClient.SqlParameter in fSqlParameters
                    command.Parameters.Add(sqlParameter)
                Next
            end if
            rowsAffected = command.ExecuteNonQuery()
		End Using
	End Using
    return rowsAffected
End Function
Dim ExecuteQuery = Function(ByVal fQuery As String, ByVal fSqlParameters As List(Of System.Data.SqlClient.SqlParameter)) as DataTable
    Dim table As New DataTable
    Using connection as SqlClient.SqlConnection = SqlHelp.GetNewConnection()
        Using command As New SqlClient.SqlCommand(fQuery, connection)
            if(fSqlParameters IsNot Nothing)
                For Each sqlParameter As System.Data.SqlClient.SqlParameter in fSqlParameters
                    command.Parameters.Add(sqlParameter)
                Next
            end if
            Using adapter As New SqlClient.SqlDataAdapter(command)
                adapter.Fill(table)
            End Using
        End Using
    End Using
    return table
End Function


Try


    Dim bo=mainformdataset.tables(0).rows(0)
    Dim bo3=mainformdataset.tables("bo3").rows(0)
    Dim bo2=mainformdataset.tables("bo2").rows(0)

    'Xcutil.LogViewSource(mpage, "Iniciando validação de cotações para a requisição: " & bo3("u_requis").ToString())

    if bo("ndos")<>41 Then 

        return True

    End If

     Dim bo3Query as String ="
     
     select * from bo 
     where 'N.'+cast(ndos as varchar(250))+cast(obrano as varchar(250))+'/'+cast(boano as varchar(250))=@requisicao 


     "
    
    Dim sqlParametersRequisicao As New List(Of System.Data.SqlClient.SqlParameter)
    sqlParametersRequisicao.Add(New System.Data.SqlClient.SqlParameter("@requisicao", bo3("u_requis").ToString()))
    Dim requisicaoResult As DataTable = ExecuteQuery(bo3Query, sqlParametersRequisicao)

    if requisicaoResult.rows.count > 0 then
        
       ' Xcutil.LogViewSource(mpage, "Requisição: " & requisicaoResult.rows(0)("requisicao").ToString())
        bo2("u_bostamp") = requisicaoResult.rows(0)("bostamp")
    Else
        'Xcutil.LogViewSource(mpage, "Requisição não encontrada para: " & bo3("u_requis").ToString())

    
    end if


    Dim userScript As New UserScript("validarminimocotfn")

    Dim incrementa=False 
    Dim estado as String
    estado = CType(mpage, mainform).PropEstadoDoMainForm.ToString()

    If estado<>"Alterando" Then 
       
       incrementa=True

    End If

    

    Dim param As New With {.requisicao = bo3("u_requis").ToString(), .incrementa = incrementa}
    Dim result = userScript.RunScript(mpage, "", param, "")


    'XcUtil.LogViewSource(mpage, "Resultado da validação de cotações: " & Newtonsoft.Json.JsonConvert.SerializeObject(result))
    


    
    If result.cod = "0007" Then
        Xcutil.LogViewSource(mpage, "Erro interno ao validar cotações: " & result.message)
        XcUtil.alerta(mpage, "Erro interno ao validar cotações", 3, 15000)
        Return False
    End If


    If result.cod <> "0000" Then
       
        XcUtil.alerta(mpage, result.codDesc, 3, 15000)
        Return False
    End If


    
    If result.data.atingiuMinimo  Then

        Dim query as String="update bo set logi7=1 where bostamp=@bostamp"
        Dim sqlParameters As New List(Of System.Data.SqlClient.SqlParameter)
        sqlParameters.Add(New System.Data.SqlClient.SqlParameter("@bostamp", bo2("u_bostamp")))
        ExecuteNonQuery(query, sqlParameters)

        Return True
    End If
    
    Return True


Catch ex As Exception

    Xcutil.LogViewSource(mpage, ex.Message & vbCrLf & ex.StackTrace)
    Return False
    
End Try
