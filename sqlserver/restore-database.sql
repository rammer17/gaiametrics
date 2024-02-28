RESTORE DATABASE GaiaMetrics
FROM
    DISK = '/var/opt/mssql/data/GaiaMetrics.bak' WITH MOVE 'GaiaMetrics' TO '/var/opt/mssql/data/GaiaMetrics.mdf' MOVE 'GaiaMetrics_log' TO '/var/opt/mssql/data/GaiaMetrics_log.ldf'