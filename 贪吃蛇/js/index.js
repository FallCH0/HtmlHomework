var canvas=document.querySelector('#SnackArea');//用id绑定相应标签
var ctx=canvas.getContext('2d');//获取2d画笔
var headimg=document.createElement('img');
var footimg=document.createElement('img');
var bodyimg=document.createElement('img');
var foodimg=document.createElement('img');
headimg.src='../image/head.png';
footimg.src='../image/foot.png';
foodimg.src='../image/egg.png';
bodyimg.src='../image/body.png';
canvas.width=600;
canvas.height=360;
//用一个数组存储蛇，默认有头和尾
foodimg.onlod=function(){
headimg.onload = function(){
  footimg.onload=function(){
    bodyimg.onload=function(){
  draw();}
}
}}
var headDir = 2;// 0 下 1 上 2 右  3 左(蛇头朝向)
var snackArr = [new SnackPart(1, 0,headDir,-1), new SnackPart(0,0,headDir,0)];
//存储头部轨迹
var tracks=[];
var foodLocation={x:-1,y:-1};
var footx={};
var gameover=0;
var timer=-1;
var sc=0;
var time=0;
var speed=300;
function reset(){//初始化
snackArr = [new SnackPart(1, 0,headDir,-1), new SnackPart(0,0,headDir,0)];
//存储头部轨迹
tracks=[];
foodLocation={x:-1,y:-1};
footx={};
gameover=0;
headDir=2;
snackArr[snackArr.length-1].dir=2;
sc=0;
time=0;
draw();
Food();
drawfood();
}
Food();
drawfood();
//加载需要时间，用onload确保加载完毕后执行
function draw(){
  //绘制贪吃蛇
    //缩小一半
    var head=snackArr[0];var foot=snackArr[snackArr.length-1];
    ctx.drawImage(headimg,headDir*40,0,40,40,head.x*20,head.y*20,20,20);//参数列表：图片对象，图片左上角x和y，图片绘制区域宽和高，画布左上角x和y，画布宽和高(相当于从图片中摘出某一部分放到画布上)
    //类似mc中的clone指令，但此为起始坐标+相对坐标
    ctx.drawImage(footimg,foot.dir*40,0,40,40,foot.x*20,foot.y*20,20,20);
    for(var i=1;i<snackArr.length-1;i++){
      var s=snackArr[i];
      ctx.drawImage(bodyimg,0,0,40,40,s.x*20,s.y*20,20,20);
    }
    //原图片是四个头一体，所以截取

}
document.body.onkeydown=function(e){
  //w87a65s83d68
  //上38左37下40右39
    if(headDir!=2&&(e.keyCode==65||e.keyCode==37)){  
        //左
        headDir = 3;
    }
    if(headDir!=0&&(e.keyCode==38||e.keyCode==87)){  
    //上
        headDir = 1
    }
    if(headDir!=3&&(e.keyCode==39||e.keyCode==68)){  
     //右
        headDir =2
    }
    if(headDir!=1&&(e.keyCode==40||e.keyCode==83)){  
    //下
        headDir = 0;
    }
}
function start(){
  if(gameover==2){
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    reset();
    document.querySelector('#gameover').className='gaming';

    
  }
 timer=setInterval(interval,speed);
 document.querySelector('#bgmusic').play();
}
//时间间隔
function interval(){
  if(gameover==0){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  move();//移动
  draw();
  drawfood();
  eat();
out();
lost();
showScore();
showtime();
}
  else if(gameover==1){
    document.querySelector('#overmusic').play();
    pause();
    document.querySelector('#gameover').className='over';
    timer=-1;
    gameover=2;
  }
}
function move(){
    //轨迹加入数组
    tracks.push(new Track(snackArr[0].x,snackArr[0].y,headDir));
    switch(headDir){
    case 0:
      //向下
      snackArr[0].y++;
      break;
    case 1:
        //向上
        snackArr[0].y--;
        break;    
    case 2:
        //向左
        snackArr[0].x++;
        break;    
    case 3:
        //向右
        snackArr[0].x--;
        break;
   }
   var foot=snackArr[snackArr.length-1];
   footx={x:foot.x,y:foot.y,dir:foot.dir,next:foot.next};
   for (var i = 1; i < snackArr.length; i++){
    var s = snackArr[i];
    //先获取下一步要走的位置
    var next = tracks[s.next];
    //将要走的位置的坐标进行赋值
    s.x = next.x;
    s.y = next.y;
    s.dir = next.dir;
    //指向下一个要走的位置
    s.next++;
}
}
function Food(){
  var x=parseInt(Math.random()*30);
  var y=parseInt(Math.random()*18);
  foodLocation.x=x;
  foodLocation.y=y;
}
function drawfood(){
  ctx.drawImage(foodimg,0,0,40,40,foodLocation.x*20,foodLocation.y*20,20,20);
}
function eat(){
  var head=snackArr[0];
  if(head.x==foodLocation.x&&head.y==foodLocation.y){
    snackArr.push(footx);
    Food();
    drawfood();
    document.querySelector('#addmusic').play();
    sc=parseInt(sc)+10;
  }
}
function pause(){//暂停
  clearInterval(timer);

  timer=-1;
  gameover=false;
  document.querySelector('#bgmusic').pause();
}
function out(){//穿墙
  //判定界限
  if(snackArr[0].x<0){
    snackArr[0].x=30;
  }
  if(snackArr[0].y<0){
    snackArr[0].y=18;
  }
  if(snackArr[0].x>30){
    snackArr[0].x=-1;
  }if(snackArr[0].y>18){
    snackArr[0].y=-1;//穿墙平移，错1以对准边界
  }
}
function lost(){//撞上
  var head=snackArr[0];
  for(var i=1;i<snackArr.length;i++){
    if(head.x==snackArr[i].x&&head.y==snackArr[i].y){
      gameover=1;
    }
  }
}
function padZero(num, size) {//字符格式化
  return num.toString().padStart(size, '0');
}
function showScore(){
document.querySelector('#GameScore').innerHTML=padZero(sc,5);
}
function showtime(){
  time+=speed/1000;
  document.querySelector('#GameTime').innerHTML=padZero(parseInt(time),5);
}