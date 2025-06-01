<template>
     <div class="home">
    <div class="canvas-container" ref="canvasDom"></div>

    <div class="home-content">
      <div class="home-content-title">
        <h1>汽车展示与选配</h1>
      </div>
      <h2>选择车身颜色</h2>
      <div class="select">
        <div
          class="select-item"
          v-for="(item, index) in colors"
          :key="index"
          @click="selectColor(index)"
        >
          <div
            class="select-item-color"
            :style="{ backgroundColor: item }"
          ></div>
        </div>
      </div>

      <h2>选择贴膜材质</h2>
      <div class="select">
        <div
          class="select-item"
          v-for="(item, index) in materials"
          :key="index"
          @click="selectMaterial(index)"
        >
          <div class="select-item-text">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";//意思是 引入OrbitControls.js文件，并将其赋值给OrbitControls变量 作用是 实现鼠标拖拽旋转视角
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";//意思是 引入GLTFLoader.js文件，并将其赋值给GLTFLoader变量 作用是 加载gltf格式的3d模型
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";// 意思是 引入DRACOLoader.js文件，并将其赋值给DRACOLoader变量 作用是 解压缩gltf格式的3d模型

let controls;
let canvasDom = ref(null);
let colors = ["red", "blue", "green", "gray", "orange", "purple"];
let materials = [
  { name: "磨砂", value: 1 },
  { name: "冰晶", value: 0 },
];
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 6);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

let wheels = [];
let carBody, frontCar, hoodCar, glassCar;
// 添加材质
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  // 金属度
  metalness: 1,
  // 粗糙程度
  roughness: 0.5,
  // 清漆
  clearcoat: 1,
  // 清漆光滑度
  clearcoatRoughness: 0,
});
// 前挡风玻璃材质
const frontMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,// 颜色
  metalness: 1,// 金属度
  roughness: 0.5,// 粗糙程度
  clearcoat: 1,// 清漆
  clearcoatRoughness: 0,//清漆光滑度
});
// 车盖材质
const hoodMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
// 玻璃材质
const wheelsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1,
  roughness: 0.1,
});
// 玻璃材质
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  // 透明
  transparent: true,
});



const render = () => {
  renderer.render(scene, camera);// 渲染场景和相机
  requestAnimationFrame(render);//  controls.update();// 更新控制器
};


const initGridHelper = () => {// 添加网格辅助线
    const gridHelper = new THREE.GridHelper(10, 10);// 10表示网格的大小，10表示网格的线段数量
    gridHelper.material.opacity = 0.2;// 透明度
    gridHelper.material.transparent = true;// 透明
    scene.add(gridHelper);// 添加到场景中
}
const initControl = () => {
    // 添加控制器
    controls = ''
    new OrbitControls(camera, renderer.domElement);// 添加控制器
    console.log(controls);
    // controls.update();
}
const initRender = () => {
    canvasDom.value.appendChild(renderer.domElement);// 将渲染器添加到页面中
    // 初始化渲染器，渲染背景
    renderer.setClearColor("#000");// 设置背景颜色
    scene.background = new THREE.Color("#ccc");// 设置场景背景颜色
    scene.environment = new THREE.Color("#ccc");// 设置场景环境颜色
}
const initCar = () => {
    // 添加gltf汽车模型 压缩
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // 路径前缀
    dracoLoader.setDecoderPath("./car/draco/gltf/");
     // 实例化
    loader.setDRACOLoader(dracoLoader);
    loader.load("./car/model/bmw01.glb", (gltf) => {
        const bmw = gltf.scene;
        // 加载glb 获取到每一个msh物体，单独设置值
        bmw.traverse((child) => {
            console.log(child);
            // 判断是否是轮毂
            if (child.isMesh && child.name.includes("轮毂")) {
                child.material = wheelsMaterial;
                wheels.push(child);
            }
            // 判断是否是车身
            if (child.isMesh && child.name.includes("Mesh002")) {
                carBody = child;
                carBody.material = bodyMaterial;
            }
            // 判断是否是前脸
            if (child.isMesh && child.name.includes("前脸")) {
                frontCar = child;
                frontCar.material = frontMaterial;
            }
            // 判断是否是引擎盖
            if (child.isMesh && child.name.includes("引擎盖_1")) {
                hoodCar = child;
                hoodCar.material = hoodMaterial;
            }
            // 判断是否是挡风玻璃
            if (child.isMesh && child.name.includes("挡风玻璃")) {
                glassCar = child;
                glassCar.material = glassMaterial;
            }
        })
        scene.add(bmw)
    })

}

const initLight = () => {
    // 添加灯光, 模拟展厅，所以是四面八方的灯光打到车上
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(0, 0, 10);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(0, 0, -10);
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 1);
  light3.position.set(10, 0, 0);
  scene.add(light3);
  const light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(-10, 0, 0);
  scene.add(light4);
  const light5 = new THREE.DirectionalLight(0xffffff, 1);
  light5.position.set(0, 10, 0);
  scene.add(light5);
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
  light6.position.set(5, 10, 0);
  scene.add(light6);
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
  light7.position.set(0, 10, 5);
  scene.add(light7);
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
  light8.position.set(0, 10, -5);
  scene.add(light8);
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
  light9.position.set(-5, 10, 0);
  scene.add(light9);
}
// 添加灯光、模拟展厅
initLight()


const selectColor = (index) => {
    bodyMaterial.color.set(colors[index]);
    frontMaterial.color.set(colors[index]);
    hoodMaterial.color.set(colors[index]);
    wheelsMaterial.color.set(colors[index]);
}
const selectMaterial = (index) => {
    // 清漆光滑度
    bodyMaterial.clearcoatRoughness = materials[index].value;
    frontMaterial.clearcoatRoughness = materials[index].value;
    hoodMaterial.clearcoatRoughness = materials[index].value;
}
const initSize = () => {
    // 监听屏幕大小改变的变化，设置渲染的尺寸
    window.addEventListener('resize', () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
    });
}
onMounted(() => {
    // 初始化渲染器
    initRender()
    // 开启渲染
    render();
    // 添加控制器
    initControl()
    // 添加网格地面
    initGridHelper()
    // 添加车模型
    initCar()
    initSize()
})

</script>
<style>
* {
  margin: 0;
  padding: 0;
}

.home-content {
  position: fixed;
  top: 0;
  right: 20px;
}
.select-item:hover {
    cursor: pointer;
}
.select-item-color {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
}
.select {
  display: flex;
}
</style>
