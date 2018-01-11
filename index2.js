var scene, camera, renderer;

// 动画目标
var targets = {
  table: [],
  sphere: [],
  helix: [],
  grid: [],
  num5: []
}

var objects = [], // 普通动画对象
    stars = [],   // 星星对象
    obj3D = new THREE.Object3D(), // 普通动画对象合集
    dots = [];    // 文字等动态动画对象列表
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
  createObjects();
  update();
}

function update() {
  requestAnimationFrame(update);
  // scene.rotation.y += 0.006;
  obj3D.rotation.y += 0.006;
  TWEEN.update();
  updateStars();
  render();
}
function render() {
  renderer.render(scene, camera);
}

function drawDots() {
  var dots = createWordDots('5');
  var meshes = [];
  var texture = [];

  texture.push(new THREE.TextureLoader().load('./img/p3.jpg'));
  texture.push(new THREE.TextureLoader().load('./img/a.png'));
  texture.push(new THREE.TextureLoader().load('./img/b.png'));
  texture.push(new THREE.TextureLoader().load('./img/c.png'));
  for (var i=0; i< dots.length; i++) {
    var index = randomRange(0, 4);
    var mesh = createMesh(texture[index]);
    mesh.position.x = dots[i].x * 2;
    mesh.position.y = -dots[i].y * 2;
    mesh.position.z = dots[i].z;
    mesh.scale.x = mesh.scale.y = .3;
    meshes.push(mesh);
    scene.add(mesh);
  }
}
function createWordDots(text) {
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
  for (var x = 0; x < imgData.width; x += 20) {
    for (var y = 0; y < imgData.height; y += 20) {
      var i = (y * imgData.width + x) * 4;
      if (imgData.data[i] >= 128) {
        var dot = new Dot(x - 10 - imgData.width / 2, y - 10 - imgData.height / 2, 0, 10);
        dots.push(dot);
      }
    }
  }
  return dots;
}
function Dot(centerX, centerY, centerZ, radius) {
  this.dx = centerX;
  this.dy = centerY;
  this.dz = centerZ;
  this.tx = 0;
  this.ty = 0;
  this.tz = 0;
  this.z = centerZ;
  this.x = centerX;
  this.y = centerY;
  this.radius = radius;
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

function createObjects(texture) {
  var object;
  // 点集
  var texture = [];

  texture.push(new THREE.TextureLoader().load('./img/p3.jpg'));
  texture.push(new THREE.TextureLoader().load('./img/a.png'));
  texture.push(new THREE.TextureLoader().load('./img/b.png'));
  texture.push(new THREE.TextureLoader().load('./img/c.png'));

  for (var i =0; i < table.length; i++) {
    var index = randomRange(0, 4);
    object = createMesh(texture[index]);
    // object.position.x = Math.random() * 4000 - 2000;
    // object.position.y = Math.random() * 4000 - 2000;
    object.position.x = Math.random() * 4000 - 8000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    // object.position.z = 1000;
    objects.push(object);
    // scene.add( object );
    obj3D.add(object);
  }
  scene.add(obj3D)
  // 平面板
  for (var i =0; i < table.length; i++) {
    object = new THREE.Object3D();
    object.position.x = ( table [i].p_x * 140 ) - 1330;
    object.position.y = - (table[i].p_y * 180 ) + 990;
    targets.table.push(object);
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

    targets.sphere.push( object );
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

    targets.helix.push(object);
  }

  // grid
  for (var i = 0, l = table.length; i < l; i++) {

    object = new THREE.Object3D();

    object.position.x = ( ( i % 5 ) * 400 ) - 800; // 400 图片的左右间距  800 x轴中心店
    object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 300 ) + 500;  // 500 y轴中心店
    object.position.z = ( Math.floor( i / 25 ) ) * 200 - 800;// 300调整 片间距 800z轴中心店

    targets.grid.push( object );
  }

  var ini = 0;
  setInterval(function () {
    ini = ini >= 3 ? 0 : ini;
    ini++;
    switch(ini) {
      case 1:
        transform(targets.sphere, 1000);
        break;
      case 2:
        transform(targets.helix, 1000);
        break;
      case 3:
        transform(targets.grid, 1000);
        break;
    }
  }, 8000);

  transform( targets.table, 2000 );
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

init();
drawDots();