import tl from 'azure-pipelines-task-lib/task';
import axios from 'axios';
import path from 'path';
import FormData from 'form-data';
import fs from 'fs';

async function run() {
    try {
        const formData = new FormData();

        const warFilePath: string = tl.getPathInput('war-file-path', true, true);
        formData.append('war-file', fs.createReadStream(warFilePath));

        const res = await axios.create(formData.getHeaders())
            .post(`http://40.127.100.243/applications/foobar/upload`);

        tl.setResult(tl.TaskResult.Succeeded, res.statusText);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();