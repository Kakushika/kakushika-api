'use strict';

var edge = require('edge');

var create = edge.func('sql-o', () => {
  /*
      INSERT INTO Folders([name], [ownerId])
      OUTPUT INSERTED.*
      VALUES(@name, @userId)
  */
});

var createRelation = edge.func('sql-o', () => {
  /*
      INSERT INTO R_FoldersEdges([parentFolderId], [childFolderId])
      OUTPUT INSERTED.id, INSERTED.name
      VALUES(@parentFolderId, @childFolderId)
  */
});

var createReadable = edge.func('sql-o', () => {
  /*
      INSERT INTO R_FolderReadableUsers(userId, folderId)
      OUTPUT INSERTED.*
      VALUES(@userId, @folderId)
   */
});

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

var deleteRelation = edge.func('sql-o', () => {
  /*
      DELETE FROM R_FoldersEdges AS fe
      OUTPUT DELETED.*
      WHERE fe.parentFolderId = @parentFolderId AND fe.childFolderId = @childFolderId
   */
});

// function createCallback(resolve, reject) {
//   return function callback(err, result) {
//     if (err) {
//       reject(err);
//     } else {
//       resolve(result);
//     }
//   };
// }

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
    promise.then((id) => {
      return resolveName(userId, id, name);
    });
  }
  return promise;
}

var folder = {
  create: function(parentFolderId, userId, name) {
    return new Promise((resolve, reject) => {
      create({
        userId: userId,
        name: name
      }, createSingleCallback(resolve, reject));
    }).then((folder) => {
      return new Promise(function(resolve, reject) {
        createRelation({
          parentFolderId: parentFolderId,
          childFolderId: folder.id
        }).then(() => {
          resolve(folder);
        }, reject);
      });
    });
  },
  createRelations: function(userId, to, folderIds) {
    return Promise.all(
      folderIds.map((folderId) => {
        createRelation({
          childFolderId: folderId,
          parentFolderId: to
        }, (err, result) => {
          if (err) {
            Promise.reject(err);
          } else {
            Promise.resolve(result);
          }
        });
      })
    );
  },
  deleteRelations: function(userId, from, folderIds) {
    return Promise.all(
      folderIds.map((folderId) => {
        deleteRelation({
          parentFolderId: from,
          childFolderId: folderId
        }, (err, result) => {
          if (err) {
            Promise.reject(err);
          } else {
            Promise.resolve(result[0]);
          }
        });
      })
    );
  },
  moveRelations: function(userId, from, to, folderIds) {
    return this.createRelations(userId, to, folderIds)
      .then(() => {
        return this.deleteRelations(userId, from, folderIds);
      })
      .then((result) => {
        return Promise.resolve(result.length);
      });
  },
  createReadable: (userId, folderId, targetUserId) => {
    return new Promise((resolve, reject) => {
      createReadable({
        userId: targetUserId,
        folderId: folderId
      }, createSingleCallback(resolve, reject));
    });
  },
  getIn: function(userId, path) {
    return resolvePath(userId, ['Home'].concat(path)).then(function(id) {
      return getInFolder({
        id: id
      }, createSingleCallback);
    });
  }
};

module.exports = folder;
