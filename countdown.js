/*优化屏幕自适应*/
//画布的宽
var WINDOW_WIDTH = document.documentElement.clientWidth;
//画布的高
var WINDOW_HEIGHT = document.documentElement.clientHeight;
//小圆的半径
var radius = Math.round(WINDOW_WIDTH*4/5/108)-1;//画布宽4/5，共108个小球
//数字距离画布的上边距
var margin_top = Math.round(WINDOW_HEIGHT/5);
//第一个数字距离画布的左边距
var margn_left = Math.round(WINDOW_WIDTH/10);//左右边距共边距为1/5
//倒计时时间
/*var endTime = new Date();
endTime.setTime(endTime.getTime()+3600*1000);*/
//显示的时间
var curShowTimeSeconds = 0;
//存储小球的数组
var balls = [];
//小球的颜色
var colors = ["#33B5E5","#0099CC", "#AA66CC", "#9933CC", "#99CC00", "669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"]

window.onload = function () {
	var canvas = document.getElementById('canvas');
	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;
	var context = canvas.getContext("2d");

	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(function () {
		render(context);
		update();
	}, 50);
}
//计算倒计时距离现在的时间
function getCurrentShowTimeSeconds() {
	var curTime = new Date();
	var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
	//var ret = endTime.getTime()-curTime.getTime();
	//ret = Math.round(ret/1000);

	return ret>=0?ret:0; 
}
//更新时间
function update() {
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
	var nextHours = parseInt(nextShowTimeSeconds/3600);
	var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds = nextShowTimeSeconds%60;	
	var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds = curShowTimeSeconds%60;
	if (nextSeconds != curSeconds) {
		if (parseInt(curHours/10) != parseInt(nextHours/10)) {
			addBalls(margn_left+0, margin_top, parseInt(curHours/10));
		}
		if (parseInt(curHours%10) != parseInt(nextHours%10)) {
			addBalls(margn_left+15*(radius+1), margin_top, parseInt(curHours%10));
		}
		if (parseInt(curMinutes/10) != parseInt(nextMinutes/10)) {
			addBalls(margn_left+39*(radius+1), margin_top, parseInt(curMinutes/10));
		}
		if (parseInt(curMinutes%10) != parseInt(nextMinutes%10)) {
			addBalls(margn_left+54*(radius+1), margin_top, parseInt(curMinutes%10));
		}
		if (parseInt(curSeconds/10) != parseInt(nextSeconds/10)) {
			addBalls(margn_left+78*(radius+1), margin_top, parseInt(curSeconds/10));
		}
		if (parseInt(curSeconds%10) != parseInt(nextSeconds%10)) {
			addBalls(margn_left+93*(radius+1), margin_top, parseInt(curSeconds%10));
		}
		curShowTimeSeconds = nextShowTimeSeconds;
	}
	updateBalls();
}
//更新小球的运动效果
function updateBalls() {
	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;

		if (balls[i].y >= WINDOW_HEIGHT-radius) {
			balls[i].y = WINDOW_HEIGHT-radius;
			balls[i].vy = -balls[i].vy*0.75;
		}
	}
	var cnt = 0;
	for (var i = 0; i < balls.length; i++) {
		if(balls[i].x+radius>0 && balls[i].x-radius<WINDOW_WIDTH) {
			balls[cnt++] = balls[i];
		}
	}
	while(balls.length > Math.min(300,cnt)){
		balls.pop();
	}
}
//添加小球
function addBalls(x, y, num) {
	for (var i = 0; i < digit[num].length; i++) {//行
		for (var j = 0; j < digit[num][i].length; j++) {//列
			if (digit[num][i][j] == 1) {
				var aBall = {
					x: x+j*2*(radius+1)+(radius+1),
					y: y+i*2*(radius+1)+(radius+1),
					g: 1.5+Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4,//速度为+4|-4
					vy: -5,
					color: colors[Math.floor(Math.random()*colors.length)]//floor向下取整
				}
				balls.push(aBall);
			}	
		}
	}
}
//绘制时间
function render(ctx) {
	ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//刷新画布

	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds = curShowTimeSeconds%60;

	renderDigit(margn_left, margin_top, parseInt(hours/10), ctx);
	renderDigit(margn_left+15*(radius+1), margin_top, parseInt(hours%10), ctx);
	renderDigit(margn_left+30*(radius+1), margin_top, 10, ctx);
	renderDigit(margn_left+39*(radius+1), margin_top, parseInt(minutes/10), ctx);
	renderDigit(margn_left+54*(radius+1), margin_top, parseInt(minutes%10), ctx);
	renderDigit(margn_left+69*(radius+1), margin_top, 10, ctx);
	renderDigit(margn_left+78*(radius+1), margin_top, parseInt(seconds/10), ctx);
	renderDigit(margn_left+93*(radius+1), margin_top, parseInt(seconds%10), ctx);

	for (var i = 0; i < balls.length; i++) {
		ctx.fillStyle = balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, radius, 0, 2*Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}
}
//绘制每一个数字
function renderDigit(x, y, num, ctx) {//第一个小圆圆心的x，第一个小圆圆心的y，要绘制的数字,画布
	ctx.fillStyle = "rgb(0,102,153)";

	for (var i = 0; i < digit[num].length; i++) {//行
		for(var j = 0; j < digit[num][i].length; j++) {//列
			if(digit[num][i][j] == 1) {
				ctx.beginPath();
				ctx.arc(x+j*2*(radius+1)+(radius+1), y+i*2*(radius+1)+(radius+1), radius, 0, 2*Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}