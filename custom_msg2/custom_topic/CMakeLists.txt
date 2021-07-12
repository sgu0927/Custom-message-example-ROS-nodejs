cmake_minimum_required(VERSION 3.0.2)
project(custom_topic)

## Find catkin macros and libraries
find_package(
    catkin REQUIRED COMPONENTS
    message_generation
    std_msgs    
)

## Generate messages in the 'msg' folder
add_message_files(
  FILES
  my_msg.msg
)

## Generate added messages and services with any dependencies listed here
generate_messages(
  DEPENDENCIES
  std_msgs  # Or other packages containing msgs
)

catkin_package(
    CATKIN_DEPENDS
    message_runtime
    std_msgs
)

include_directories(
  # include
  # ${catkin_INCLUDE_DIRS}
)
