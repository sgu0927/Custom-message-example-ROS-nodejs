#!/usr/bin/env node

'use strict';
// Require rosnodejs itself
const rosnodejs = require('rosnodejs');
const nh = rosnodejs.nh;
const std_msgs = rosnodejs.require('std_msgs').msg;
const custom_msgs = rosnodejs.require('custom_topic').msg;

if (require.main === module) {
  console.log("main start");
  rosnodejs.initNode('my_node')
    .then((nh) => {
      const pub = nh.advertise('/my_topic', custom_msgs.my_msg);
      const msg = new custom_msgs.my_msg();
      msg.name = "Seo GyeongUk";
      msg.age = 25;
      setInterval(() => {
        pub.publish(msg);
        rosnodejs.log.info('Hi my name is : [' + msg.name + ']');
        rosnodejs.log.info('And I\'m : [' + msg.age + ' years old]');
      }, 1000);
    });
}
