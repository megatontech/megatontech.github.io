//level 1~5 colNo 0~54 colNo 0~7

function initPlayer() {
    var colTimerId = setInterval("drawInitFrame()", 7);
    setTimeout("clearInterval(" + colTimerId + ")", 5000);
    setTimeout("setAllGreen(1)", 5000);
    setTimeout("drawInitFrame2()", 5500);
    setTimeout("setAllGreen(1)", 10000);
    setTimeout("drawInitFrame3()", 10500);
}
function drawInitFrame() {
    var col = 1;
    var level = 1;
    var oldTime = (new Date()).getTime();
    var timemill = oldTime + 1;
    col = timemill % 54 ;
    level = timemill % 5 ;
    setColGreen(col, level);
}
function drawInitFrame2() {
    var timerId = setInterval("demoRowDisp()", 7);
    setTimeout("clearInterval(" + timerId + ")", 10000);
}
function drawInitFrame3() {
    var timerId = setInterval("demoDisp()", 1);
    setTimeout("clearInterval(" + timerId + ")", 600000);
}
function demoRowDisp() {
    var row = 1;
    var level = 1;
    var oldTime = (new Date()).getTime();
    var timemill = oldTime + 1;
    row = timemill % 7;
    level = timemill % 5;
    setRowGreen(row, level);
}
function demoDisp() {
    var col = 0;
    var row = 0;
    var level = 1;
    var oldTime = (new Date()).getTime();
    var timemill = oldTime + 1;
    col = timemill % 54 ;
    row = timemill % 7 ;
    level = timemill % 5 ;
    setRectGreen(row, col, level);
}
function setAllGreen(level) {
    //set all blocks
    var color = setLevelColor(level);
    $(".js-calendar-graph-svg g g").find("rect").each(function () { this.setAttribute("fill", color) });
}
function setColGreen(colNo, level) {
    //set selected Col
    if (colNo < 0 || colNo > 54) { colNo = 0; console.log("colNo is not valid"); }
    var col = $(".js-calendar-graph-svg g g")[colNo];
    var color = setLevelColor(level);
    for (i = 0; i < col.children.length; i++) {
        col.children[i].setAttribute("fill", color);
    }
}
function setRowGreen(rowNo, level) {
    //set selected row
    if (rowNo < 0 || rowNo > 7) { colNo = 0; console.log("rowNo is not valid"); }
    var row = $(".js-calendar-graph-svg g g");
    var color = setLevelColor(level);
    for (i = 0; i < row.length-1; i++) {
        row[i].children[rowNo].setAttribute("fill", color);
    }
}
function setRectGreen(rowNo, colNo, level) {
    //set selected rect
    if (colNo < 0 || colNo > 54) { colNo = 0; console.log("colNo is not valid"); }
    var col = $(".js-calendar-graph-svg g g")[colNo];
    var color = setLevelColor(level);
    if (rowNo >= 0 && rowNo < col.children.length) {
        col.children[rowNo].setAttribute("fill", color);
    } else { console.log("rowNo is not valid"); }
}
function setLevelColor(level) {
    //translate color
    var color = "#eee";
    switch (level) {
        case 1:
            color = "#eee";
            break;
        case 2:
            color = "#d6e685";
            break;
        case 3:
            color = "#8cc665";
            break;
        case 4:
            color = "#44a340";
            break;
        case 5:
            color = "#1e6823";
            break;
        default:
            color = "#eee";
            break;
    }
    return color;
}