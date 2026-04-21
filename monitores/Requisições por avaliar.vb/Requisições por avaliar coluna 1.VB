dim query as String
query+=" SELECT RESUMO = 'PR - Avaliação', STAMP = 'PR - Avaliação',"
query+=" ISNULL(COUNT(*), 0) AS SOMA from bo join bo2 on bo.bostamp=bo2.bo2stamp"
query+=" where bo.ndos=40 and bo.logi7 =1 ;"
return cdata.GetDatatable(query)