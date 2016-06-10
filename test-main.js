var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Normalize a path to RequireJS module name.
var pathToModule = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    // Example of using shim to load non AMD libraries (such as Backbone, jquery).
    shim: {
        'legacy-library': {
            deps: [],
            exports: 'global'
        }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
