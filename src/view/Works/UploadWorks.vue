<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>我要投稿</span>
        </div>
        <div class="homeCenter">
            <div class="venue" style="font-size: 0.4rem">
                {{ info.subject }}
            </div>
            <div class="enrollText">
                <div>作品投稿须知<i></i></div>
                <div class="iconfont icon-down"></div>
            </div>
            <div class="enrolltxt">
                <div class="enrollContents" style="padding: 0.4rem">
                    <!--{{ info.introduce }}-->
                    <p>(一) 投稿作品健康</p>
                    <p>(二) 版权声明：投稿作品审核通过后，可在平台上进行展示</p>
                </div>
                <div style="margin-top: 0.2rem">
                    <yd-checkbox-group v-model="checkbox">
                        <yd-checkbox val="1" shape="circle">我已阅读</yd-checkbox>
                    </yd-checkbox-group>
                </div>
            </div>
            <div v-show="checkbox.length>0">
                <div class="enrollText">
                    <div>上传作品<i></i></div>
                    <div class="iconfont icon-down"></div>
                </div>
                <div class="enrollTextCenter" style="background-color: #ffffff">
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>作品名称</div>
                        <input v-model.trim="workTit" type="text" placeholder="输入作品名称">
                    </div>
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>艺术门类</div>
                        <div @click="handleOpenType" class="selected">
                            {{ typeName }}
                        </div>
                    </div>
                    <div class="userInfoInput">
                        <div class="textName"><i style="color: red">*</i>资源类型</div>
                        <div @click="openResource" class="selected">
                            {{ upName }}
                        </div>
                    </div>
                    <div v-if="isImage==1" class="flexBettwens works">
                        <div><i style="color: red">*</i>作品封面</div>
                        <div v-if="iswx">
                            <input type="file" id="evUp" accept="image/*" @change="upload" style="display: none">
                            <label for="evUp" class="fileUp">
                                <div v-if="ava.length<1" class="uploadBtn">上传封面</div>
                                <div v-if="ava.length>0" class="uploadBtn">重新上传</div>
                            </label>
                        </div>
                        <div v-if="!iswx">
                            <div @click="handleAppload" class="uploadBtn">上传封面</div>
                        </div>
                    </div>
                    <!--<div v-if="ava.length>0" class="coverImg">-->
                    <!--<img :src="ava" alt="" class="img" id="ava">-->
                    <!--</div>-->
                    <img v-if="ava" :src="url+ava" alt="" class="img" id="ava">
                    <div class="flexBettwens works">
                        <div><i style="color: red">*</i>作品原件</div>
                        {{ workName }}
                        <div v-show="iswx">
                            <div v-show="workUpNum===1">
                                <input type="file" id="workUp" @change="handleUpload"
                                       style="display: none"/>
                                <label for="workUp">
                                    <div class="uploadBtn">上传作品</div>
                                </label>
                            </div>
                            <div v-show="workUpNum===2">
                                <div class="uploadBtn" id="upWorks">
                                    <a style="color: #ffffff" id="workUps">上传作品</a>
                                </div>
                            </div>
                        </div>
                        <div v-show="!iswx">
                            <div v-show="workUpNum!==0">
                                <div @click="handleUpload" class="uploadBtn">
                                    <a style="color: #ffffff">上传作品</a>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div v-if="fileNameInfo!==''" style="padding: 0.4rem 0;border-bottom: 1px solid #e5e5e5">
                        <div style="padding: 0 0.4rem" class="flexBettwens">
                            <div>{{ fileNameInfo }}</div>
                            <div @click="_delFile">删除</div>
                        </div>
                    </div>
                    <!--<div v-for="(item,index) in imgArr" :key="index" v-if="imgArr.length>0" class="coverImg">-->
                    <!--<img :src="item" alt="" class="img" style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5">-->
                    <!--</div>-->
                    <div class="coverInfo">
                        <div><i style="color: #ffffff">*</i>作品简介</div>
                        <div class="info">
                        <textarea name="" id="" cols="30" rows="10"
                                  v-model.trim="description"
                                  class="textareaUp"
                                  placeholder="请输入作品简介"></textarea>
                        </div>
                    </div>
                    <div class="userInfoInput">
                        <div class="textName">姓名</div>
                        <div style="margin-left: 0.4rem">
                            {{ userInfo.nickname || userInfo.realname }}
                        </div>
                    </div>
                    <div style="padding: 0.4rem;border-bottom: 1px solid #e5e5e5;font-size: 0.37333rem;">
                        <div>创作人简介</div>
                        <div class="textareaUp">
                            {{ userInfo.ucontent | ucontent }}
                        </div>
                    </div>
                    <div style="padding: 0.72rem 2.5rem;background-color: #f5f5f5">
                        <div @click="handleUpWork" class="editUserInfoBtn">
                            提交作品 {{ tt }}
                        </div>
                    </div>
                </div>
            </div>

            <!--<div class="enrollText">-->
                <!--<div>我上传的作品<i></i></div>-->
                <!--<div class="iconfont icon-down"></div>-->
            <!--</div>-->
            <!--<div class="myWork">-->
                <!--<div class="myWorkInfo">-->
                    <!--<div class="myWorks">-->
                        <!--<div>2017.02.20 13：30</div>-->
                        <!--<img :src="works" alt="">-->
                    <!--</div>-->
                    <!--<div class="myWorkTit">我的家园</div>-->
                    <!--<span class="myWorkTag">手绘</span>-->
                <!--</div>-->
            <!--</div>-->
            <!--艺术门类弹出框-->
            <mu-dialog :open="dialogType" title="艺术分类" @close="closeType">
                <mu-menu>
                    <mu-menu-item :id="index" :class="typeNum===index?'menuColor':''" @click="handleCheck(item,index)"
                                  :style="!item.upCodeStr?'background-color:#999999':''" :title="item.codeName"
                                  v-for="(item,index) in artList" :key="index"/>
                </mu-menu>
                <mu-flat-button slot="actions" @click="closeType" primary label="取消"/>
                <mu-flat-button slot="actions" primary @click="pickTypeClose" label="确定"/>
            </mu-dialog>
            <!--上传分类弹出框-->
            <mu-dialog :open="dialogUp" title="上传类型" @close="closeUp">
                <mu-menu>
                    <mu-menu-item :id="index" :class="upNum===index?'menuColor':''" @click="handleCheckUp(item,index)"
                                  :title="item" v-for="(item,index) in upArr" :key="index"/>
                </mu-menu>
                <mu-flat-button slot="actions" @click="closeUp" primary label="取消"/>
                <mu-flat-button slot="actions" primary @click="pickUpClose" label="确定"/>
            </mu-dialog>
        </div>
    </div>
</template>

<script>
    import {
        addSpecialResource,
        workId,
        basecode,
        uploadImg,
        uploadTxt,
        qiniuToken,
        upQiniu,
        areas,
        isUpload,
        examineSubmit
    } from '../../api/api'
    import {JsBridge} from '../../jsbridge/jsbridge'
    import {Indicator, Toast} from 'mint-ui';
    // var Qiniu=require('qiniu-js')
    import 'qiniu-js'

    export default {
        name: '',
        data() {
            return {
                url: URL,
                iswx: IS_WX,
                userInfo: USERINFO,
                workTit: '',                         // 作品名
                info: {},
                checkbox: [],
                workImg: '',                         // 作品路径
                workName: '',                        // 作品名称
                cover: '',                          // 封面路径
                imgArr: [],                          // 作品集数组
                img: require("../../assets/re1.png"),
                works: require('../../assets/works.png'),
                headerImage: [],     //用于上传
                ava: '',                            // 用于显示预览(封面)
                dialogType: false,                   // 艺术分类弹窗控制器
                type: [],                            // 艺术分类数组
                typeNum: '',                         // 与index相等则添加颜色
                typeName: '选择分类',                // 选择的分类名
                typeId: '',                          // 选择的分类ID
                typeOldName: '选择分类',              // 记住选择
                dialogUp: false,                     // 资源类型弹框控制器
                upArr: ['文本', '图片', '音频', '视频'],  // 上传分类数组
                upNum: '',                            // 默认为0
                upName: '选择类型',                  // 选择的分类名
                upOldName: '选择类型',                // 记住类型名
                description: '',                     // 资源简介
                formatSize: '',                      // 转码前大小
                upRes: '',                            // 上传的资源
                tt: '',// 测试
                areaArry: [],
                areaId: '',
                uploader: '',
                workUpNum: 0,                            // 上传分类代码
                fileInfo: [],                        // 上传的文件数组
                fileNameInfo: '',                    // 上传的文件名数组
                isUpload: '',                        // 是否可以上传
                fileType: 0,                        // 文件类型,0:图片,1:文本
                isImage:0,                          //是否展示封面图
                resourceArr:[],                          //允许资源数组
                artArr:[],                          //允许艺术门类数组
                artList:[],
            }
        },
        watch: {
            fileNameInfo(a) {
                console.log(a)
            },
        },
        methods: {
          openResource(){
            let newArr=[];
            if(this.resourceArr.length>0){
              this.resourceArr.forEach((item,index)=>{
                if(item=='1001'){
                  newArr.push("视频")
                }else if(item=='1002'){
                  newArr.push("音频")
                }else if(item=='1003'){
                  newArr.push("图片")
                }else if(item=='1004'){
                  newArr.push("文本")
                }
              });
              this.upArr=newArr;
            }
            this.dialogUp=true;
          },
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 获取数据
            getData() {
                let id = this.$route.params.id
                workId(id).then(res => {
                    console.log(res)
                    if (res.waitState === 2) {
                        Toast('投稿时间已结束')
                        this.$router.push('/Creatives/' + id)
                    }
                    this.info = res
                    this.isImage=res.isImage?res.isImage:0;
                    this.resourceArr=res.setResourceType?res.setResourceType.split(","):[];
                    this.artArr=res.setArtType?res.setArtType.split(","):[];
                    this.getBase()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 查看是否可以上传
            canUpload() {
                isUpload(this.info.areaId).then(res => {
                    console.log(res)
                    this.isUpload = res.canUpload
                    if (this.isUpload === false) {
                        this.upArr = ['文本', '图片']
                    }
                })
            },
            // 获取艺术分类
            getBase() {
                let code = '011'
                basecode(code).then(res => {
                    console.log(res)
                    this.type = res
                    this.canUpload()
                }).catch(err => {
                    console.log(err.response)
                })
            },
            // 打开艺术分类列表
            handleOpenType() {
                var newArr=[]
                this.dialogType = true
                if(this.artArr.length>0){
                  this.artArr.forEach((item,index)=>{
                    this.type.forEach((innerItem,innerIndex)=>{
                      if(innerItem.codeStr==item){
                        newArr.push(innerItem);
                      }
                    });
                  });
                  Array.prototype.distinct = function (){
                    var arr = this,
                      result = [],
                      len = arr.length;
                    arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
                      var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
                      if(bool === -1){
                        result.push(v);
                      }
                    })
                    return result;
                  };
                  this.artList=newArr.distinct();
                }
                setTimeout(() => {
                    let id = document.getElementById(this.typeNum)
                    id.scrollIntoView(true)
                }, 100)

            },
            // 选择index，添加对应颜色
            handleCheck(item, i) {
                if (item.upCodeStr) {
                    this.typeOldName = item.codeName
                    this.typeId = item.codeStr
                    this.typeNum = i
                    setTimeout(() => {
                        let id = document.getElementById(this.typeNum)
                        id.scrollIntoView(true)
                    }, 100)
                }
            },
            // 选择分类并关闭窗口
            pickTypeClose() {
                this.typeName = this.typeOldName
                this.dialogType = false
            },
            // 关闭艺术分类弹窗
            closeType() {
                this.dialogType = false
            },
            // 选择index，添加对应颜色
            handleCheckUp(item, i) {
                this.upOldName = item
                this.upNum = i
            },
            // 选择并分类
            pickUpClose() {
                this.upName !== this.upOldName ? this._delFile() : ''
                this.upName = this.upOldName
                this.workUpNum = this.upName === '文本' ? 1 : this.upName === '图片' ? 1 : this.upName === '音频' ? 2 : this.upName === '视频' ? 2 : 0
                this.fileInfo = []
                this.videoUp()
                setTimeout(() => {
                    var a = document.getElementById('upWorks').childNodes
                    a[1].style.width = 1 + 'rem'
                    a[1].style.height = 1 + 'rem'
                }, 1000)
                this.dialogUp = false
            },
            // 关闭资源类型选择
            closeUp() {
                this.dialogUp = false
            },
            // APP点击事件
            handleAppload() {
                let host=upImg.indexOf('http')!=-1?upImg:'http://192.168.2.139:8080'+upImg;
                // 传封面
                JsBridge.callHandler('upload', `${host}/loading/img2m`, (res) => {
                    }
                )
            },
            // 接收app端返回的封面图
            getUpImg() {
                // 封面回调
                JsBridge.registerHandler('getUp', (res) => {
                    let data=JSON.parse(res);
                    this.ava = data.fileId
                    this.cover = data.fileId
                    // Toast(res)
                })
                // 作品回调
                JsBridge.registerHandler('getQiniu', (res) => {
                    let data=JSON.parse(res);
                    this.fileInfo = [data]
                    if(this.fileType===0){
                        this.fileInfo=data.fileId;
                    }
                    if(data.fileName){
                        this.fileNameInfo=data.fileName;
                    }else{
                        this.fileNameInfo=data.name.split('/')[data.name.split('/').length-1];
                    }

                })
            },
            // 上传封面
            upload(e) {
                if (IS_WX) {
                    let files = e.target.files || e.dataTransfer.files;
                    if (!files.length) return;
                    var formdata = new FormData();
                    formdata.append('file', files[0])
                    uploadImg(formdata).then(res => {
                        if(res.ok===true){
                            this.cover = res.fileId
                            this.ava = res.fileId
                        }else {
                            Toast(res.message)
                        }
                    }).catch(err => {
                        console.log(err.response)
                        Toast(err.response.data.msg)
                    })
                    this.imgPreview(files[0]);
                } else {
                    JsBridge.callHandler('upload', `${host}/loading/img2m`, (res) => {

                        }
                    )
                }
            },
            // 转换为base64 预览封面图
            imgPreview(file) {
                let self = this;
                let Orientation;
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;
                if (/^image/.test(file.type)) {
                    // 创建一个reader
                    let reader = new FileReader();
                    // 将图片2将转成 base64 格式
                    reader.readAsDataURL(file);
                    // 读取成功后的回调
                    reader.onloadend = function () {
                        let result = this.result;
                        let img = new Image();
                        img.src = result;
                        //判断图片是否大于100K,是就直接上传，反之压缩图片
                        if (this.result.length <= (100 * 1024)) {
                            // self.ava = this.result;
//                            self.postImg();
                        } else {
                            img.onload = function () {
                                let data = self.compress(img, Orientation);
                                // self.ava = data;
//                                self.postImg();
                            }
                        }
                    }
                }
            },
            compress(img, Orientation) {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d');
                //瓦片canvas
                let tCanvas = document.createElement("canvas");
                let tctx = tCanvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                let ratio;
                if ((ratio = width * height / 4000000) > 1) {
                    console.log("大于400万像素")
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;
                //        铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制
                let count;
                if ((count = width * height / 1000000) > 1) {
                    console.log("超过100W像素");
                    count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                    //            计算每块瓦片的宽和高
                    let nw = ~~(width / count);
                    let nh = ~~(height / count);
                    tCanvas.width = nw;
                    tCanvas.height = nh;
                    for (let i = 0; i < count; i++) {
                        for (let j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    ctx.drawImage(img, 0, 0, width, height);
                }
                //修复ios上传图片的时候 被旋转的问题
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6://需要顺时针（向左）90度旋转
                            this.rotateImg(img, 'left', canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            this.rotateImg(img, 'right', canvas);
                            break;
                        case 3://需要180度旋转
                            this.rotateImg(img, 'right', canvas);//转两次
                            this.rotateImg(img, 'right', canvas);
                            break;
                    }
                }
                //进行最小压缩
                let ndata = canvas.toDataURL('image/jpeg', 0.1);
                console.log('压缩前：' + initSize);
                console.log('压缩后：' + ndata.length);
                console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
            },
            // 上传作品
            handleUpload(e) {
                let host=upImg.indexOf('http')!=-1?upImg:'http://192.168.2.139:8080'+upImg;
                if (IS_WX) {
                    let files = e.target.files || e.dataTransfer.files;
                    let filepath=files[0].name
                    let extStart=filepath.lastIndexOf('.')
                    let ext=filepath.substring(extStart,filepath.length).toUpperCase();
                    if(this.upName==='图片'){
                        if(ext!='.BMP'&&ext!='.PNG'&&ext!='.GIF'&&ext!='.JPG'&&ext!='.JPEG'){
                            Toast('请上传图片')
                            return
                        }
                    }
                    if(this.upName==='文本'){
                        if(ext.toLowerCase()!='.txt'&&ext.toLowerCase()!='.doc'&&ext.toLowerCase()!='.docx'){
                            Toast('请选择文本格式')
                            return
                        }
                    }
                    if (!files.length) return;
                    this.upRes = files[0];
                    this.imgPreviews(files[0]);
                } else {
                    let sourceUrl=upUrl.indexOf('http')!=-1?upUrl:'http://192.168.2.139:8080'+upUrl;
                    let name = this.upName
                    let upType = name === '音频' ? 1 : name === '视频' ? 2 : ''
                    let dataToken = `${sourceUrl}/qiniu/token?type=${upType}&areaId=${this.info.areaId}`
                    if (name === '文本') {
                        this.fileType=1;
                        JsBridge.callHandler('setTxt', `${host}/loading/txt20m`, (res) => {

                            }
                        )
                    } else if (name === '图片') {
                        this.fileType=0;
                        JsBridge.callHandler('setImg', `${host}/loading/img2m`, (res) => {

                            }
                        )
                    } else if (name === '音频') {
                        this.fileType=2
                        JsBridge.callHandler('setMp3', dataToken, (res) => {

                            }
                        )

                    } else if (name === '视频') {
                        this.fileType=3
                        JsBridge.callHandler('setVideo', dataToken, (res) => {

                            }
                        )
                    }
                }

            },
            // 转换为base64 预览封面图
            imgPreviews(file) {
                let self = this;
                let Orientation;
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;
                this.fileNameInfo = file.name
                if (/^image/.test(file.type)) {
                    // 创建一个reader
                    let reader = new FileReader();
                    // 将图片2将转成 base64 格式
                    reader.readAsDataURL(file);
                    // 读取成功后的回调
                    reader.onloadend = function () {
                        let result = this.result;
                        let img = new Image();
                        img.src = result;
                        //判断图片是否大于100K,是就直接上传，反之压缩图片
                        if (this.result.length <= (100 * 1024)) {
                            self.imgArr.push(this.result);
//                            self.postImg();
                        } else {
                            img.onload = function () {
                                let data = self.compress(img, Orientation);
                                self.imgArr.push(data);
//                                self.postImg();
                            }
                        }
                    }
                }
            },
            // 提交作品(图片)
            handleUpWork() {
                if(this.isImage==0){
                  this.cover=this.info.inageUrl;
                }
                if (this.workTit === '') {
                    Toast('作品名不能为空')
                } else if (this.typeName === '选择分类') {
                    Toast('请选择艺术门类')
                } else if (this.upName === '选择类型') {
                    Toast('请选择资源类型')
                } else if (this.cover === '') {
                    Toast('请选择一个封面')
                } else if (this.fileNameInfo === '') {
                    Toast('请选择一个作品')
                } else {
                    var formdata = new FormData();
                    formdata.append('file', this.upRes)
                    console.log(formdata);
                    console.log(this.upRes);
                    if (this.upName === '图片') {
                        if(IS_WX){
                            uploadImg(formdata).then(res => {
                                console.log(res);
                                if(res.ok===true){
                                    this.fileInfo = res.fileId;
                                    this.handleToUpload()
                                }else {
                                    Toast(res.message)
                                    this.fileInfo=''
                                    this.fileNameInfo=''
                                }
                            }).catch(err => {
                                console.log(err.response)
                                Toast(err.response.data.msg)
                            })
                        }else{
                            this.handleToUpload()
                        }
                    } else if (this.upName === '文本') {
                        if(IS_WX){
                            uploadTxt(formdata).then(res => {
                                console.log(res);
                                this.fileInfo = {
                                    name:res.fileName,
                                    value:res.fileId,
                                    size:this.upRes.size,
                                };
                                this.handleToUpload()
                            })
                        }else{
                            this.handleToUpload()
                        }
                    } else {
                        this.handleToUpload()
                    }
                }
            },
            // 提交事件
            handleToUpload() {
                let fileId='';
                if(this.upName === '图片'){
                    fileId=[this.fileInfo]
                }else if(this.upName === '文本'){
                    fileId=this.fileInfo;
                }else{
                    fileId=this.fileInfo;
                }
                let resType = this.upName === '文本' ? InfoSource.RESOURCE_TYPE_LITERATURE : this.upName === '图片' ? InfoSource.RESOURCE_TYPE_IMAGE : this.upName === '音频' ? InfoSource.RESOURCE_TYPE_MUSIC : this.upName === '视频' ? InfoSource.RESOURCE_TYPE_VIDEO : '移动端上传'
                Indicator.open('提交中...')
                let params = {
                    addUserDescription: this.userInfo.ucontent,
                    artType: this.typeId,
                    description: this.description,
                    formatSize: 500,
                    imgurl: this.cover,
                    netGamesAreaId: this.info.areaId,
                    netGamesID: this.$route.params.id,
                    originaSize: 100,
                    resourceType: resType,
                    termsOfAvailability: InfoSource.RESOURCE_UPCHANNEL_FREE,
                    title: this.workTit,
                    url: JSON.stringify(fileId),
                }
                addSpecialResource(params).then(res => {
                    Indicator.close()
                    examineSubmit(res.oid).then(data => {
                        Toast('提交成功')
                        this.$router.push('/Creative')
                    }).catch(err=>{
                        console.log(err.response)
                        Toast('提交失败')
                    })
                }).catch(err => {
                    console.log(err.response)
                    Indicator.close()
                    Toast('提交失败')
                })
            },
            // 页面顶部距离，会置顶
            handleTop() {
                let id = document.getElementById('top')
                id.scrollIntoView(true)
            },
            getArea() {
                let areaId = 0
                areas(areaId).then(res => {
                    res.splice(0, 0, {headChar: 'C', id: '', name: '重庆市'})
                    this.areaArry = res
                    if (IS_WX) {
                        let area = localStorage.getItem('area')
                        if (!area) {
                            this.areaId = 0
                        } else {
                            this.areaArry.map(f => f.name === area ? this.areaId = f.id : '')
                        }
                    } else {
                        JsBridge.callHandler('getArea', '', (data) => {
                            if (data === 'null') {
                                this.areaId = 0
                            } else {
                                this.areaArry.map(f => f.name === data ? this.areaId = f.id : '')
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err.response)
                })
            },
            videoUp() {
                let type = this.upName === '音频' ? 1 : this.upName === '视频' ? 2 : 'null'
                let self = this
                this.uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                    browse_button: 'workUps',         // 上传选择的点选按钮，必需
                    // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                    // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                    // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
//                    uptoken: '', // uptoken是上传凭证，由其他程序生成
                    uptoken_url: `${upUrl}/qiniu/token?type=${type}&areaId=${self.info.areaId}`,         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
//                    uptoken_func: function () {    // 在需要获取uptoken时，该方法会被调用
//                        console.log('获取token...')
//                        return uptoken;
//                    },
                    get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                    // downtoken_url: '/downtoken',
                    // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                    // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                    // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                    domain: '<Your bucket domain>',     // bucket域名，下载资源时用到，必需
                    container: 'upWorks',             // 上传区域DOM ID，默认是browser_button的父元素
                    max_file_size: '100mb',             // 最大文件体积限制
                    flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
                    max_retries: 3,                     // 上传失败最大重试次数
                    dragdrop: false,                     // 开启可拖曳上传
                    drop_element: 'upWorks',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                  // 分块上传时，每块的体积
                    save_key: true,
                    unique_names: false,
                    auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    //x_vars : {
                    //    查看自定义变量
                    //    'time' : function(up,file) {
                    //        var time = (new Date()).getTime();
                    // do something with 'time'
                    //        return time;
                    //    },
                    //    'size' : function(up,file) {
                    //        var size = file.size;
                    // do something with 'size'
                    //        return size;
                    //    }
                    //},
                    init: {
                        'FilesAdded': function (up, files) {
                            plupload.each(files, function (file) {
                                // 文件添加进队列后，处理相关的事情
                                self.fileInfo.push(file)
                                self.fileNameInfo = file.name
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            // 每个文件上传前，处理相关的事情
                            console.log('BeforeUpload')
                            Indicator.open('提交中...')
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时，处理相关的事情
//
                        },
                        'FileUploaded': function (up, file, info) {
                            Indicator.close()
                            if(self.upName==='视频'){
                                if(file.type.indexOf('video')==-1){
                                    Toast('请选择视频格式')
                                    self._delFile();
                                    return
                                }else{
                                    Toast('提交成功')
                                    self.fileInfo[0].qiniu = JSON.parse(info.response)
                                }
                            }
                            if(self.upName==='音频'){
                                if(file.type.indexOf('audio')==-1){
                                    Toast('请选择音频格式')
                                    self._delFile();
                                    return
                                }else{
                                    Toast('提交成功')
                                    self.fileInfo[0].qiniu = JSON.parse(info.response)
                                }
                            }
                            // 每个文件上传成功后，处理相关的事情
                            // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            // 查看简单反馈
                            // var domain = up.getOption('domain');
                            // var res = parseJSON(info.response);
                            // var sourceLink = domain +"/"+ res.key; 获取上传成功后的文件的Url
                        },
                        'Error': function (up, err, errTip) {
                            //上传出错时，处理相关的事情
                            console.log(up)
                            console.log(err)
                            console.log(errTip)
                            Indicator.close()
                            Toast('提交失败')
                        },
                        'UploadComplete': function () {
                            //队列文件处理完毕后，处理相关的事情
                            console.log('UploadComplete')
                        },
                        'Key': function (up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在unique_names: false，save_key: false时才生效
                            var key = "";
                            // do something with key here
                            return key
                        }
                    }
                });

                // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取

                // uploader为一个plupload对象，继承了所有plupload的方法

            },
            // 删除对应文件名及文件数组
            _delFile() {
                this.fileInfo = ''
                this.fileNameInfo = ''
            }
        },
        created() {
            this.getData()
            console.log(USERINFO)
        },
        mounted() {
            this.getArea()
            this.getUpImg()
        },
        filters: {
            text(t) {
                return t.length > 15 ? t.substr(0, 15) + '...' : t
            },
            ucontent(u) {
                return u === '' ? '无' : u
            }
        }
    }
</script>

<style>

</style>
