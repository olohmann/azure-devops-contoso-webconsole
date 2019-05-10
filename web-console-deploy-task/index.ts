import tl from 'azure-pipelines-task-lib/task';
import axios from 'axios';
import path from 'path';

async function run() {
    try {
        const warFilePath: string = tl.getPathInput('war-file-path', true, true);
        const warFileBaseName: string = path.basename(warFilePath);
        axios.post(`https://tfstate39392.blob.core.windows.net/sample/${warFileBaseName}`);
        
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();