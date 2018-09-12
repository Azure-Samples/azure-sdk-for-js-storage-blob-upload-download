// tslint:disable:no-console
const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    SharedKeyCredential,
    StorageURL,
    uploadStreamToBlockBlob,
    uploadFileToBlockBlob
} = require('@azure/storage-blob');

const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;

const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
const pipeline = StorageURL.newPipeline(credentials);
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline);

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

async function listContainers() {

    let response;
    let marker;
    let containers = [];

    const aborter = Aborter.timeout(30 * ONE_MINUTE);

    do {
        response = await serviceURL.listContainersSegment(aborter.withTimeout(ONE_MINUTE), marker);
        marker = response.marker;
        containers = containers.concat(response.containerItems);
    } while (marker);

    return containers;
}

async function createContainer(name) {
    const url = ContainerURL.fromServiceURL(serviceURL, name);
    return await url.create(Aborter.timeout(ONE_MINUTE));
}

async function uploadString(containerName, blobName, content) {
    const url = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(url, blobName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
    return await blockBlobURL.upload(Aborter.timeout(ONE_MINUTE), content, content.length);
}

async function uploadLocalFile(containerName, filePath) {

    filePath = path.resolve(filePath);

    const fileName = path.win32.basename(filePath);

    const url = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(url, fileName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

    return await uploadFileToBlockBlob(Aborter.timeout(ONE_MINUTE), filePath, blockBlobURL);
}

async function uploadStream(containerName, filePath) {

    filePath = path.resolve(filePath);

    const fileName = path.win32.basename(filePath).replace('.md', '-stream.md');

    const url = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(url, fileName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

    const stream = fs.createReadStream(filePath, {
      highWaterMark: FOUR_MEGABYTES,
    });

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };

    return await uploadStreamToBlockBlob(
                    Aborter.timeout(ONE_MINUTE), 
                    stream, 
                    blockBlobURL, 
                    uploadOptions.bufferSize, 
                    uploadOptions.maxBuffers);
}

async function listBlobs(containerName) {

    let response;
    let marker;
    let blobs = [];

    do {
        const url = ContainerURL.fromServiceURL(serviceURL, containerName);
        response = await url.listBlobFlatSegment(Aborter.timeout(ONE_MINUTE));
        marker = response.marker;
        blobs = blobs.concat(response.segment.blobItems);
    } while (marker);

    return blobs;
}

async function downloadBlob(containerName, blobName) {
    const url = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(url, blobName);
    return await blobURL.download(Aborter.timeout(ONE_MINUTE), 0);
}

async function deleteBlob(containerName, blobName) {
    const url = ContainerURL.fromServiceURL(serviceURL, containerName);
    const blobURL = BlobURL.fromContainerURL(url, blobName);
    return await blobURL.delete(Aborter.timeout(ONE_MINUTE));
}

async function deleteContainer(name) {
    const url = ContainerURL.fromServiceURL(serviceURL, name);
    return await url.delete(Aborter.timeout(ONE_MINUTE));
}

async function execute() {

    const containerName = "demo";
    const blobName = "quickstart.txt";
    const content = "hello!";
    const localFilePath = "./readme.md";

    console.log("Containers:");
    const containers = await listContainers();
    containers.forEach((container) => console.log(" - " + container.name));

    const containerDoesNotExist = containers.findIndex((container) => container.name === containerName) === -1;
    if (containerDoesNotExist) {
        await createContainer(containerName);
        console.log(`Container: "${containerName}" is created`);
    }

    await uploadString(containerName, blobName, content);
    console.log(`Blob "${blobName}" is uploaded`);
    
    await uploadLocalFile(containerName, localFilePath);
    console.log(`Local file "${localFilePath}" is uploaded`);

    await uploadStream(containerName, localFilePath);
    console.log(`Local file "${localFilePath}" is uploaded as a stream`);

    console.log(`Blobs in "${containerName}" container:`);
    const blobs = await listBlobs(containerName);
    blobs.forEach((blob) => console.log(" - " + blob.name));

    const downloadResponse = await downloadBlob(containerName, blobName);
    const downloadedContent = downloadResponse.readableStreamBody.read(content.length).toString();
    console.log(`Downloaded blob content: "${downloadedContent}"`);

    await deleteBlob(containerName, blobName);
    console.log(`Block blob "${blobName}" is deleted`);
    
    await deleteContainer(containerName);
    console.log(`Container "${containerName}" is deleted`);
}

execute().then(() => console.log("Done")).catch((e) => console.log(e));
