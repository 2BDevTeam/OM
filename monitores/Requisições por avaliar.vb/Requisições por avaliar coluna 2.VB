Dim getAnexoUrl = Function(ByVal anexo As DataRow) As String
    Dim ficheiroUrl As String = ""
    Dim flen As Integer = 0
    If IsNumeric(anexo("flen").ToString()) Then
        flen = CInt(anexo("flen"))
    End If
    Dim fullname As String = anexo("fullname").ToString()
    Dim fname As String = anexo("fname").ToString()
    Dim fext As String = anexo("fext").ToString()
    Dim anexosstamp As String = anexo("anexosstamp").ToString()
    Dim nomeFicheiro As String = fname
    If fext <> "" Then
        nomeFicheiro &= "." & fext
    End If
    If flen > 0 Then
        Dim appPath As String = HttpContext.Current.Server.MapPath("~") & "/pimages/temp"
        Dim baseUrl As String = HttpContext.Current.Request.Url.Scheme & "://" & HttpContext.Current.Request.Url.Authority & HttpContext.Current.Request.ApplicationPath.TrimEnd("/"c)
        Dim webUrl As String = baseUrl & "/pimages/temp"
        Dim safeName As String = anexosstamp & "_" & nomeFicheiro
        Dim fullpath As String = System.IO.Path.Combine(appPath, safeName)
        Dim fullWebUrl As String = webUrl & "/" & safeName
        If Not System.IO.Directory.Exists(appPath) Then
            Try
                System.IO.Directory.CreateDirectory(appPath)
            Catch ex As Exception
            End Try
        End If
        If Not System.IO.File.Exists(fullpath) Then
            Try
                System.IO.File.WriteAllBytes(fullpath, DirectCast(anexo("bdados"), Byte()))
            Catch ex As Exception
                Return ""
            End Try
        End If
        ficheiroUrl = fullWebUrl
    Else
        If fullname.ToLower().StartsWith("http://") OrElse fullname.ToLower().StartsWith("https://") Then
            ficheiroUrl = fullname
        Else
            ficheiroUrl = ""
        End If
    End If
    Return ficheiroUrl
End Function
Dim bo As DataRow = mainformdataset.Tables(0).Rows(0)
Dim nome, obrano, ccusto, circuito, totaldoc, moeda, no, justificativo, bostamp, fllink, flstamp, bolink As String
nome = bo.Item("nome").ToString().Trim()
obrano = bo.Item("obrano").ToString().Trim()
ccusto = bo.Item("ccusto").ToString().Trim()
circuito = bo.Item("nomquina").ToString().Trim()
totaldoc = bo.Item("u_totiva").ToString().Trim()
moeda = bo.Item("moeda").ToString().Trim()
no = bo.Item("no").ToString().Trim()
justificativo = bo.Item("u_trab1").ToString().Trim()
bostamp = bo.Item("bostamp").ToString().Trim()
fllink = ""
flstamp = ""
bolink = "../dos/boform.aspx?stamp=" & XcFox.u_scrypt(mstamp)
Dim dtfl As DataTable = cdata.getdatatable("select top 1 flstamp from fl where no = '" & no.Replace("'", "''") & "'")
If dtfl.Rows.Count > 0 Then
    flstamp = dtfl.Rows(0).Item("flstamp").ToString().Trim()
    If flstamp <> "" Then
        fllink = "../ori/flform.aspx?stamp=" & XcFox.u_scrypt(flstamp)
    End If
End If
' =========================
' CABIMENTAÇÃO
' =========================
Dim qCab As String = ""
qCab &= "select conta, disponib, saldoexi, valorreq, saldofin "
qCab &= "from u_boconta "
qCab &= "where bostamp = '" & bostamp.Replace("'", "''") & "' "
qCab &= "order by conta"
Dim dtCab As DataTable = cdata.getdatatable(qCab)
' =========================
' DOCUMENTOS ASSOCIADOS
' =========================
Dim queryDocs As String = ""
queryDocs &= "Select Stamp=bo.bostamp, documento='Contrato', Tabela='BO', Número=ltrim(rtrim(str(obrano))), Data=dataobra, Total=u_totiva, Nome=Nome, Fundo=fref, "
queryDocs &= "Projecto=ccusto, Objecto=u_trab1 "
queryDocs &= "from bo(nolock) inner join bo2(nolock) on bo.bostamp=bo2.bo2stamp "
queryDocs &= "where bo.ndos=38 and ltrim(rtrim(bo.bostamp))='" & bo.Item("u_bostamp").ToString().Trim().Replace("'", "''") & "' "
queryDocs &= " union all "
queryDocs &= "Select Stamp=fostamp, documento='Compra', Tabela='FO', Número=adoc, Data=data, Total=total, Nome=Nome, Fundo=fref, Projecto=ccusto, Objecto=final "
queryDocs &= "from fo(nolock) inner join fo2(nolock) on fo.fostamp=fo2.fo2stamp "
queryDocs &= "where (ltrim(rtrim(fo.u_bostamp))='" & bostamp.Replace("'", "''") & "' OR '" & bo.Item("u_fostamp").ToString().Trim().Replace("'", "''") & "' = ltrim(rtrim(fo.fostamp))) and fo2.anulado = 0 "
queryDocs &= " union all "
queryDocs &= "Select Stamp=olbbstamp, documento='Transferência', Tabela='OLBB', Número=cheque, Data=data, Total=valor, Nome='" & nome.Replace("'", "''") & "', Fundo=fref, Projecto=ccusto, Objecto=descricao "
queryDocs &= "from olbb (nolock) where ltrim(rtrim(olbb.u_bostamp))='" & bostamp.Replace("'", "''") & "' "
queryDocs &= " union all "
queryDocs &= "Select Stamp=pdstamp, documento='Adiantamento', Tabela='PD', Número=rno, Data=rdata, Total=total, Nome='" & nome.Replace("'", "''") & "', Fundo=fref, Projecto=ccusto, Objecto=descricao "
queryDocs &= "from pd (nolock) where ltrim(rtrim(pd.u_bostamp))='" & bostamp.Replace("'", "''") & "' "
queryDocs &= " union all "
queryDocs &= "Select Stamp=owstamp, documento='Doc. Tesouraria', Tabela='OW', Número=adoc, Data=data, Total=said, Nome='" & nome.Replace("'", "''") & "', Fundo=fref, Projecto=ccusto, Objecto=descricao "
queryDocs &= "from ow (nolock) where ltrim(rtrim(ow.u_bostamp))='" & bostamp.Replace("'", "''") & "' "
queryDocs &= " union all "
queryDocs &= "Select Stamp=postamp, documento='Pagamento', Tabela='PO', Número=rno, Data=rdata, Total=total, Nome='" & nome.Replace("'", "''") & "', Fundo=fref, Projecto=ccusto, Objecto=desc2 "
queryDocs &= "from po (nolock) where ltrim(rtrim(po.u_bostamp))='" & bostamp.Replace("'", "''") & "' "
Dim dtDocs As DataTable = cdata.getdatatable(queryDocs)
' =========================
' ANEXOS
' =========================
Dim qAnexos As String = ""
qAnexos &= "select anexosstamp, resumo, descricao, ausrdata, bdados, fullname, fname, fext, flen "
qAnexos &= "from anexos "
qAnexos &= "where recstamp = '" & bostamp.Replace("'", "''") & "'"
Dim dtAnexos As DataTable = cdata.getdatatable(qAnexos)
Dim content As String = ""
content &= "<div class='gtextbox'>"
content &= "<ul class='nav nav-pills margintop'>"
content &= "<li class='active'><a href='#acao' role='tab' data-toggle='pill'>Ação</a></li>"
content &= "<li><a href='#lig' role='tab' data-toggle='pill'>Ligações"
If dtDocs.Rows.Count > 0 Then
    content &= "<span class='badge badgegray'>" & dtDocs.Rows.Count.ToString() & "</span>"
End If
content &= "</a></li>"
content &= "<li><a href='#ane' role='tab' data-toggle='pill'>Anexos"
If dtAnexos.Rows.Count > 0 Then
    content &= "<span class='badge badgegray'>" & dtAnexos.Rows.Count.ToString() & "</span>"
End If
content &= "</a></li>"
content &= "<li><a href='#com' role='tab' data-toggle='pill'>Comentários</a></li>"
content &= "</ul>"
content &= "<div class='tab-content'>"
' ===================== ABA AÇÃO =====================
content &= "<div id='acao' class='tab-pane fade active in'>"
content &= "<div class='table-responsive'>"
content &= "<table class='table table-xs table-hover table-striped' style='width:100%;'>"
content &= "<tbody>"
content &= "<tr><td>Pedido de Pagamento</td><td><a href='" & bolink & "'>Abrir pedido de pagamento nº " & obrano & "</a></td></tr>"
content &= "<tr><td>Nome</td><td><b>" & nome & "</b></td></tr>"
content &= "<tr><td>Projecto</td><td>" & ccusto & "</td></tr>"
content &= "<tr><td>Circuito</td><td>" & circuito & "</td></tr>"
content &= "<tr><td>Justificativo</td><td>" & justificativo & "</td></tr>"
If IsNumeric(totaldoc) Then
    content &= "<tr><td>Total</td><td><b>" & FormatNumber(CDec(totaldoc), 2) & " " & moeda & "</b></td></tr>"
Else
    content &= "<tr><td>Total</td><td><b>" & totaldoc & " " & moeda & "</b></td></tr>"
End If
content &= "</tbody>"
content &= "</table>"
content &= "</div>"
content &= "<h4>Cabimentação</h4>"
content &= "<div class='table-responsive'>"
content &= "<table class='table table-xs table-hover table-striped' style='width:100%;'>"
content &= "<thead>"
content &= "<tr>"
content &= "<th>Rubrica</th>"
content &= "<th style='text-align:right;'>Disponível</th>"
content &= "<th style='text-align:right;'>Saldo Existente</th>"
content &= "<th style='text-align:right;'>Valor Requisição</th>"
content &= "<th style='text-align:right;'>Saldo Final</th>"
content &= "</tr>"
content &= "</thead>"
content &= "<tbody>"
If dtCab.Rows.Count > 0 Then
    For Each r As DataRow In dtCab.Rows
        content &= "<tr>"
        content &= "<td>" & r("conta").ToString() & "</td>"
        If IsNumeric(r("disponib").ToString()) Then
            content &= "<td style='text-align:right;'>" & FormatNumber(CDec(r("disponib")), 2) & "</td>"
        Else
            content &= "<td style='text-align:right;'>" & r("disponib").ToString() & "</td>"
        End If
        If IsNumeric(r("saldoexi").ToString()) Then
            content &= "<td style='text-align:right;'>" & FormatNumber(CDec(r("saldoexi")), 2) & "</td>"
        Else
            content &= "<td style='text-align:right;'>" & r("saldoexi").ToString() & "</td>"
        End If
        If IsNumeric(r("valorreq").ToString()) Then
            content &= "<td style='text-align:right;'>" & FormatNumber(CDec(r("valorreq")), 2) & "</td>"
        Else
            content &= "<td style='text-align:right;'>" & r("valorreq").ToString() & "</td>"
        End If
        If IsNumeric(r("saldofin").ToString()) Then
            content &= "<td style='text-align:right;'>" & FormatNumber(CDec(r("saldofin")), 2) & "</td>"
        Else
            content &= "<td style='text-align:right;'>" & r("saldofin").ToString() & "</td>"
        End If
        content &= "</tr>"
    Next
Else
    content &= "<tr><td colspan='5'>Sem registos de cabimentação.</td></tr>"
End If
content &= "</tbody>"
content &= "</table>"
content &= "</div>"
content &= "</div>"
' ===================== ABA LIGAÇÕES =====================
content &= "<div id='lig' class='tab-pane fade'>"
content &= "<div class='table-responsive'>"
content &= "<table class='table table-xs table-hover table-striped' style='width:100%;'>"
content &= "<tbody>"
If dtDocs.Rows.Count > 0 Then
    For Each r As DataRow In dtDocs.Rows
        Dim linkdoc As String = ""
        Dim tabela As String = r("Tabela").ToString().Trim().ToUpper()
        Dim stamp As String = r("Stamp").ToString().Trim()
        Dim txt As String = r("documento").ToString() & " | Nº: " & r("Número").ToString()
        If IsNumeric(r("Total").ToString()) Then
            txt &= " | Total: " & FormatNumber(CDec(r("Total")), 2)
        Else
            txt &= " | Total: " & r("Total").ToString()
        End If
        If tabela = "BO" Then
            linkdoc = "../dos/boform.aspx?stamp=" & XcFox.u_scrypt(stamp)
        ElseIf tabela = "FO" Then
            linkdoc = "../com/foform.aspx?stamp=" & XcFox.u_scrypt(stamp)
        ElseIf tabela = "PD" Then
            linkdoc = "../tes/pdform.aspx?stamp=" & XcFox.u_scrypt(stamp)
        ElseIf tabela = "OW" Then
            linkdoc = "../tes/owform.aspx?stamp=" & XcFox.u_scrypt(stamp)
        ElseIf tabela = "PO" Then
            linkdoc = "../tes/poform.aspx?stamp=" & XcFox.u_scrypt(stamp)
        ElseIf tabela = "OLBB" Then
            linkdoc = "../tes/olbbform.aspx?stamp=" & XcFox.u_scrypt(stamp)
        End If
        If linkdoc <> "" Then
            content &= "<tr><td class='glabellink'><a href='" & linkdoc & "'>" & txt & "</a></td></tr>"
        Else
            content &= "<tr><td class='glabellink'>" & txt & "</td></tr>"
        End If
    Next
Else
    content &= "<tr><td>Sem documentos associados.</td></tr>"
End If
content &= "</tbody>"
content &= "</table>"
content &= "</div>"
content &= "</div>"
' ===================== ABA ANEXOS =====================
content &= "<div id='ane' class='tab-pane fade'>"
content &= "<div class='table-responsive margintop'>"
content &= "<table class='table table-xs table-hover table-striped' style='width:100%;'>"
content &= "<thead>"
content &= "<tr>"
content &= "<th>Resumo</th>"
content &= "<th>Descrição</th>"
content &= "<th>Criado em</th>"
content &= "<th>Ficheiro</th>"
content &= "</tr>"
content &= "</thead>"
content &= "<tbody>"
If dtAnexos.Rows.Count > 0 Then
    For Each r As DataRow In dtAnexos.Rows
        Dim resumo As String = r("resumo").ToString()
        Dim descricao As String = r("descricao").ToString()
        Dim ausrdata As String = r("ausrdata").ToString()
        Dim ficheiroUrl As String = getAnexoUrl(r)
        Dim nomeFicheiro As String = resumo
        If r("fname").ToString().Trim() <> "" AndAlso r("fext").ToString().Trim() <> "" Then
            nomeFicheiro = r("fname").ToString().Trim() & "." & r("fext").ToString().Trim()
        ElseIf r("fullname").ToString().Trim() <> "" Then
            nomeFicheiro = System.IO.Path.GetFileName(r("fullname").ToString().Trim())
        End If
        content &= "<tr>"
        content &= "<td>" & resumo & "</td>"
        content &= "<td>" & descricao & "</td>"
        content &= "<td>" & ausrdata & "</td>"
        If ficheiroUrl <> "" Then
            content &= "<td><a class='formcampo' href='" & ficheiroUrl & "' target='_blank'>" & nomeFicheiro & "</a></td>"
        Else
            content &= "<td>" & nomeFicheiro & "</td>"
        End If
        content &= "</tr>"
    Next
Else
    content &= "<tr><td colspan='4'>Sem anexos associados.</td></tr>"
End If
content &= "</tbody>"
content &= "</table>"
content &= "</div>"
content &= "</div>"
' ===================== ABA COMENTÁRIOS =====================
content &= "<div id='com' class='tab-pane fade'>"
content &= "<textarea rows='2' class='form-control growingTextarea'></textarea>"
content &= "<a class='btn btn-default btn-sm margintop'>Adicionar comentário</a>"
content &= "</div>"
content &= "</div>"
content &= "</div>"
Return content