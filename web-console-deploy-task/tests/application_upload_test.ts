import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import fs = require('fs');
import { tmpNameSync } from 'tmp';

const taskPath = path.join(__dirname, '..', 'index.js');
const tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

const tmpFilePath = tmpNameSync();
console.log("tmpFilePath: ", tmpFilePath);

fs.writeFileSync(tmpFilePath, 'war-file-dummy-data');

tr.setInput('warFilePath', tmpFilePath);
const a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    checkPath: {
        [tmpFilePath]: true
    }
};

tr.setAnswers(a);
tr.run();
