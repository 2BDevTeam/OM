
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


Dim requisicao As String = objpara.requisicao.ToString()

Dim bo3Query as String ="
     select * from bo join bo2 on bo.bostamp=bo2.bo2stamp join bo3 on bo.bostamp=bo3.bo3stamp
     where 'N.'+cast(ndos as varchar(250))+cast(obrano as varchar(250))+'/'+cast(boano as varchar(250))=@requisicao 
     "
    
Dim sqlParametersRequisicao As New List(Of System.Data.SqlClient.SqlParameter)
sqlParametersRequisicao.Add(New System.Data.SqlClient.SqlParameter("@requisicao", requisicao))
Dim requisicaoResult As DataTable = ExecuteQuery(bo3Query, sqlParametersRequisicao)

if requisicaoResult.rows.count > 0 then
    
    return New With {.cod = "0000", .codDesc = "Sucesso", .data = requisicaoResult.Rows(0)}
Else

    return New With {.cod = "0404", .codDesc = "Requisição não encontrada para: " & requisicao, .data = Nothing}
    'Xcutil.LogViewSource(mpage, "Requisição não encontrada para: " & requisicao)

end if



 