"use-strict";
const allLifts = [];
const liftQueue = [];

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const floors = parseInt(document.getElementById("floors").value);
  const lifts = parseInt(document.getElementById("lifts").value);

  const building = document.getElementById("container");
  building.innerHTML = "";

  if (floors < 1 || lifts < 1) {
    alert("Floors and lifts must be more than 0");
    return 0;
  }
  allLifts.length = [];

  createFloors(floors, lifts);
  createLifts(lifts);
});

function createFloors(floors, lifts) {
  const building = document.getElementById("container");
  const floorWidth = lifts * 70 + 180;
  for (let i = 1; i <= floors; i++) {
    const floorDiv = document.createElement("div");
    floorDiv.className = "floor";
    floorDiv.id = `floor-${i}`;
    floorDiv.style.width = `${floorWidth}px`;

    const floorNumberDiv = document.createElement("div");
    floorNumberDiv.className = "floor-number";
    floorNumberDiv.innerText = `Floor ${i}`;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "floor-buttons";

    const upButton = document.createElement("button");
    upButton.innerText = "Up";
    upButton.onclick = function () {
      callLift(i);
    };

    const downButton = document.createElement("button");
    downButton.innerText = "Down";
    downButton.onclick = function () {
      callLift(i);
    };

    if (i != floors) buttonsDiv.appendChild(upButton);
    if (i != 1) buttonsDiv.appendChild(downButton);

    const liftContainer = document.createElement("div");
    liftContainer.className = "lift-container";

    floorDiv.appendChild(floorNumberDiv);
    floorDiv.appendChild(buttonsDiv);
    floorDiv.appendChild(liftContainer);
    building.appendChild(floorDiv);
  }
}

function createLifts(lifts) {
  for (let j = 1; j <= lifts; j++) {
    const lift = document.createElement("div");
    lift.className = "lift";
    lift.id = `lift-${j}`;

    const doors = document.createElement("div");
    doors.className = "lift-doors";

    const leftDoor = document.createElement("div");
    leftDoor.className = "door left";

    const rightDoor = document.createElement("div");
    rightDoor.className = "door right";

    doors.appendChild(leftDoor);
    doors.appendChild(rightDoor);

    lift.appendChild(doors);

    document
      .getElementById("floor-1")
      .querySelector(".lift-container")
      .appendChild(lift);

    allLifts.push({
      id: `lift-${j}`,
      currentFloor: 1,
      busy: false,
    });
  }
}

function callLift(floor) {
  const idleLifts = allLifts.filter((lift) => !lift.busy);
  if (idleLifts.length === 0) {
    console.log(liftQueue);
    liftQueue.push(floor);
    return;
  }
  console.log(`Lift called at floor ${floor}`);

  let closestLift = null;
  let minDistance = Number.MAX_SAFE_INTEGER;

  idleLifts.forEach((lift) => {
    const distance = Math.abs(lift.currentFloor - floor);
    if (distance < minDistance) {
      minDistance = distance;
      closestLift = lift;
    }
  });

  moveLift(closestLift, floor);
}

function moveLift(lift, targetFloor) {
  const liftElement = document.getElementById(lift.id);

  const time = Math.abs(lift.currentFloor - targetFloor) * 2 * 1000;
  const floorHeight = 120;

  lift.busy = true;
  liftElement.style.transform = `translateY(-${
    (targetFloor - 1) * floorHeight
  }px)`;

  liftElement.style.transitionDuration = `${time / 1000}s`;

  setTimeout(function () {
    console.log(`${lift.id} reached floor ${targetFloor}`);
    doors(lift, targetFloor);
  }, time);
}

function doors(lift, floor) {
  const liftElement = document.getElementById(lift.id);
  const leftDoor = liftElement.querySelector(".lift-doors .door.left");
  const rightDoor = liftElement.querySelector(".lift-doors .door.right");

  leftDoor.style.width = "0%";
  rightDoor.style.width = "0%";

  setTimeout(function () {
    leftDoor.style.width = "50%";
    rightDoor.style.width = "50%";

    setTimeout(function () {
      lift.currentFloor = floor;
      lift.busy = false;
      if (liftQueue.length > 0) {
        callLift(liftQueue.shift());
      }
    }, 2500);
  }, 2500);
}
