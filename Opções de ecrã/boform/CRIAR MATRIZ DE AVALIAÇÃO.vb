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

Dim bo = mainformdataset.tables(0).rows(0)

Dim requis As String = "N." & CStr(bo("ndos")) & CStr(bo("obrano")) & "/" & CStr(bo("boano"))

mpage.response.redirect($"../dos/boform.aspx?fazer=introduzir&doctype=43&u_requis={requis}")
'Fim das validações

Catch ex As System.Exception
  XcUtil.alerta(mpage,"Erro ao criar  matriz de avaliação",3)
    Return False
End Try
'XcUtil.Alerta(mpage,"Operação realizada com sucesso.",1)