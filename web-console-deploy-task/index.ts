import * as tl from 'azure-pipelines-task-lib/task';
import * as url from 'url';
import FormData from 'form-data';
import fs from 'fs';
import { eventNames } from 'cluster';

interface EndpointConfig {
    serverEndpointUrl: url.UrlWithStringQuery;
    username: string;
    password: string;
}

function getEndpointConfigTest(): EndpointConfig {
    return {
        serverEndpointUrl: url.parse("http://localhost:8080/"),
        username: "test",
        password: "test"
    }
}

function getEndpointConfigFromEndpointAuthorization(): EndpointConfig {
    tl.debug('getEndpointConfigFromEndpointAuthorization()')
    const serverEndpoint: string = tl.getInput('serverEndpoint', true);
    const serverEndpointAuth: tl.EndpointAuthorization = tl.getEndpointAuthorization(serverEndpoint, false);

    const serverEndpointUrl = url.parse(tl.getEndpointUrl(serverEndpoint, false));
    tl.debug(`serverEndpoint.serverEndpointUrl: ${serverEndpointUrl}`);
    const username = serverEndpointAuth['parameters']['username'];
    tl.debug(`serverEndpoint.username: ${username}`);
    const password = serverEndpointAuth['parameters']['password'];
    tl.debug(`serverEndpoint.password: ${password}`);

    return {
        serverEndpointUrl: serverEndpointUrl,
        username: username,
        password: password
    };
}

function getEndpointConfig(): EndpointConfig {
    // TODO: If clarified how to infuse serverEndpointConfig in mock config, remove this part.
    if (process.env.NODE_ENV === 'test') {
        return getEndpointConfigTest();
    } else {
        return getEndpointConfigFromEndpointAuthorization();
    }
}

function run() {
    const formData = new FormData();

    const applicationName: string = tl.getInput('application-name')
    tl.debug(`applicationName: ${applicationName}`);
    const warFilePath: string = tl.getPathInput('warFilePath', true, true);
    tl.debug(`warFilePath: ${warFilePath}`);
    const endpointConfig = getEndpointConfig();
    tl.debug(`endpointConfig (href): ${endpointConfig.serverEndpointUrl.href}`);
    tl.debug(`endpointConfig (protocol): ${endpointConfig.serverEndpointUrl.protocol}`);
    tl.debug(`endpointConfig (host): ${endpointConfig.serverEndpointUrl.host}`);
    tl.debug(`endpointConfig (hostname): ${endpointConfig.serverEndpointUrl.hostname}`);
    tl.debug(`endpointConfig (port): ${endpointConfig.serverEndpointUrl.port}`);

    // TODO: adjust to actual deployment protocol requirements.
    formData.append('war-file', fs.createReadStream(warFilePath));

    formData.submit({
        protocol: <any>endpointConfig.serverEndpointUrl.protocol,
        host: endpointConfig.serverEndpointUrl.hostname,
        path: `/applications/${applicationName}/upload`,
        port: endpointConfig.serverEndpointUrl.port,
        auth: `${endpointConfig.username}:${endpointConfig.password}`
    }, (err, res) => {
        if (err != null) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        } else {
            tl.setResult(tl.TaskResult.Succeeded, 'WAR file uploaded.');
        }
    });
}

run();