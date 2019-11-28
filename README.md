---
page_type: sample
languages:
- javascript
- nodejs
products:
- azure
- azure-storage
description: "How to upload and download blobs from Azure Blob Storage with JavaScript."
urlFragment:
- upload-download-blobs-javascript
---

# How to upload and download blobs from Azure Blob Storage with JavaScript

This repository implements the [Quickstart] sample for the [Azure Storage v10 SDK for JavaScript].

# SDK Versions
You will find the following folders: 
* **azure-sdk-for-js-storage-blob-upload-download-v10** - references Key Vault SDK v10
* **azure-sdk-for-js-storage-blob-upload-download-v12** - references Key Vault SDK v12

* To use the latest Azure SDK version [azure-sdk-for-js-storage-blob-upload-download-v12] please add the following dependency:
  * [@azure/storage-blob]
  * [@azure/abort-controller]
* For the previous Azure SDK version [azure-sdk-for-js-storage-blob-upload-download-v10] please add the following dependency:
  * [@azure/storage-blob v10.5.0]

# Prerequisites
Step 1 : Create a new general-purpose storage account to use for this tutorial. 
 
*  Go to the [Azure Portal] and log in using your Azure account. 
*  Select **New** > **Storage** > **Storage account**. 
*  Select your Subscription. 
*  For `Resource group`, create a new one and give it a unique name. 
*  Enter a name for your storage account.
*  Select the `Location` to use for your Storage Account.
*  Set `Account kind` to **StorageV2(general purpose v2)**.
*  Set `Performance` to **Standard**. 
*  Set `Replication` to **Locally-redundant storage (LRS)**.
*  Set `Secure transfer required` to **Disabled**.
*  Check **Review + create** and click **Create** to create your Storage Account. 
 
Step 2 : Copy and save keys.
 
 * After your storage account is created, click on it to open it. Select **Settings** > **Access keys** > **Key1**, copy the associated **Connection string** to the clipboard, then paste it into a text editor for later use.

## Set up

1.Clone

Clone the repository on your machine:

```bash
git clone https://github.com/Azure-Samples/azure-sdk-for-js-storage-blob-upload-download.git 
```

2.Switch Folder

Then, switch to the appropriate folder "upload-download-blobs-javascript-v10" or "upload-download-blobs-javascript-v12":

```bash
cd azure-sdk-for-js-storage-blob-upload-download-v10
```

```bash
cd azure-sdk-for-js-storage-blob-upload-download-v12
```

3.Install Dependencies

Next, install the dependencies:

    npm install

Finally, rename the file `.env.example` to `.env` and add your values for *AZURE_STORAGE_ACCOUNT_NAME* by using the name of your storage account and *AZURE_STORAGE_ACCOUNT_ACCESS_KEY* which you had copied from **Key1** and pasted in the text editor earlier.


## Running the sample

Execute the following command in a terminal to start the sample:

```bash
npm start
```

The output of this command will be the following:

```bash
Containers:
 - container-a
 - container-b
Container: "demo" is created
Blob "quickstart.txt" is uploaded
Local file "../readme.md" is uploaded
Blobs in "demo" container:
 - quickstart.txt
 - readme-stream.md
 - readme.md
Downloaded blob content: "Hello Node SDK"
Block blob "quickstart.txt" is deleted
Container "demo" is deleted
Done
```

<!-- LINKS --> 
[Quickstart]: http://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-nodejs-v10
[Azure Storage v10 SDK for JavaScript]: https://github.com/Azure/azure-storage-js
[azure-sdk-for-js-storage-blob-upload-download-v12]: https://github.com/Azure-Samples/azure-sdk-for-js-storage-blob-upload-download/tree/master/azure-sdk-for-js-storage-blob-upload-download-v12
[@azure/storage-blob]: https://www.npmjs.com/package/@azure/storage-blob
[@azure/abort-controller]: https://www.npmjs.com/package/@azure/abort-controller
[azure-sdk-for-js-storage-blob-upload-download-v10]: https://github.com/Azure-Samples/azure-sdk-for-js-storage-blob-upload-download/tree/master/azure-sdk-for-js-storage-blob-upload-download-v10
[@azure/storage-blob v10.5.0]: https://www.npmjs.com/package/@azure/storage-blob/v/10.5.0
[Azure Portal]: https://portal.azure.com