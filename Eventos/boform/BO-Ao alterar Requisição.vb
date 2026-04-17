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

    
    
    if CType(mpage, mainform).propmainformdataset Is Nothing then
        return false
    End If    
     
    if CType(mpage, mainform).propmainformdataset.tables(0).rows.count=0 then
       
            return false   
    End If
    
    Dim bo=CType(mpage, mainform).propmainformdataset.tables(0).rows(0)
    Dim bo3=CType(mpage, mainform).propmainformdataset.tables("bbo3").rows(0)
    Dim bo2=CType(mpage, mainform).propmainformdataset.tables("bbo2").rows(0)
    
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





    


    


catch e as exception
    xcutil.logviewsource(mpage, e.tostring())
end try