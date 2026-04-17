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

Dim requisicao As String = objpara.requisicao.ToString()
Dim incrementa As Boolean = CBool(objpara.incrementa)

' 1. Obter dados da requisição (etotaldeb)
Dim userScriptRequisicao As New UserScript("getcotacoesfn")
Dim paramRequisicao As New With {.requisicao = requisicao}
Dim requisicaoResult = userScriptRequisicao.RunScript(mpage, "", paramRequisicao, "")

If requisicaoResult Is Nothing Then
    Return New With {.cod = "0007", .codDesc = "Erro interno", .message = "getcotacoesfn retornou null para: " & requisicao, .data = Nothing}
End If

If requisicaoResult.cod <> "0000" Then
    Return New With {.cod = requisicaoResult.cod, .codDesc = requisicaoResult.codDesc, .message = "Requisição não encontrada: " & requisicao, .data = Nothing}
End If

Dim totalDeb As Decimal = CDec(requisicaoResult.data("etotaldeb"))

' 2. Obter procedimento de cotação (qtd máxima)
Dim userScriptProcedCot As New UserScript("getprocedimentocotacaofn")
Dim paramValor As New With {.valor = totalDeb}
Dim getProcResult = userScriptProcedCot.RunScript(mpage, "", paramValor, "")

If getProcResult Is Nothing Then
    Return New With {.cod = "0007", .codDesc = "Erro interno", .message = "getprocedimentocotacaofn retornou null para valor: " & totalDeb.ToString(), .data = Nothing}
End If

If getProcResult.cod <> "0000" Then
    Return New With {.cod = getProcResult.cod, .codDesc = getProcResult.codDesc, .message = "Procedimento de cotação não encontrado para o valor: " & totalDeb.ToString(), .data = Nothing}
End If

Dim qtdMax As Decimal = CDec(getProcResult.data("qtd"))

' 3. Contar cotações existentes para a requisição
Dim countQuery As String = "
    SELECT COUNT(*) as total 
    FROM bo 
    JOIN bo3 ON bo.bostamp = bo3.bo3stamp 
    WHERE bo3.u_requis = @requisicao
"

Dim sqlParams As New List(Of System.Data.SqlClient.SqlParameter)
sqlParams.Add(New System.Data.SqlClient.SqlParameter("@requisicao", requisicao))
Dim countResult As DataTable = ExecuteQuery(countQuery, sqlParams)

Dim qtdCot As Integer = CInt(countResult.Rows(0)("total"))

' 4. Se incrementa, somar +1 (cotação que está a ser criada)
If incrementa Then
    qtdCot = qtdCot + 1
End If

' 5. Verificar se excede
Dim excede As Boolean = (qtdCot > qtdMax)

If excede Then
    Return New With {
        .cod = "0000",
        .codDesc = "Sucesso",
        .message = "Número de cotações (" & qtdCot & ") excede o máximo permitido (" & qtdMax & ") para o valor total da requisição.",
        .data = New With {.excede = True, .qtdCot = qtdCot, .qtdMax = qtdMax}
    }
End If

Return New With {
    .cod = "0000",
    .codDesc = "Sucesso",
    .message = "",
    .data = New With {.excede = False, .qtdCot = qtdCot, .qtdMax = qtdMax}
}

Catch ex As Exception
    Xcutil.LogViewSource(mpage, ex.ToString())
    Return New With {.cod = "0007", .codDesc = "Erro interno", .message = "Erro interno ao validar cotações.", .data = Nothing}
End Try
