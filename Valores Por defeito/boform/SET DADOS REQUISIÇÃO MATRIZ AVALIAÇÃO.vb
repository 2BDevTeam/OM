
Try
    

Dim requisicao as Object = mpage.request.queryString("u_requis")

return requisicao

Catch ex As Exception
   Xcutil.LogViewSource(mpage,ex.ToString())    
End Try