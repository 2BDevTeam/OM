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

Dim query As String = "
   select *from u_criterioav
"

Dim resultado As DataTable = ExecuteQuery(query, Nothing)

Return New With {.cod = "0000", .codDesc = "Sucesso", .data = resultado}


Catch ex As Exception
    Xcutil.LogViewSource(mpage, ex.ToString())
    Return New With {.cod = "0007", .codDesc = "Erro interno", .message = ex.Message, .data = Nothing}
End Try
