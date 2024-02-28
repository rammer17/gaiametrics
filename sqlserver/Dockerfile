FROM mcr.microsoft.com/mssql/server:2017-latest
ENV MSSQL_SA_PASSWORD=myStong_Password123#
ENV ACCEPT_EULA=Y

COPY GaiaMetrics.bak /var/opt/mssql/data/

COPY restore-database.sql /var/opt/mssql/data/

RUN /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'myStong_Password123#' -Q "EXECUTE master.sys.sp_MSforeachdb 'IF (''?'' != ''master'' AND ''?'' != ''tempdb'' AND ''?'' != ''model'' AND ''?'' != ''msdb'' ) BEGIN EXEC (''?'' .dbo.sp_changedbowner ''''sa'''') END'"
CMD /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'myStong_Password123#' -d master -i /var/opt/mssql/data/restore-database.sql
