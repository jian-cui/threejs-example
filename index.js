var scene, camera, renderer;

// 动画目标
var targets = {
  table: [],
  sphere: [],
  helix: [],
  grid: [],
  end: []
}

var objects = [], // 普通动画对象
    stars = [],   // 星星对象
    dots = [],    // 文字等动态动画对象列表
    intervalID;   // 普通动画setinterval id
  
// 头像
var personArray = [];
for(var i=0;i<199;i++){
  personArray.push({
    image: "img/a.png"
  });
};

var table = [];
for (var i = 0; i < personArray.length; i++) {
  table[i] = new Object();
  if (i < personArray.length) {
      table[i] = personArray[i];
      table[i].src = personArray[i].thumb_image;
  } 
  table[i].p_x = i % 20 + 1;
  table[i].p_y = Math.floor(i / 20) + 1;
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function init() {
  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0xff0000 );
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.z = 3000;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearAlpha(0); // 设置背景透明
  // renderer.setClearColor(new THREE.Color(0, 0, 0));
  // 设置背景为图片
  var sceneTexture = new THREE.TextureLoader().load( "./img/galaxy.jpg", function (texture) {
      scene.background = texture;  
  } );

  document.getElementById('container').appendChild(renderer.domElement);

  createStars();
  // createObjects();
  update();
}

function update() {
  requestAnimationFrame(update);
  var rotation;
  if (geoAni && geoAni.show) { 
    geoAni.object.rotation.y += 0.006;
  }
  TWEEN.update();

  updateStars();
  render();
}
function render() {
  renderer.render(scene, camera);
}


function createStars() {
  var particle, material;
  var spriteMap = new THREE.TextureLoader().load('./img/star_preview.png');
  material = new THREE.SpriteMaterial({
      map: spriteMap,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
  });

  for (var zpos = 1000; zpos < 3000; zpos += 4) {
      particle = new THREE.Sprite(material);
      // particle = new THREE.Mesh( geo, material );
      particle.position.x = Math.random() * 1000 - 500;
      particle.position.y = Math.random() * 1000 - 500;

      particle.position.z = zpos;

      particle.scale.x = particle.scale.y = 10;

      scene.add(particle);

      stars.push(particle);
  }
};

function updateStars() {
  var particle;
  for (var i = 0; i < stars.length; i++) {
      particle = stars[i];
      particle.position.z += 60 / 46;

      if (particle.position.z > 3000) {
          particle.position.z -= 2000;
      }
  }
}

function createMesh(texture) {
  // return new THREE.Sprite(new THREE.SpriteMaterial({
  //   color: 0xffffff,
  //   map: texture
  // }))
  var geometry = new THREE.PlaneGeometry(100, 100);

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(geometry, material);
}

function GeoAni(textureList) {
  this.targets = {
    table: [],
    sphere: [],
    helix: [],
    grid: [],
    num5: [],
    end: []
  }
  this.textureList = textureList;
  this.objectList = [];
  this.object = new THREE.Object3D();
  this.init();
  this.show = true;

  // 重置位置
  this.reset = function () {
    var object;
    for (var i =0; i < table.length; i++) {
      object = this.objectList[i];
      object.position.x = Math.random() * 4000 - 8000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
    }
    this.show = true;
    scene.add(this.object);
  }
  this.destory = function () {
    this.show = false;
    this.object.rotation.y = 0;
    scene.remove(this.object);
  }
}
GeoAni.prototype.run = function (targetList, duration) {
  // 这里
  // TWEEN.removeAll();

  for (var i = 0; i < this.objectList.length; i++) {
    var object = this.objectList[i];
    var target = targetList[i];  

    new TWEEN.Tween( object.position )
      .to( {
        x: target.position.x, 
        y: target.position.y, 
        z: target.position.z
      },  Math.random() * duration + duration)
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();
    
    new TWEEN.Tween( object.rotation )
      .to({
        x: target.rotation.x, 
        y: target.rotation.y, 
        z: target.rotation.z
      }, Math.random() * duration + duration)
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();
  }

  new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}
GeoAni.prototype.init = function () {
  var object;
  // 点集
  for (var i =0; i < table.length; i++) {
    var index = randomRange(0, this.textureList.length);
    object = createMesh(this.textureList[index]);
    object.position.x = Math.random() * 4000 - 8000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    this.objectList.push(object);
    this.object.add(object);
  }
  scene.add(this.object)
  // 平面板
  for (var i =0; i < table.length; i++) {
    object = new THREE.Object3D();
    object.position.x = ( table [i].p_x * 140 ) - 1330;
    object.position.y = - (table[i].p_y * 180 ) + 990;
    this.targets.table.push(object);
  }

  // 球体
  var vector = new THREE.Vector3();
  var spherical = new THREE.Spherical();
  for (var i =0, l = table.length; i < l; i++) {
    var phi = Math.acos( -1 + ( 2 * i) / l);
    var theta = Math.sqrt( l * Math.PI ) * phi;

    object = new THREE.Object3D();

    spherical.set( 800, phi, theta );

    object.position.setFromSpherical( spherical )

    vector.copy( object.position ).multiplyScalar( 2 );

    object.lookAt( vector );

    this.targets.sphere.push( object );
  }

  // // helix
  var cylindrical = new THREE.Cylindrical();
  for (var i =0; i < table.length; i++) {

    var theta = i * 0.75 + Math.PI;
    var y = - ( i * 5 ) + 450;

    object = new THREE.Object3D();

    cylindrical.set(900, theta, y);

    object.position.setFromCylindrical( cylindrical);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt( vector );

    this.targets.helix.push(object);
  }

  // grid
  for (var i = 0, l = table.length; i < l; i++) {

    object = new THREE.Object3D();

    object.position.x = ( ( i % 5 ) * 400 ) - 800; // 400 图片的左右间距  800 x轴中心店
    object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 300 ) + 500;  // 500 y轴中心店
    object.position.z = ( Math.floor( i / 25 ) ) * 200 - 800;// 300调整 片间距 800z轴中心店

    this.targets.grid.push( object );
  }

  // end 散去
  for (var i = 0, l = table.length; i < l; i++) {
    object = new THREE.Object3D();

    object.position.x = Math.random() * 4000 - 8000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;

    this.targets.end.push( object );

  }
}
function transform(targets, duration) {
  // 这里
  TWEEN.removeAll();

  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var target = targets[i];  

    new TWEEN.Tween( object.position )
      .to( {
        x: target.position.x, 
        y: target.position.y, 
        z: target.position.z
      },  Math.random() * duration + duration)
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();
    
    new TWEEN.Tween( object.rotation )
      .to({
        x: target.rotation.x, 
        y: target.rotation.y, 
        z: target.rotation.z
      }, Math.random() * duration + duration)
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();
  }

  new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();
}

function getTextData(text) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  // draw text
  context.save();
  context.font = '200px 微软雅黑 bold';
  context.fillStyle = 'rgba(168, 168, 168, 1)';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  context.restore();

  var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);

  var dots = [];
  for (var x =0; x < imgData.width; x+= 6) {
    for (var y = 0; y < imgData.height; y += 6) {
      var i = ( y * imgData.width + x ) * 4;
      if (imgData.data[i] >= 128) {
        console.log(x-3, y-3, 0, 3);

      }
    }
  }
}

// 动画父类 虚类
function SuperVirtualAni () {
}
SuperVirtualAni.prototype = {
  constructor: SuperVirtualAni,
  // 聚合动画
  run: function () {
    TWEEN.removeAll();
    var dot;
    for (var i=0;i < this.dots.length; i++) {
      dot = this.dots[i];
      dot.x = dot.rx;
      dot.y = dot.ry;
      dot.z = dot.rz;
      dot.paint();
      new TWEEN.Tween(dot.mesh.position)
        .to({
          x: dot.dx,
          y: dot.dy,
          z: dot.dz
        }, 500)
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();
    }
  },
  // 分散动画
  divert: function () {
    TWEEN.removeAll();
    var dot;
    for (var i=0;i < this.dots.length; i++) {
      dot = this.dots[i];
      dot.x = dot.dx;
      dot.y = dot.dy;
      dot.z = dot.dz;
      dot.paint();
      new TWEEN.Tween(dot.mesh.position)
        .to({
          x: dot.rx,
          y: dot.ry,
          z: dot.rz
        }, 500)
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();
    }
  },
  getDots: function () {

  }
}

/* 文字动画 */
function TextAni(text, textureList) {
  // 继承父类
  SuperVirtualAni.call(this);

  this.textureList = textureList;
  this.text = text;
  this.fallbacklength = 200;
  this.object = new THREE.Object3D(); // mesh集合 方便统一删除
  this.dots = this.getDots(this.text);
  scene.add(this.object);
  // this.meshes = 
  // scene.add(this.object);
}
TextAni.prototype = new SuperVirtualAni();
TextAni.prototype.constructor = TextAni;
TextAni.prototype.getDots = function (text) {
  var canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var context = canvas.getContext('2d');
  context.save();
  context.font = "900px 微软雅黑 bold";
  context.fillStyle = "rgba(168,168,168,1)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  context.restore();
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);
  var dots = [];

  var texture;
  for (var x = 0; x < imgData.width; x += 20) {
    for (var y = 0; y < imgData.height; y += 20) {
      var i = (y * imgData.width + x) * 4;
      if (imgData.data[i] >= 128) {
        texture = this.textureList[randomRange(0, this.textureList.length)];
        var dot = new Dot(x - 10 - imgData.width / 2, y - 10 - imgData.height / 2, 1000, texture);
        dot.paint();
        dots.push(dot);
        this.object.add(dot.mesh);
      }
    }
  }
  return dots;
}

/* 图片动画 */
function ImgAni (base64, textureList) {
  SuperVirtualAni.call(this);

  var that = this;
  this.textureList = textureList;
  this.object = new THREE.Object3D();
  this.dots = [];
  this.img = new Image();
  this.img.src = base64;
  this.img.onload = function () {
    console.log(that.img)
    that.getDots(that.img);
  }
  this.show = false;
  this.destory = function () {
    this.show = false;
    scene.remove(this.object);
  }
  this.dispear = function () {
    var dot;
    for (var i=0;i < this.dots.length; i++) {
      dot = this.dots[i];
      // dot.paint();
      new TWEEN.Tween(dot.mesh.position)
        .to({
          x: Math.random() * 4000 + 4000,
          y: Math.random() * 4000 - 2000,
          z: Math.random() * 4000 - 2000
        }, Math.random() * 1000 + 1000)
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();
    }
  }
}
ImgAni.prototype = new SuperVirtualAni();
ImgAni.prototype.constructor = ImgAni;
ImgAni.prototype.draw = function () {
  this.show = true;
  scene.add(this.object);
  this.run();
}
ImgAni.prototype.getDots = function (img) {
  var canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');

  var logoParticles = [],
    particleIndex = 0;
  
  var posX = (window.innerWidth -  img.width) / 2,
    posY = (window.innerHeight - img.height) / 2;

  ctx.drawImage(img, posX, posY);

  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height),
    pixels = imgData.data;
  
  var texture;

  for (var y = 0; y < imgData.height; y += 20) {
    for (var x = 0; x < imgData.width; x += 20) {
      var alpha = pixels[((imgData.width * y) + x) * 4 + 20];
      if (alpha > 0) {
        texture = this.textureList[randomRange(0, this.textureList.length)];
        // logoParticles.push(new Dot(x, y, texture));
        var dot = new Dot(x - 10 - imgData.width / 2, y - 10 - imgData.height / 2, 1000, texture);
        dot.paint();
        this.object.add(dot.mesh);
        logoParticles.push(dot);
      }
    }
  }
  this.dots = logoParticles;
}



function Dot(centerX, centerY, centerZ, texture) {
  // 目标点坐标
  this.dx = centerX * 2;
  this.dy = -centerY * 2;
  this.dz = centerZ;

  // 随机点坐标
  this.rx = Math.random() * window.innerWidth - window.innerWidth / 2;
  this.ry = Math.random() * window.innerHeight - window.innerHeight / 2;
  // this.rz = Math.random() * length * 2 - length;
  this.rz = Math.random() * 2000 + 500;

  // 实际显示点坐标
  this.x = this.rx;
  this.y = this.ry;
  this.z = this.rz;

  this.mesh = createMesh(texture);
}
Dot.prototype.removeFrom = function (object) {
  object.remove(this.mesh);
}
Dot.prototype.paint = function () {
  this.mesh.position.x = this.x;
  this.mesh.position.y = this.y;
  this.mesh.position.z = this.z;
  this.mesh.scale.x = this.mesh.scale.y = .3;
}

document.getElementById('countdown').addEventListener('click', function () {
  clearInterval(intervalID);
  var num = 10;
  var animation;
  var intID = setInterval(function() {
    if (num > 0) {
      if (animation) scene.remove(animation.object);
      animation = new TextAni(num);
      animation.run();
      num--;
    } else {
      scene.remove(animation.object);
      logoAni.draw();
      clearInterval(intID);
    }
  }, 1000);
})

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

window.addEventListener( 'resize', onWindowResize, false );

var api = {
  setting: 'http://wxscreen5.alltosun.net/checkin3d/api/init',
  getNewUser: 'http://wxscreen5.alltosun.net/checkin3d/api/get_new_user',
  getUsers: 'http://wxscreen5.alltosun.net/checkin3d/api/get_default_user'
}


init();

// var geoAni = new GeoAni();
// var textAni;
// var logoAni = new ImgAni('./img/logo.png');
// var ini = 0;
// intervalID = setInterval(function () {
//   ini = ini >= 5 ? 0 : ini;
//   ini++;
//   switch(ini) {
//     case 1:
//       if (logoAni.show) {
//         // scene.remove(logoAni.object);
//         logoAni.dispear();
//       }
//       // if (!geoAni.show) {
//       //   geoAni.reset();
//       // }
//       geoAni.run(geoAni.targets.sphere, 1000);
//       break;
//     case 2:
//       geoAni.run(geoAni.targets.table, 1000);
//       break;
//     case 3:
//       geoAni.run(geoAni.targets.helix, 1000);
//       break;
//     case 4:
//       geoAni.run(geoAni.targets.grid, 1000);
//       break;
//     case 5:
//       // 隐藏
//       // geoAni.run(geoAni.targets.end, 1000);
//       geoAni.destory();
//       // textAni = new .run();
//       logoAni.draw();
//       break;
//   }
// }, 8000);
// geoAni.run(geoAni.targets.table, 1000);
var geoAni;
var textAni;
var logoAni;
var textureList = []; // 默认纹理集合


var ws = {},
sessionId = 'jjabh33fjo77g59s2v4blot5v0', // 客户端标识
companyId = 103866, // 屏幕标识
socketUrl = 'ws://wxscreen.alltosun.net/websocket';


// 获取默认头像
$.ajax({
  url: api.getUsers,
  type: "POST",
  dataType: 'json',
  success: function (result) {
    var list = result.list;
    
    for (var i=0; i < list.length; i++) {
      // console.log(list[i].avatar);
      textureList.push(new THREE.TextureLoader().load(list[i].avatar));
    }
    initWebsocket(); // 初始化websocket
    geoAni = new GeoAni(textureList);
    logoAni = new ImgAni('./img/logo.png', textureList);
    // 获取动画配置
    $.ajax({
      url: api.setting,
      type: 'POST',
      dataType: 'json',
      data: {
        company_id: 103866
      },
      success: function(result) {
        var config = result.config;
        var aniList = [];
        for (var i = 0; i < config.length; i++) {
          if (config[i].type <= 4) {
            aniList.push(config[i].type);
          } else if (config[i].type == 5) {
            // 倒计时

          } else if (config[i].type == 6) {
            // logo
            aniList.push('6');
            // logoAni = new ImgAni('./img/logo.png', textureList);
          }
        }
        function animationSwitch(index) {
          switch(parseInt(index)) {
            case 1:
              if (logoAni && logoAni.show) {
                logoAni.dispear();
              }
              if (!geoAni.show) {
                geoAni.reset();
              }
              geoAni.run(geoAni.targets.sphere, 1000);
              break;
            case 2:
              geoAni.run(geoAni.targets.table, 1000);
              break;
            case 3:
              geoAni.run(geoAni.targets.helix, 1000);
              break;
            case 4:
              geoAni.run(geoAni.targets.grid, 1000);
              break;
            case 6:
              geoAni.destory();
              logoAni.draw();
              break;
          }
        }

        var ini = 0;
        intervalID = setInterval(function () {
          ini++;
          ini = ini % aniList.length;
          animationSwitch(aniList[ini]);
        }, 8000);

        animationSwitch(aniList[ini]);
      }
    })
  }
});


/**
     * 初始化websocket
     */
    function initWebsocket() 
    {
        ws = new WebSocket(socketUrl);
        ws.onopen = onOpen;
        ws.onmessage = onMessage;
        ws.onclose = function() {
            //console.log("连接关闭，定时重连");
            setTimeout(function(){
                initWebsocket();
            }, 3000);
        };
        ws.onerror = function() {
            //console.log("出现错误");
        };
    }

    /**
  连接建立时发送登录信息
  **/
  function onOpen()
  { 
      wsLogin(ws);
  }

   
    /**
    * 发送消息
    */
  function wsSend(ws, url, params)
  {
      var json = {
          'url': url,
          'params': params
      };
      
      var str = JSON.stringify(json);

      ws.send(str);
  }

  /**
  *先执行登录操作
  *
  */
  function wsLogin(ws)
  {
      wsSend(ws, "checkin3d/login", {
          "session": sessionId
      });
  }

  /**
  执行绑定屏幕操作
  **/
  function wsBindScreen()
  {
      wsSend(ws, "checkin3d/bind_screen", {
          "company_id": companyId,
      });
  }


  /**
  处理返回消息
  **/
  function onMessage(e)
  {
      var data = JSON.parse(e.data);
      
      if (data.url == 'checkin3d/login') {
          wsBindScreen(); 
      } else if (data.url == 'checkin3d/start_countdown') {
            // 倒计时的通知  该显示倒计时的效果了 
            console.log('开始倒计时');

            clearInterval(intervalID);
            geoAni.destory(); // 销毁几何动画
            logoAni.destory(); // 销毁logo动画
            var num = 10;
            var animation;
            var intID = setInterval(function() {
              if (num > 0) {
                if (animation) scene.remove(animation.object);
                animation = new TextAni(num, textureList);
                animation.run();
                num--;
              } else {
                scene.remove(animation.object);
                // logoAni.draw();
                // 运行操作
                console.log('完成')
                clearInterval(intID);
              }
            }, 1000);
      }
  }
