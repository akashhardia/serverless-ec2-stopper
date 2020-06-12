'use strict';

// This Lambda function stops instances having name "XYZ" that
// are running for more than 2 hours
const AWS = require("aws-sdk");
const moment = require('moment');

AWS.config.update( { region:'us-east-1' } );
const ec2 = new AWS.EC2( { apiVersion: '2016-11-15' } );

const listParams = () => ({ Filters: [
    { Name: "tag:Name", Values: [ "XYZ" ] },                  // having name XYZ
    { Name: "instance-state-code", Values: [ '16' ] }         // in running state
  ]});

const terminateInstances = (event, callback) => {
  ec2.describeInstances(listParams(), (err, data) => {
    if (err) callback(err); // an error occurred
    else {
      let InstanceIds;
      const instances = data.Reservations && data.Reservations[0] && data.Reservations[0].Instances;
      if (instances && instances.length && (InstanceIds = filterInstances(instances)).length > 0) {
        console.log('Terminating instances::: ', InstanceIds);
        return ec2.terminateInstances( { InstanceIds }, (err, data) => {
          if (err) callback(err);           // an error occurred
          else     callback(null, data);    // successfully initiated termination
        })
      }
      callback(null, 'No instances found that are running for 2 hours!!');
    }
  });
}

const filterInstances = (instances) => {
  return instances.filter(function(i) {
    const launchTime = moment(i.LaunchTime)
    if ( moment().diff(launchTime, 'hours') >= 2 ) return i     // running for more than 2 hours
  }).map(i => i.InstanceId);
}

// handler methods
module.exports.instanceTerminator = (event, context, callback) => terminateInstances(event, callback);
