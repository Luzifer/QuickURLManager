/* 
 * Copyright (c) 2010 Knut Ahlers 
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (typeof QUM == "undefined") { var QUM = {}; }

QUM.urlstore = function() {
  var _conn = new air.SQLConnection();
  var folder = air.File.applicationStorageDirectory; 
  var dbFile = folder.resolvePath("DBSample.db"); 

  _conn.open(dbFile);
  
  var createStmt = new air.SQLStatement();
  createStmt.sqlConnection = _conn;
  
  var sql =
    "CREATE TABLE IF NOT EXISTS urls (" +
    "  id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "  url TEXT, " +
    "  title TEXT " +
    ")";
  createStmt.text = sql;
  
  createStmt.execute();
  
  var createStmt = new air.SQLStatement();
  createStmt.sqlConnection = _conn;
  
  var sql =
    "CREATE TABLE IF NOT EXISTS clicks (" +
    "  id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "  urlId INTEGER, " +
    "  access DATE " +
    ")";
  createStmt.text = sql;
  
  createStmt.execute();

  return {
  
  getURLs: function() {
    var resultset = Array();
    var selectStmt = new air.SQLStatement();
    selectStmt.sqlConnection = _conn;
    selectStmt.text = 
      "SELECT u.id AS id, u.url AS url, u.title AS title, sum(1) as clickcount " + 
      "FROM urls u " + 
      "LEFT JOIN clicks c ON u.id == c.urlId " + 
      "GROUP BY u.url " + 
      "ORDER BY sum(1) DESC";
    try {
      selectStmt.execute();
      var result = selectStmt.getResult();
      var numresults = result.data.length;
      for(var i = 0; i < numresults; i++) {
        var row = result.data[i];
        if(row.id != null)
          resultset.push({ 'id' : row.id, 'url' : row.url, 'title' : row.title, 'clicks' : row.clickcount });
      }
      
    } catch(error) {
    }
    return resultset;
  },
  
  registerClick: function(id) {
    var addClickStmt = new air.SQLStatement();
    addClickStmt.sqlConnection = _conn;
    
    var sql =
      "INSERT INTO clicks (urlId, access) " +
      "  VALUES (:id, :access)";
    addClickStmt.text = sql;
    addClickStmt.parameters[":id"] = id;
    addClickStmt.parameters[":access"] = new Date();
    
    addClickStmt.execute();
    
    // Delete old clicks
    var delStmt = new air.SQLStatement();
    delStmt.sqlConnection = _conn;
    
    var now = new Date();
    var millis = Date.UTC(now.getYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes(), now.getSeconds());
    millis = millis - (7 * 24 * 3600 * 1000);
    var dDate = new Date(millis);
    
    var sql = "DELETE FROM clicks WHERE access < :access";
    delStmt.text = sql;
    delStmt.parameters[":access"] = dDate;
    delStmt.execute();
  },
  
  addURL: function(url, title) {
    var insertStmt = new air.SQLStatement();
    insertStmt.sqlConnection = _conn;
    insertStmt.text = "INSERT INTO urls (url, title) VALUES (:url, :title)";
    insertStmt.parameters[':url'] = url;
    insertStmt.parameters[':title'] = title;
    insertStmt.execute();
  },
  
  delURL: function(id) {
    var delStmt = new air.SQLStatement();
    delStmt.sqlConnection = _conn;
    delStmt.text = "DELETE FROM urls WHERE id = :id"
    delStmt.parameters[':id'] = id;
    delStmt.execute();
    
    var delStmt = new air.SQLStatement();
    delStmt.sqlConnection = _conn;
    delStmt.text = "DELETE FROM clicks WHERE urlId = :id"
    delStmt.parameters[':id'] = id;
    delStmt.execute();
  }
  
}

}();