/*
 * Library for storing and editing data
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module (to be exported)
var lib = {};
lib.baseDir = path.join(__dirname,'/../.data/');
lib.create = function(directory, file, data, callback){
    fs.open(lib.baseDir + directory + "/" + file + ".json", "wx", function(err, fileDescriptor){
        if (!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, function(err){
                if (!err){
                    fs.close(fileDescriptor, function(err){
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Error closing new file");
                        }
                    })
                } else {
                    callback("Error writing to new file.")
                }
            });
        } else {
            callback("Error creating file, it may exists.")
        }
    });
};

lib.read = function(directory, file, callback){
    fs.readFile(lib.baseDir + directory + '/' + file + '.json', 'utf8', function(err, data){
        callback(err,data);
    });
};

lib.update = function(directory, file, data, callback){
    fs.open(lib.baseDir + directory + '/' + file + '.json', 'r+', function(err, fileDescriptor){
        if (!err && fileDescriptor){
            fs.truncate(fileDescriptor, function(err){
                if (!err) {
                    var stringData = JSON.stringify(data);
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if (!err) {
                            fs.close(fileDescriptor, function(err){
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback('error closing existing file')
                                }
                            });
                        } else {
                            callback('error writing existing file')
                        }
                    });
                } else {
                    callback('error truncating existing file')
                }
            });
        } else {
            callback('Could not open the file for updating, it may not exist yet')
        }
    });
};

lib.delete = function(directory, file, callback) {
    fs.unlink(lib.baseDir+directory+'/'+file+'.json', function(err){
        if (!err) {
            callback(false);
        } else {
            callback('error deleting file')
        }
    });
};
// Export the module
module.exports = lib;