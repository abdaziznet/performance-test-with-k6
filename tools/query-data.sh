#!/bin/bash
#/opt/mssql-tools18/bin/sqlcmd -S "192.168.5.72" -d "BiometricCBS" -U "sa" -P "P@ssw0rd" -C -h -1 -Q "SET QUOTED_IDENTIFIER ON; SELECT U.nip, U.name, CNAL.user_name, U.origin_branch_code, (SELECT templates FOR XML PATH(''), BINARY BASE64, TYPE).value('.', 'VARCHAR(MAX)') AS Template FROM dbo.user_finger_templates AS UFT JOIN dbo.[user] AS U ON U.id = UFT.user_id JOIN dbo.coreNG_ABUSER_latest AS CNAL ON CNAL.nip_user = U.nip FOR JSON PATH;" -o "data_user.json" -W -w 65535

/opt/mssql-tools18/bin/sqlcmd -S "192.168.5.72" -d "BiometricCBS" -U "sa" -P "P@ssw0rd" -C -h -1 -Q "SET QUOTED_IDENTIFIER ON; SELECT U.nip, U.name, CNAL.user_name, U.origin_branch_code, Template = (SELECT templates FOR XML PATH(''), BINARY BASE64, TYPE).value('.', 'VARCHAR(MAX)') FROM dbo.user_finger_templates AS UFT JOIN dbo.[user] AS U ON U.id = UFT.user_id JOIN dbo.coreNG_ABUSER_latest AS CNAL ON CNAL.nip_user = U.nip FOR JSON PATH;" | tr -d '\r\n' > data_user.json

