/*jshint unused:false*/
// Note: ttls are in seconds
var cacheManager = require('../');
var es6Promise = require('es6-promise').Promise;
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10, promiseDependency: es6Promise});
var ttl; //Can't use a different ttl per set() call with memory cache

function getUser(id) {
    return new es6Promise(function (resolve, reject) {
        setTimeout(function() {
            console.log("Fetching user from slow database.");
            resolve({id: id, name: 'Bob'});
        }, 100);
    });
}

var userId = 123;

//
// wrap() example
//

function getCachedUser(id) {
    return memoryCache.wrap(id, function () {
        return getUser(id);
    });
}

getCachedUser(userId)
    .then(function(user) {
    // First time fetches the user from the (fake) database:
    console.log(user);

    getCachedUser(userId)
        .then(function(user) {
        // Second time fetches from cache.
        console.log(user);
        });
    });
