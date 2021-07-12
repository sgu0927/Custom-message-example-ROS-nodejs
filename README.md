## How to generate ROS Node using JS

---

### 1. rosnodejs

```jsx
#!/usr/bin/env node

'use strict';
// Require rosnodejs itself
const rosnodejs = require('rosnodejs');
const nh = rosnodejs.nh;
...
```

`'use strict';`는 JavaScript semantics에 몇가지 변경이 일어나게 한다. 기존에는 무시되던 에러들을 throwing하고 JavaScript엔진의 최적화 작업을 어렵게 만드는 실수를 바로잡는다. rosnodejs를 이용하기 위해서 설치된 rosnodejs 모듈을 require을 통해 가져온다. ROS 시스템과 통신을 위한 노드 핸들(`nh`)을 선언한다. 

```jsx
rosnodejs.initNode('my_node')
	.then((nodeHandle) => {
	  // do stuff
});
```

rosnodejs의 `initNode`함수는 ROS Master로의 connection이 established되었을 때 resolve되는 promise를 return한다. 따라서 Promise 객체의 후속 처리 메소드인 then, catch를 통해 비동기 처리 결과 또는 에러 메세지를 전달받아 처리한다.

### 2. Periodic task

```jsx
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
```

custom message를 periodic하게 publish하기위해 `setInterval`함수를 통해 일정한 시간 간격으로 작업을 수행한다. 첫번째 인자는 일정한 시간 간격으로 반복 실행하고자 하는 코드 정보이고, 두 번째는 시간 간격으로 ms단위로 설정합니다. `clearInterval` 함수를 사용하여 지정된 작업 실행 후 다음 작업 스케줄을 중지할 수 있다. 예제에서는 msg를 1초마다 publish하고 logging하도록 했다.

### 3. Topic publish

```jsx
nh.advertise('topic name', message type, options); // nh는 노드 핸들러
```

rosnodejs의 advertise의 함수 형태이다. advertise함수를 통해 마스터가 해당 토픽의 메세지를 subscribe하고자 하는 노드에게 그 토픽으로 publish하고자 하는 노드가 있음을 전달한다.

```jsx
const custom_msgs = rosnodejs.require('custom_topic').msg;
```

Message files를 require할 때는 가져온 rosnodejs모듈을 통해서 해야한다. Message file을 가져올 때 의 올바른 경로의 require가 중요하다. 현재 msg파일은 custom_topic/msg안에 있다. 잘못된 경로로 require하면 Error: Unable to find message package <틀린 모둘명> from CMAKE_PREFIX_PATH 오류가 발생한다.

Custom message를 사용할 때는 build를 위해 각 파일을 수정해야 한다.

- CMakeList.txt

```jsx
find_package(
    catkin REQUIRED COMPONENTS
    message_generation // 추가
    std_msgs // Or other packages containing msgs   
)
add_message_files( // 메세지를 추가할 것
  FILES
  my_msg.msg // 추가한 custom message 파일
)
generate_messages(
  DEPENDENCIES
  std_msgs  // Or other packages containing msgs
)
catkin_package(
    CATKIN_DEPENDS
    message_runtime // 추가
    std_msgs // Or other packages containing msgs
)
```

이미 설치된 패키지를 찾아 그 안에 정의된 함수, 매크로 그리고 변수를 사용할 수 있게 해주는 find_package 설정에서 message_generation을 추가해야 한다. catkin build를 위한 catkin_package 설정에서 message_runtime도 추가해주어야 한다.

- package.xml

```xml
<build_depend>message_generation</build_depend>
<build_export_depend>message_runtime</build_export_depend>
<exec_depend>message_runtime</exec_depend>
```

message를 generate하고 run한다는 의존성을 추가한다. 여기서 사용자 custom message의 타입에 맞게 의존성을 추가해줄 수 있다.

```xml
// example: std_msgs 타입과 geometry_msgs 타입이 필요한 경우
<build_depend>std_msgs</build_depend>
<build_depend>geometry_msgs</build_depend>
<build_export_depend>std_msgs</build_export_depend>
<build_export_depend>geometry_msgs</build_export_depend>
<exec_depend>std_msgs</exec_depend>
<exec_depend>geometry_msgs</exec_depend>
```

메세지, 서비스, 액션은 std_msgs처럼 다른 ROS 메세지에서 정의된 자료형을 사용할 수 있다. 메세지 의존성을 표시할 때는 <depend> 태그가 적절하다.

```xml
// example: std_msgs, 액션 이용을 위해 actionlib_msgs 이용
<depend>std_msgs</depend>
<depend>actionlib_msgs</depend>
```

### 4. Topic subscribe

```jsx
...
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
```

subscribe는 토픽명, 메세지 타입, callback함수를 인자로 받는다. advertise를 통해 알게된 topic의 publisher로부터 메세지를 받아온다. 예제에서는 받아온 메세지를 logging했다.

### 5. Example (Talker & Listener)

string name, int32 age를 갖는 custom message를 생성하고 publish, subscribe를 통해 통신한 예제이다.
![talker](https://user-images.githubusercontent.com/26399303/125231824-6e0c0800-e316-11eb-904f-1359ac475f60.png)
![listener](https://user-images.githubusercontent.com/26399303/125231837-706e6200-e316-11eb-8d24-0c13c47eae18.png)


