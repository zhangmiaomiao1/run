//粒子
function fire(cobj) {
     this.cobj = cobj;
     this.x = 0;
     this.y = 0;
     this.x1 = 20 * Math.random() - 10;
     this.y1 = 20 * Math.random() - 10;
     this.x2 = 20 * Math.random() - 10;
     this.y2 = 20 * Math.random() - 10;
     this.speedy = -2 - Math.random() - 2;
     this.speedx = (16 * Math.random() - 8)
     this.life = 4;
     this.r = 1;
     this.color = "#fef";
    }
fire.prototype = {
      draw: function () {
          var cobj = this.cobj;
          cobj.save();
          cobj.beginPath();
          cobj.fillStyle = this.color;
          cobj.translate(this.x, this.y);
          cobj.scale(this.r, this.r)
          cobj.moveTo(0, 0);
            //cobj.bezierCurveTo(this.x1,this.y1,this.x2,this.y2,0,0);
          cobj.lineTo(this.x1, this.y1);
          cobj.lineTo(this.x2, this.y2);
          cobj.fill();
          cobj.restore();
      },
   update: function () {
            this.x += this.speedx;
            this.y += this.speedy;
            this.life -= 0.2;
            this.r -= 0.06;
       }
}
function stone(cobj, x, y,color) {
   var color=color||"#fff";
   var stoneArr = [];
    for (var i = 0; i < 5; i++) {
         var obj = new fire(cobj);
          obj.x = x;
          obj.y = y;
          obj.color=color;
          stoneArr.push(obj);
   }
     var t = setInterval(function () {
           for (var i = 0; i < stoneArr.length; i++) {
           stoneArr[i].draw();
           stoneArr[i].update();
           if (stoneArr[i].r < 0 || stoneArr[i].life < 0) {
               stoneArr.splice(i, 1);
               }
             }
              if (stoneArr.length == 0) {
        clearInterval(t);
      }
    }, 50)
 }
////人
function person(canvas,cobj,runImg,jumpImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=canvas.width/2;
    this.y=0;
    this.endy = 320;
    //检测碰撞 图片的宽高
    this.width=148;
    this.height=200;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    //人的状态
    this.status="runImg";
    //默认的状态
    this.state=0;//控制下标
    this.speedy = 5;
    this.zhongli = 10;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,148,220,0,0,this.width,this.height);
        this.cobj.restore();
    },
    update:function(){
        if (this.y > this.endy) {
              this.y = this.endy
             stone(this.cobj, this.x + this.width / 2, this.y + this.height)
              }
        else if (this.y < this.endy) {
        this.speedy += this.zhongli;
        this.y += this.speedy;
         }
    }
}
//创建障碍物
function hide(canvas,cobj,hideImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=canvas.width;
    this.y=480;
    this.state = 0;
    this.hideImg=hideImg;
    this.width=50;
    this.height=50;
}
hide.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hideImg[this.state],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
////游戏主程序
function game(canvas,cobj,runImg,jumpImg,hideImg,fenshu,live,over,congxin,diao,zz,audio){
    this.canvas=canvas;
    this.cobj=cobj;
    this.fenshu=fenshu;
    this.live=live;
    this.canvasw=canvas.width;
    this.canvash=canvas.height;
    this.speed=10;
    this.person=new person(canvas,cobj,runImg,jumpImg);
    this.back=0;
    this.score=1;
    this.hideArr=[];
    this.hideImg=hideImg;
    this.life=3;
    this.over=over;
    this.congxin=congxin;
    this.diao=diao;
    this.zz=zz;
    this.audio=audio;
}
game.prototype={
    play:function(){
        var that=this;
        that.key();
        var num=0;
        var num2=0;
        var step=5000+parseInt(5*Math.random())*1000;
        //var back=0;
        function aa(){
            num++;
            that.back-=that.speed;
            that.cobj.clearRect(0,0,that.canvasw,that.canvash);
            if(that.person.status=="runImg"){
                that.person.state=num%7;//让图片轮换起来
            }else if(that.person.status=="jumpImg"){
                that.person.state=0;
            }
            //that.person.x+=that.speed;//动起来
            //if(that.person.x>that.canvasw/2){
            //    that.person.x=that.canvasw/2;
            //}
            that.person.draw();
            that.person.update();
            that.canvas.style.backgroundPositionX=that.back+"px";
            if(num2%step==0){
                num2=0;
                step=5000+parseInt(5*Math.random())*1000;
                var hideObj=new hide(that.canvas,that.cobj,that.hideImg);
                hideObj.state=Math.floor(that.hideImg.length*Math.random());
                that.hideArr.push(hideObj);
                if(that.hideArr.length>5){
                    that.hideArr.shift();
                }
            }
            num2+=50;

            for(var i=0;i<that.hideArr.length;i++){
                that.hideArr[i].x-=that.speed;
                that.hideArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hideArr[i])){
                    if(!that.hideArr[i].flag1) {
                        that.live.innerHTML=that.life--;
                        stone(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height / 2,"red")
                    }
                    that.hideArr[i].flag1=true;
                    if(that.life<0){
                        //that.over1.style.display="block";
                        that.over.style.display="block";
                        that.congxin.style.display="block";
                        clearInterval(b)
                        //alert("game over");
                        that.congxin.onclick=function(){
                            that.over.style.display="none";
                            that.congxin.style.display="none";
                            location.reload();

                        }
                        //location.reload();

                    }

                }else if(that.hideArr[i].x+that.hideArr[i].width<that.person.x){
                    if(!that.hideArr[i].flag&&!that.hideArr[i].flag1) {
                        that.fenshu.innerHTML=that.score++;
                        if(that.score%3==0){
                            that.speed+=1;
                        }
                    }
                    that.hideArr[i].flag=true;
                }
            }
        }
    var b=setInterval(aa,50);
        clearInterval(b);
        that.diao.onclick=function(){
            that.zz.style.display="none";
            that.diao.style.display="none"
            that.audio.play();
            b=setInterval(aa,50)
        }
  },
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
            if(flag==false){
                return;
            }
            flag=false;
            var code= e.keyCode;
            if(code==32){
                that.person.speedy = 0;
                that.person.zhongli = 0;
                that.person.status="jumpImg";
                var inita=0;
                var speeda=10;
                var r=100;
                var inity=that.person.y;
                var t=setInterval(function(){
                    inita+=speeda;
                    if(inita>180){
                        clearInterval(t);
                        that.person.status="runImg";
                        flag=true;
                    }else{
                        var len=Math.sin(inita*Math.PI/180)*r;
                        that.person.y=inity-len;
                    }
                },50)
            }
        }
    }
}