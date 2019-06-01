import assert = require('assert');
import path = require('path');
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('NodeTool Suite', function () {
    this.timeout(60000);

    before(() => { });
    after(() => { });

    it('does stuff', (done: MochaDone) => {
        this.timeout(5000);

        let tp: string = path.join(__dirname, 'application_upload_test.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert(tr.succeeded);
        done();
    });
});