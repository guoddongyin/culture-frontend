<template>
    <div id="home">
        <div class="tops">
            <i @click="handleBack" class=" iconfont icon-left"></i>
            <span>服务完成确认</span>
        </div>
        <div class="homeCenter" style="margin-bottom: 0rem">
            <div class="overOrderTop flex">
                <div class="overText">是否配送</div>
                <div class="overRight">
                    <yd-radio-group v-model="radio" color="#fa711b">
                        <yd-radio val="1">未配送</yd-radio>
                        <yd-radio val="2">已配送</yd-radio>
                    </yd-radio-group>
                </div>
            </div>
            <!--未配送-->
            <div v-if="radio==='1'">
                <div style="padding: 0.4rem">
                    <i style="color: red">*</i>未配送原因：
                </div>
                <textarea class="markText" v-model="mark" name="" id="" cols="30" rows="10"
                          placeholder="请输入未配送原因(必填)"></textarea>
            </div>
            <!--已配送-->
            <div v-if="radio==='2'">
                <div class="overOrderTop flexs">
                    <div class="overText">送出您的评价</div>
                    <div class="overRight">
                        <yd-rate slot="left" v-model="rate"></yd-rate>
                    </div>
                </div>
                <div style="padding: 1.05rem 0;background-color: #ffffff;border-bottom: 1px solid #e5e5e5">
                    <input type="file" :accept="mediaType" id="workUp" @change="handleUpload"
                           style="display: none"/>
                    <input type="file" :accept="videoMediaType" id="workUp2" @change="handleUpload"
                           style="display: none"/>
                    <label style="display: block;margin-left:0.4rem;" for="workUp">
                        <div style="display: inline-block;margin-right:0.1rem">活动图片：</div>
                        <div style="display: inline-block;display: inline-block;width:2.5rem;height:1rem;line-height: 1rem;text-align: center; background-color: #ff883e;border-radius: 0.15rem;" @click="getUploadType(0)">
                            添加图片
                        </div>
                    </label>
                    <div class="uploadImg flexs">
                        <div v-if="urlImg.length>0" style="position: relative">
                            <img :src="urlImg[0]" alt="">
                            <i @click="handleDel(urlImg[0],0,0)" class="iconfont icon-error-20170103"></i>
                        </div>
                    </div>
                    <label style="display: block;margin-left:0.4rem;" for="workUp2">
                        <div style="display: inline-block;margin-right:0.1rem">活动视频：</div>
                        <div style="display: inline-block;width:2.5rem;height:1rem;line-height: 1rem;text-align: center; background-color: #ff883e;margin-top:0.3rem;border-radius: 0.15rem;" @click="getUploadType(1)">
                            添加视频
                        </div>
                    </label>
                    <div class="uploadImg flexs">
                        <div v-if="videoName.length>0"  style="position: relative">
                            {{videoName[0]}}
                            <i @click="handleDel(videoName[0],0,1)" class="iconfont icon-error-20170103" style="top: -0.5rem;right: -0.4rem;"></i>
                        </div>
                    </div>
                    <!--<div v-if="urlImg.length>=9" @click="handleTit" class="flexCenter uploadOrder">-->
                        <!--上传图片/视频-->
                    <!--</div>-->
                </div>
                <!--<div class="uploadImg flexs">-->
                    <!--<div v-if="urlImg.length>0" style="position: relative">-->
                        <!--<img :src="urlImg[0]" alt="">-->
                        <!--<i @click="handleDel(urlImg[0],0,0)" class="iconfont icon-error-20170103"></i>-->
                    <!--</div>-->
                    <!--<div v-if="videoName.length>0"  style="position: relative">-->
                        <!--{{videoName[0]}}-->
                        <!--<i @click="handleDel(videoName[0],0,1)" class="iconfont icon-error-20170103" style="top: -0.5rem;right: -0.4rem;"></i>-->
                    <!--</div>-->
                <!--</div>-->
            </div>

            <div style="padding: 0.4rem">预约申请</div>
            <div class="apply">
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">预约单号:</div>
                        <div class="rightText">{{ info.applyno }}</div>
                    </div>
                </div>
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">预约时间:</div>
                        <div class="rightText">{{ info.applydate }}</div>
                    </div>
                </div>
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">申请单位:</div>
                        <div class="rightText">{{ info.applyUnit }}</div>
                    </div>
                </div>
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">需求地点:</div>
                        <div class="rightText">{{ info.add }}</div>
                    </div>
                </div>
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">联 系 人:</div>
                        <div class="rightText">{{ info.linkMan }}</div>
                    </div>
                </div>
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">联系电话:</div>
                        <div class="rightText">{{ info.telphone }}</div>
                    </div>
                </div>
            </div>
            <div class="apply">
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">文化作品:</div>
                        <div class="rightText">{{ info.itemname }}</div>
                    </div>
                </div>
                <div class="orderApply">
                    <div class="text">
                        <div class="leftText">志 愿 者:</div>
                        <div class="rightText">{{ name }}</div>
                    </div>
                </div>
            </div>
            <div @click="handleSubmit" class="applySubmit">
                完成确认
            </div>
        </div>
    </div>
</template>

<script>
    import { applyId, applyShure, uploadImg, appupload,itemvol } from '../../api/api'
    import { Indicator, Toast } from 'mint-ui'

    export default {
        name: '',
        data() {
            return {
                rate: 5,                          // 评价星数默认5星
                radio: '2',                        // 单选框默认已配送
                url: URL,
                info: {},                          // 基础数据
                mark: '',                          // 未配送原因
                urlImg: [],                          // 用于预览
                imgs: [],                            // 存储上传图片集合
                picture: [],
                pickImg: [],                         //
                video: '',                           // 视频文件
                videoName:[],                               // 用于上传视频
                name:'',
                uploadType:0,                         //0:：图片 1：视频
                mediaType:'image/gif, image/jpeg, image/png',
                videoMediaType:'audio/mp4, video/mp4, application/ogg, audio/ogg, video/mpeg, video/mpeg',
            }
        },
        watch:{
            // 监听单选框的值
            radio(r){
                if(r==='1'){
                    this.imgs = []
                    this.handleDel('',0,0);
                    this.handleDel('',0,1);
                    this.rate = 0
                }else {
                    this.mark = ''
                }
            }
        },
        methods: {
            getUploadType(type){
                this.uploadType=type;
            },
            // 返回
            handleBack() {
                this.$router.go(-1)
            },
            // 获取数据
            getData() {
                applyId(this.$route.params.id).then(res => {
                    console.log(res)
                    this.info = res
                    this.info.add = res.venueCity + res.venueCounty + res.venueStreet
                    this.getName(res.itemOid)
                }).catch(err => {
                    console.log(res)
                })
            },
            // 获取自愿者名字
            getName(id){
                itemvol(id).then(res=>{
                    console.log(res)
                    this.name=res.volname
                })
            },
            // 提交 先上传图片
            handleSubmit() {
                let id = this.$route.params.id
                // 如果有图片就先上传图片，没有图片则上传视频
                if (this.pickImg.length > 0) {
                    let imgs = []
                    this.pickImg.map((m, i) => {
                        imgs[i] = {}
                        imgs[i].beforeName = m.name
                        imgs[i].mem = m.size
                        // fromData需要放到循环内部
                        var formdata = new FormData()
                        formdata.append('file', m)
                        uploadImg(formdata).then(res => {
                            if (res.ok === true) {
                                imgs[i].url = res.fileId
                                // 上传完图片后，上传视频
                                console.log(imgs.length+'='+i)
                                if (imgs.length-1 === i) {
                                    this.imgs = imgs
                                    this.uploadVideo()
                                }
                            }
                            Toast(res.msg)
                        }).catch(err => {
                            Indicator.close()
                            Toast('提交失败')
                        })
                    })
                } else {
                    // 如果有视频则上传视频
                    if (this.video.length>0) {
                        this.uploadVideo()
                    } else {
                        // 没有图片没有视频，直接提交
                        this.handleUp()
                    }
                }
            },
            // 上传视频
            uploadVideo() {
                if (this.video.length>0) {
                    var formdata = new FormData()
                    formdata.append('Filedata', this.video)
                    formdata.append('FiledataFileName', this.video.name)
                    formdata.append('id', this.$route.params.id)
                    formdata.append('operatorID', USERINFO.id)
                    Indicator.open('提交中')
                    appupload(formdata).then(res => {
                        console.log(res)
                        this.videoName[0]={}
                        this.videoName[0].beforeName=res.fileName
                        this.videoName[0].id=this.$route.params.id
                        this.videoName[0].remark=''
                        this.handleUp()
                    }).catch(err => {
                        console.log(err.response)
                        Indicator.close()
                    })
                } else {
                    Indicator.close()
                    this.handleUp()
                }

            },
            // 提交请求
            handleUp() {
                var isContinue=true;
                if (this.radio === '1') {
                    this.imgs = []
                    this.videoName = []
                    this.rate = 0
                    if(this.mark===''){
                        Toast('请输入未配送原因')
                      isContinue=false;
                    }
                } else {
                    this.mark = ''
                }
                if(isContinue){
                  Indicator.open('提交中')
                  let params = {
                    escremark: this.mark,
                    imgs: this.imgs,
                    isdelivery: Number(this.radio),
                    starsnumber: this.rate,
                    videos: this.videoName
                  }
                  let id=this.$route.params.id
                  applyShure(id,params).then(res => {
                    console.log(res)
                    Indicator.close()
                    Toast('提交成功')
                    this.$router.go(-1)
                  }).catch(err => {
                    console.log(err.response)
                    Indicator.close()
                    Toast(err.response.data.msg)
                  })
                }

            },
            // 选择文件
            handleUpload(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                if (/(?:jpg|gif|png|jpeg)$/i.test(e.target.value)&&this.uploadType===0) {
                    let pickImg = files[0];
                    this.pickImg.push(pickImg)
                    console.log(this.pickImg)
                    this.imgPreview(pickImg);
                } else if (/(?:avi|dat|mpg|wmv|asf|rm|rmvb|mov|flv|mp4|3gp|dv|divx|qt|asx)$/i.test(e.target.value)&&this.uploadType===1) {
                    this.video = files[0];
                    this.videoName.length>0?this.videoName[0]=this.video.name:this.videoName.push(this.video.name);
                } else {
                    if(this.uploadType===0){
                        Toast('请上传图片格式的文件')
                    } else{
                        Toast('请上传视频格式的文件')
                    }

                }
            },
            // 转换为base64用于预览
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
                            self.urlImg.push(this.result);
//                            self.imgs.push(this.result);
                        } else {
                            img.onload = function () {
                                let data = self.compress(img, Orientation);
                                self.urlImg.push(data);
//                                self.imgs.push(data);
                            }
                        }
                    }
                }
            },
            // 压缩
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
            // 提示
            handleTit() {
                Toast('最多上传9张图片')
            },
            //删除照片
            handleDel(item, index,type) {
                if(type===0){
                    this.urlImg.splice(index, 1);
                    this.pickImg.splice(index, 1)
                }else{
                    this.videoName.splice(index, 1);
                    this.video=[];
                }
            },

        },
        created() {
            this.getData()
        }
    }
</script>

<style>

</style>
