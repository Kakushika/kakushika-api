'use strict';

var edge = require('edge');

var getInFolder = edge.func('sql-o', function() {
  /*
      SELECT f.* FROM Folders AS f
      INNER JOIN R_FoldersEdge AS fse ON fse.[childFolderId] = f.[id]
      WHERE fse.[parentFolderId] = @folderId
  */
});

var getReadablesInFolder = edge.func('sql-o', function() {
  /*
      SELECT f.[id] FROM Folders AS f
      INNER JOIN R_FoldersEdge AS fse ON fse.[childFolderId] = f.[id]
      INNER JOIN R_FolderReadableUsers AS fru.[folderId] = f.[id]
      WHERE fru.[userId] = @userId
      WHERE fse.[parentFolderId] = @parentId
      WHERE f.name = @name
  */
});

function createCallback(resolve, reject) {
  return function callback(err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  };
}

function createSingleCallback(resolve, reject) {
  return function callback(err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result[0]);
    }
  };
}

function resolveName(userId, parentId, folderName) {
  var m = folderName.match(/(.+)\((\d+)\)/),
    name = folderName,
    id;
  if (m) {
    name = m[1];
    id = m[2];
  }
  return new Promise(function(resolve, reject) {
    getReadablesInFolder({
      userId: userId,
      parentId: parentId,
      name: name
    }, function(err, result) {
      if (!err) {
        if (id) {
          var index = result.indexOf(id);
          if (index !== -1) {
            resolve(result[index]);
          } else {
            reject(err);
          }
        } else if (result.length > 0) {
          resolve(result[0]);
        } else {
          reject(err);
        }
      } else {
        reject(err);
      }
    });
  });
}

function resolvePath(userId, path) {
  var name = path.shift();
  var promise = resolveName(userId, null, name);
  while (!!(name = path.shift())) {
    promise.then(function(id) {
      return resolveName(userId, id, name);
    });
  }
  return promise;
}
var folder = {
  getIn: function(userId, path) {

    return resolvePath(userId, ['Home'].concat(path)).then(function(id) {
      return getInFolder({
        id: id
      }, createSingleCallback);
    });
  }
};

module.exports = folder;
