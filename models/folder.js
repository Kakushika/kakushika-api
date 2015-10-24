'use strict';

const edge = require('edge');

const create = edge.func('sql-o', () => {
  /*
      INSERT INTO Folders([name], [ownerId])
      OUTPUT INSERTED.*
      VALUES(@name, @userId)
  */
});

const createRelation = edge.func('sql-o', () => {
  /*
      INSERT INTO R_FoldersEdges([parentFolderId], [childFolderId])
      OUTPUT INSERTED.id, INSERTED.name
      VALUES(@parentFolderId, @childFolderId)
  */
});

const createReadable = edge.func('sql-o', () => {
  /*
      INSERT INTO R_FolderReadableUsers(userId, folderId)
      OUTPUT INSERTED.*
      VALUES(@userId, @folderId)
   */
});

const getInFolder = edge.func('sql-o', () => {
  /*
      SELECT f.* FROM Folders AS f
      INNER JOIN R_FoldersEdge AS fse ON fse.[childFolderId] = f.[id]
      WHERE fse.[parentFolderId] = @folderId
  */
});

const getReadablesUserInFolder = edge.func('sql-o', () => {
  /*
      SELECT u.id AS id, u.name AS name FROM R_FolderReadableUsers AS fru
      INNER JOIN Users AS u ON u.id = fru.userId
      WHERE fru.folderId = @folderId
   */
});

const getReadablesInFolder = edge.func('sql-o', () => {
  /*
      SELECT f.[id] FROM Folders AS f
      INNER JOIN R_FoldersEdge AS fse ON fse.[childFolderId] = f.[id]
      INNER JOIN R_FolderReadableUsers AS fru.[folderId] = f.[id]
      WHERE fru.[userId] = @userId
      WHERE fse.[parentFolderId] = @parentId
      WHERE f.name = @name
  */
});

const updateName = edge.func('sql-o', () => {
  /*
    UPDATE Folders AS f SET f.[name] = @folderName
    WHERE f.[id] = @folderId AND f.[ownerId] = @userId
   */
});

const deleteRelation = edge.func('sql-o', () => {
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
  let m = folderName.match(/(.+)\((\d+)\)/),
    name = folderName,
    id;
  if (m) {
    name = m[1];
    id = m[2];
  }
  return new Promise((resolve, reject) => {
    getReadablesInFolder({
      userId: userId,
      parentId: parentId,
      name: name
    }, (err, result) => {
      if (!err) {
        if (id) {
          let index = result.indexOf(id);
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
  let name = path.shift(),
    promise = resolveName(userId, null, name);
  while (!!(name = path.shift())) {
    promise.then((id) => {
      return resolveName(userId, id, name);
    });
  }
  return promise;
}

const folder = {
  create: (parentFolderId, userId, name) => {
    return new Promise((resolve, reject) => {
      create({
        userId: userId,
        name: name
      }, createSingleCallback(resolve, reject));
    }).then((folder) => {
      return new Promise((resolve, reject) => {
        createRelation({
          parentFolderId: parentFolderId,
          childFolderId: folder.id
        }).then(() => {
          resolve(folder);
        }, reject);
      });
    });
  },
  createRelations: (userId, to, folderIds) => {
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
  deleteRelations: (userId, from, folderIds) => {
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
  moveRelations: (userId, from, to, folderIds) => {
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
  getIn: (userId, path) => {
    return resolvePath(userId, ['Home'].concat(path))
      .then((id) => {
        return getInFolder({
          id: id
        }, createSingleCallback);
      });
  },
  getInFolder: (userId, folderId) => {
    return new Promise((resolve, reject) => {
      getInFolder({
        folderId: folderId
      }, createSingleCallback(resolve, reject));
    });
  },
  getReadablesUserInFolder: (userId, folderId) => {
    return new Promise((resolve, reject) => {
      getReadablesUserInFolder({
        folderId: folderId
      }, createSingleCallback(resolve, reject));
    });
  },
  rename: (userId, folderId, folderName) => {
    return new Promise((resolve, reject) => {
      updateName({
        userId,
        folderId,
        folderName
      }, createSingleCallback(resolve, reject));
    });
  }
};

module.exports = folder;
