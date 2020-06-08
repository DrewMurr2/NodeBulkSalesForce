# NodeToSalesforceBulkApi2.0
 
### install & Start
- npm install
- nodemon index

### Postman and salesforce Object.
- create salesforce custom object manually.( ex: car__c object)
- postman
{
"csv_url":"https://clientconnectcdn.azureedge.net/uploads/fa848ffb-f8f4-4cf6-9c69-cd3b2bf2eb59328105696.csv",
"object_name":"people"
}

- [object_name] is salesforce object name( api: objName__c)
- [csv_url] is csv file path

#### Configure User Auth
- go to the salesforce user setting. ( my setting).
- click reset security token, then you will get message( username, security token)
- config .env file with username, security token, password and salesforce app url.


