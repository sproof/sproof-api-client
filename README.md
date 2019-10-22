# sproof-api-client

This module provides an API for registering, revoking and verifying data with an existing sproof account.

## Start

### 1. Create a premium account

Create a account on https://app.sproof.io.

### 2. Get the sproof-client-api

``git clone https://gitlab.com/sproof/sproof-api-client.git`` 

### 3. Create config and theme

Copy the ```exampleTheme.js``` and ```exampleConfig.js``` to ```theme.js``` and ```config.js```. 

Add your sproof code to ``data/config.js`` You can download your sproof code in the settings page.

For production change the chainId from ``3`` to ``1``. Please note, that the chainId 1 is the mainnet. Before you can use sproof on the mainnet you will need to choose a plan on the web app.  

### 4. Modify the verifier theme 

You will find a ``exampleTheme.js`` file in the ``data`` folder. You can adjust colors and buttons styles. Save it under ```theme.js```
 

### 5. Modify the text of the verifier

You will find the files ```exampleEn.js``` and ``exampleDe.js`` in the ``data`` folder. Save them under ``en.js`` and ``de.js`` to adjust the translations.



## Run

Run: 

```docker-compose up --build```

to start this module. It will create a API and host the verifier theme on port 6001. The docker file will build the web verifier only on the first start, to be sure to add ``--build`` if you change the theme.
 
 By default it will not rebuild the UI. If you want to rebuild the UI, so that it uses your custom theme you need to uncomment the line 
 
 ```command: sh ./scripts/buildUIAndStart.sh``` 
 
 in the docker-compose file.
 
 

## Access code

The access code is a token, which secures your API endpoint. It will be generated and stored under ```data/accessCode.json``` and logged. This accessCode is necessery to send external API requests to the sproof client. 


Visit https://sproof-docs.readthedocs.io/en/latest/sproof-api-client.html for the documentation for the API endpoint.



