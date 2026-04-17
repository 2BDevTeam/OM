
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


Dim valor As Decimal = CDec(objpara.valor)

Dim query As String = "
    SELECT TOP 1 u_procedcotstamp, tectos, comp, qtd, procedimento
    FROM u_PROCEDCOT
    WHERE @valor >= valmin AND @valor <= valmax
    ORDER BY valmin
"

Dim sqlParams As New List(Of System.Data.SqlClient.SqlParameter)
sqlParams.Add(New System.Data.SqlClient.SqlParameter("@valor", valor))

Dim resultado As DataTable = ExecuteQuery(query, sqlParams)

If resultado.Rows.Count > 0 Then

    Return New With {.cod = "0000", .codDesc = "Sucesso", .data = resultado.Rows(0)}

End If

Return New With {.cod = "0404", .codDesc = "Procedimento de cotação não encontrado para o valor: " & valor.ToString(), .data = Nothing}
 