---
page_type: sample
name: "Using the Azure Storage JavaScript SDK V10"
description: "Quickstart sample for the Azure Storage v10 SDK for JavaScript."
languages:
- javascript
- nodejs
products:
- azure
- azure-storage
---

# Quickstart - JavaScript SDK v10 for Azure Storage

This repository implements the [Quickstart](http://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-nodejs-v10) sample for the [Azure Storage v10 SDK for JavaScript](https://github.com/Azure/azure-storage-js).

# SDK Versions
You will find the following folders: azure-storage-js-v10-quickstart-v10, which references the version 10.0 SDK and azure-storage-js-v10-quickstart-v12, which uses the 12.0 version of the SDK.
* To use the latest Azure SDK version [azure-storage-js-v10-quickstart-v12](./azure-storage-js-v10-quickstart-v12) please add the following dependency:
  * [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)
  * [@azure/abort-controller](https://www.npmjs.com/package/@azure/abort-controller)
* For the previous Azure SDK version [azure-storage-js-v10-quickstart-v10](./azure-storage-js-v10-quickstart-v10) please add the following dependency:
  * [@azure/storage-blob v10.5.0](https://www.npmjs.com/package/@azure/storage-blob/v/10.5.0)

# Prerequisites
Step 1 : Create a new general-purpose storage account to use for this tutorial. 
 
*  Go to the [Azure Portal](https://portal.azure.com) and log in using your Azure account. 
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
git clone https://github.com/Azure-Samples/azure-storage-js-v10-quickstart.git 
```

2.Switch Folder

Then, switch to the appropriate folder "azure-storage-js-v10-quickstart-v10" and "azure-storage-js-v10-quickstart-v12":

```bash
cd azure-storage-js-v10-quickstart-v10
```

```bash
cd azure-storage-js-v10-quickstart-v12
```

3.Install Dependencies

Next, install the dependencies:

    npm install

Finally, rename the file `.env.example` to `.env` and add your values for *AZURE_STORAGE_ACCOUNT_NAME* by using the name of your storage account and *AZURE_STORAGE_ACCOUNT_ACCESS_KEY* which you had copied from **key1** and pasted in the text editor earlier.


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
Local file "./readme.md" is uploaded
Blobs in "demo" container:
 - quickstart.txt
 - readme-stream.md
 - readme.md
Downloaded blob content: "Hello Node SDK"
Block blob "quickstart.txt" is deleted
Container "demo" is deleted
Done
```
