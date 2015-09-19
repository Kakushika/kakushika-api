![build status](https://circleci.com/gh/Kakushika/kakushika-api.svg?style=shield&circle-token=e9151299f140b5881e1424e9651d75d9a7aaa658)

# Kakushika-api
Kakushika API

sequlizeが結構微妙だったので、[edge-js](https://github.com/tjanczuk/edge)を導入。ORMじゃないけど。

DBにつなぐには環境変数に接続文字列をセットする
```
EDGE_SQL_CONNECTION_STRING=Server=tcp:iwate.database.windows.net,1433;Database=iwate;User ID=iwate@iwate;Password={password};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```
