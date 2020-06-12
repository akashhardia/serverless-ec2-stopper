# EC2 Instance Stopper Using Serverless

## Summary
A simple nodeapp to Stop EC2 instances having a certain name & that are running for more than 2 hours. It runs everyday to perform this.

## About
We often run heavy EC2 instances for small tasks and they are left running and cost us money.

So, this AWS lambda serverless stack was made. It currently runs the stopEC2 function in order to terminate instances having a specified name. It runs every 24 hours. You can change that by editing - schedule: rate(24 hours) in serverless.yaml.

### Optional:
You can also provide inputs while running serverless deploy command:

Add these in your functions in serverless.yml file as needed
```
  events:
      - http:
          path: start
          method: get
          request:
            application/json: '{ "instanceId" : "$input.params(''instanceId'')" }':
          cors: true

  events:
      - http:
          path: stop
          method: get
          request:
            application/json: '{ "instanceId" : "$input.params(''instanceId'')" }'
          cors: true
```

Once you hit serverless deploy command, you will get the API routes printed on terminal. You can hit following routes:

  * Start the instance: /start?instanceId=your_rds_instance_id
  * Stop the instance: /stop?instanceId=your_rds_instance_id

    You can get the value in code via: `event.instanceId`

## Running the app
## Pre-requisites
Nodejs v10+ should be installed.
AWS account with admin IAM access. Please check your IAM user has AdministratorAccess policy assigned.
serverless should be installed using ``npm i serverless -g``
## Configure Serverless
After installing serverless, you can configure serverless with below command:

``serverless config credentials --provider aws --key <your_access_key> --secret <your_access_key_secret>``

Note: If you have multiple AWS profiles in your local machine, please open ~/.aws/config file and check which profile you want to use with --profile flag in above command.

or you can simply select a profile terminal session before running anything like this:
``export AWS_PROFILE=akash``

## Deploy Lambda methods
Run the below commands to package the methods and deploy the stack supporting our lambda function:

```
npm i
serverless deploy
```

## Billing considerations
Although the lambda execution charges are really less, but do consider that it would charge something to host these lambda functions per month. As per my understanding, it should not cost more than $ 2.00 / month in any AWS region even with cron rate set to once per 10 minutes. But you can make sure to check the resources created by the cloudformation stack in your AWS console.

## Serverless Framework Helpful commands

  * To create a service:       (scratch)

      `sls create --template aws-nodejs --path myService`

  * To run locally:

      `serverless invoke local --function functionName`

  * To deploy function:

      `serverless deploy`
