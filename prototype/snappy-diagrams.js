var cellWidth = 150;
var cellHeight = 50;
var cellSpacing = 10;

var colCount = 7;
var rowCount = 11;

cellPoint = function(cellX, cellY){
  if(cellX > (colCount - 1)){ throw "cellX out of bounds" };
  if(cellY > (rowCount - 1)){ throw "cellY out of bounds" };

  var posX = (cellX * cellWidth) + (cellX * cellSpacing);
  var posY = (cellY * cellHeight) + (cellY * cellSpacing);
  return { x: posX, y: posY };
}

anchorPoint = function(cellPoint, anchor){
  switch (anchor) {
    case 'top-center':
      return { x: (cellPoint.x + (cellWidth / 2)), y: cellPoint.y };
    case 'top-right':
      return { x: (cellPoint.x + cellWidth), y: cellPoint.y };
    case 'middle-left':
      return { x: cellPoint.x, y: (cellPoint.y + (cellHeight / 2)) };
    case 'middle-right':
      return { x: (cellPoint.x + cellWidth), y: (cellPoint.y + (cellHeight / 2)) };
    case 'bottom-left':
      return { x: cellPoint.x, y: (cellPoint.y + cellHeight) };
    case 'bottom-center':
      return { x: (cellPoint.x + (cellWidth / 2)), y: (cellPoint.y + cellHeight) };
    case 'bottom-right':
      return { x: (cellPoint.x + cellWidth), y: (cellPoint.y + cellHeight) };
    case 'top-left':
    default:
      return cellPoint;
  };
}

snappyBox = function(cellPoint, className){
  attrs = {};
  if(className) attrs.class = className;
  return { point: cellPoint, element: window.snap.rect(cellPoint.x, cellPoint.y, cellWidth, cellHeight, 10).attr(attrs) };
};

snappyCircle = function(cellPoint, radius){
  return { point: cellPoint, element: window.snap.circle(cellPoint.x + (cellWidth / 2), cellPoint.y + (cellHeight / 2), radius) };
};

snappyLine = function(sourceAnchor, sourcePoint, targetAnchor, targetPoint, markerStart, markerEnd){
  var startPoint = anchorPoint(sourcePoint, sourceAnchor);
  var endPoint = anchorPoint(targetPoint, targetAnchor);
  var line = window.snap.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  line.attr({ markerStart: markerStart, markerEnd: markerEnd });
}

snappyArrow = function(sourceAnchor, sourcePoint, targetAnchor, targetPoint){
  snappyLine(sourceAnchor, sourcePoint, targetAnchor, targetPoint, null, window.arrowEndMarker)
}

snappyDArrow = function(sourceAnchor, sourcePoint, targetAnchor, targetPoint){
  snappyLine(sourceAnchor, sourcePoint, targetAnchor, targetPoint, window.arrowStartMarker, window.arrowEndMarker)
}


var lastCellPoint = cellPoint(colCount - 1, rowCount - 1);
window.snap = Snap(lastCellPoint.x + cellWidth, lastCellPoint.y + cellHeight);

var arrowPathString = "M 0 2 L 10 5 L 0 8 z";
window.arrowStartMarker = window.snap.path(arrowPathString).transform('r180').marker(0, 0, 10, 10, 1, 5);
window.arrowEndMarker = window.snap.path(arrowPathString).marker(0, 0, 10, 10, 9, 5);

// Test

var box1 = snappyBox(cellPoint(0,0)).point;
var box2 = snappyBox(cellPoint(3,0)).point;
var box3 = snappyBox(cellPoint(6,0)).point;
var box4 = snappyBox(cellPoint(0,5)).point;
var box5 = snappyBox(cellPoint(3,5)).point;
var box6 = snappyBox(cellPoint(6,5)).point;
var box7 = snappyBox(cellPoint(0,10)).point;
var box8 = snappyBox(cellPoint(3,10)).point;
var box9 = snappyBox(cellPoint(6,10)).point;

snappyBox(cellPoint(1,0));
snappyBox(cellPoint(0,1));
snappyBox(cellPoint(1,1), 'orphan');

snappyDArrow('bottom-right', box1, 'top-left', box5);
snappyDArrow('bottom-center', box2, 'top-center', box5);
snappyDArrow('bottom-left', box3, 'top-right', box5);
snappyDArrow('middle-right', box4, 'middle-left', box5);
snappyDArrow('middle-left', box6, 'middle-right', box5);
snappyDArrow('top-right', box7, 'bottom-left', box5);
snappyDArrow('top-center', box8, 'bottom-center', box5);
snappyDArrow('top-left', box9, 'bottom-right', box5);
