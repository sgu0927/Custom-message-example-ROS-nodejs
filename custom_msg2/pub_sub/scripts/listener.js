#!/usr/bin/env node

'use strict';
// Require rosnodejs itself
const rosnodejs = require('rosnodejs');
const nh = rosnodejs.nh;
const std_msgs = rosnodejs.require('std_msgs').msg;
const custom_msgs = rosnodejs.require('custom_topic').msg;

if (require.main === module) {
  console.log("main start");
  rosnodejs.initNode('listener_node')
    .then((nh) => {
      let sub = nh.subscribe('/my_topic', custom_msgs.my_msg, (info) => {
        rosnodejs.log.info('I heard his name is: [' + info.name + ']');
        rosnodejs.log.info('I heard his age is: [' + info.age + ']');
      });
    });
}