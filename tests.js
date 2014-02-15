/**
 * Piwik - Open source web analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 */

var page = require('webpage').create();
var fs = require('fs');
var resultDir = 'specs/result';

page.onConsoleMessage = function(message) {

    if (message && 0 === (''+message).indexOf('jasmine')) {
        console.log(message.substr('jasmine'.length));
    }
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }

    console.error(msgStack.join('\n'));
};

page.onInitialized = function() {
    page.evaluate(function() {
        // Workaround for https://github.com/ariya/phantomjs/issues/10647 (Within PhantomJS, onLine is always false)
        var fakeNavigator = {};
        for (var i in navigator) {
            fakeNavigator[i] = navigator[i];
        }
        fakeNavigator.onLine = true;
        navigator = fakeNavigator;
    });
};

function injectJasmine(page)
{
    page.injectJs('specs/jasmine/jasmine.js');
    page.injectJs('specs/jasmine/jasmine-html.js');
    page.injectJs('specs/jasmine/console.js');
    page.injectJs('specs/jasmine/boot.js');
}

function loadTests(page)
{
    phantom.injectJs("specs/jasmine/utils/loader.js");

    var testFiles = utils.loader.getTestFiles();

    for (var index = 0; index < testFiles.length; index++) {
        page.injectJs(testFiles[index]);
    }
}

function runTests(page)
{
    page.evaluate(function () {

        var ConsoleReporter = jasmineRequire.ConsoleReporter();
        var options = {
            timer: new jasmine.Timer,
            print: function (message) {
                console.log.apply(console, ['jasmine' + message])
            }
        };
        var consoleReporter = new ConsoleReporter(options);
        jasmine.getEnv().addReporter(consoleReporter);

        jasmine.getEnv().execute();
    });
}

function generateTestResultsOnceFinished(page)
{
    phantom.injectJs("specs/jasmine/utils/core.js");
    utils.core.waitfor(function() {
        // wait for this to be true
        return page.evaluate(function() {
            return jsApiReporter.finished;
        });
    }, function() {
        // once done...
        var specs = page.evaluate(function(){
            return jsApiReporter.specs()
        });

        var passed = true;
        for (var index in specs) {
            if (0 !== specs[index].failedExpectations.length) {
                passed = false;
            }
        }

        // Return the correct exit status. '0' only if all the tests passed
        phantom.exit(passed ? 0 : 1);
    }, function() {
        // or, once it timesout...
        phantom.exit(1);
    });
}

page.open('http://127.0.0.1:8061/index.html', function (status) {
    if ('success' !== status) {
        console.error('Failed to load page');
        phantom.exit(1);
        return;
    }

    injectJasmine(page);
    loadTests(page);
    runTests(page);
    generateTestResultsOnceFinished(page);
});