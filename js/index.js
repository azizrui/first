window.onload = function () {
    var imglist = document.querySelectorAll('.list img');
    var bigimg = document.querySelectorAll('.zoom img')[0];
    //            模拟后台数据
    var imgsrc = [
        {b: "./img/b1.png", s: "./img/s1.png"},
        {b: "./img/b2.png", s: "./img/s2.png"},
        {b: "./img/b3.png", s: "./img/s3.png"},
        {b: "./img/b1.png", s: "./img/s1.png"},
        {b: "./img/b2.png", s: "./img/s2.png"},
        {b: "./img/b3.png", s: "./img/s3.png"},
        {b: "./img/b1.png", s: "./img/s1.png"},
        {b: "./img/b2.png", s: "./img/s2.png"}
    ];

    //放大镜大图索引
    var magnifierId = 0;
    //点击图片显示大图
    for (var i = 0; i < imglist.length; i++) {
        //给imglist中的图片添加索引，使大图的索引与之相对应
        imglist[i].index = i;
        imglist[i].onclick = function () {
            bigimg.src = this.src;
            magnifierId = this.index;
        }
    }
    //以下为缩略图滑动效果

    // 获取元素非行间样式
    function getStyle(obj, attr) {
        //兼容性
        if (obj.currentStyle) {
            return obj.currentStyle(attr);
        } else {
            return window.getComputedStyle(obj)[attr];
        }
    }

    //      缩略图滑动效果
    thumbnail();

    function thumbnail() {
//         左右按钮
        var prevNode = document.querySelector('.wrap .con .mainCon .specScroll .prev');
        var nextNode = document.querySelector('.wrap .con .mainCon .specScroll .next');
//         图片容器(ul)
        var listNode = document.querySelector('.wrap .con .mainCon .specScroll .items .list');
//         获取li
        var liNodes = document.querySelectorAll('.wrap .con .mainCon .specScroll .items .list>li');
//          定义每次滑动的数量
        var moveNum = 2;
//          定义容器中默认显示的数量
        var viewNum = 5;
//          一次移动两张图片   两张图片的宽度 + 两倍的marginRight
//           移动规则 如果剩余距离够移动则正常移动   如果不够 直接走完剩余距离
//         计算总共可以移动的长度   （li总数 - 默认显示li的个数）* （li的宽度+ li的marginRight）
        var countLength = (liNodes.length - viewNum) * (liNodes[0].offsetWidth + parseInt(getStyle(liNodes[0], 'marginRight')))
//          计算每次移动的长度  (一个元素的宽度（带margin）) * 每次移动的数量
        var moveLength = (liNodes[0].offsetWidth + parseInt(getStyle(liNodes[0], 'marginRight'))) * moveNum;
//          初始化已经移动的距离
        var tempLenght = 0;

        nextNode.onclick = function () {
//             如果已经走过的距离 小于总共可以走的距离 才能继续移动
            if (tempLenght < countLength) {
//                  剩余距离 大于每次可以移动的长度   则每次都该走的距离
//                  剩余的距离 = 总共可以走的距离 - 已经移动的距离

                if (countLength - tempLenght > moveLength) {
                    tempLenght += moveLength;
                    listNode.style.left = -tempLenght + 'px';
                } else {
//                    剩余距离小于每次可以移动的距离  则直接走完剩余的
//                     tempLenght += (countLength - tempLenght);
                    tempLenght = countLength;
                    listNode.style.left = -tempLenght + 'px';
                }
//                   假设countLength = 110    每次走的是20
//                    countLength=110     tempLenght= 0
//                    countLength=110     tempLenght= 20   剩余距离90
//                    countLength=110     tempLenght= 40   剩余距离70
//                    countLength=110     tempLenght= 60   剩余距离50
//                    countLength=110     tempLenght= 80   剩余距离30
//                    countLength=110     tempLenght= 100   剩余距离10
            }
        };
        prevNode.onclick = function () {
//              相对于prev按钮来说   可以动的距离 就是tempLenght
            if (tempLenght > 0) {
//                    如果可以走的距离 大于每次移动的距离 则走该走的长度  否则直接为0
                if (tempLenght > moveLength) {
                    tempLenght -= moveLength;
                    listNode.style.left = -tempLenght + 'px';
                } else {
                    tempLenght = 0;
                    listNode.style.left = tempLenght + 'px';
                }
            }
        }

    }

    // 初始化蒙版
    var maskNode = null;
    //初始化大图容器
    var bigImgBoxNode = null;
    //初始化大图
    var bigImgNode = null;
    //获取小图容器
    var zoomNode = document.querySelector('.wrap .con .mainCon .previewWrap .preview .zoom');
    //放大镜
    var preview = document.querySelector('.preview');
    preview.onmouseenter = function () {
        if (!maskNode) {
            //小图容器div，添加到父元素
            maskNode = document.createElement('div');
            maskNode.className = 'mask';
            zoomNode.appendChild(maskNode);
            //大图容器div，添加到父元素
            bigImgBoxNode = document.createElement('div');
            bigImgBoxNode.className = 'bigImgBox';
            preview.appendChild(bigImgBoxNode);
            //创建一个图片节点
            bigImgNode = new Image();
            // bigImgNode.src = bigimg.src;
            bigImgNode.src = imgsrc[magnifierId].b;

            // bigImgNode.
            bigImgBoxNode.appendChild(bigImgNode);
        }
        zoomNode.onmousemove = function (event) {
            //蒙版的位置   鼠标的clientX - 蒙版一半 - 父级距离屏幕边缘的位置
            var maskPosition = {
                left: event.clientX - maskNode.offsetWidth / 2 - zoomNode.getBoundingClientRect().left,
                top: event.clientY - maskNode.offsetHeight / 2 - zoomNode.getBoundingClientRect().top
            };
            if (maskPosition.left <= 0) {
                maskPosition.left = 0;
            } else if (maskPosition.left >= zoomNode.clientWidth - maskNode.offsetWidth) {
                maskPosition.left = zoomNode.clientWidth - maskNode.offsetWidth;
            }
            if (maskPosition.top <= 0) {
                maskPosition.top = 0;
            } else if (maskPosition.top >= zoomNode.clientHeight - maskNode.offsetHeight) {
                maskPosition.top = zoomNode.clientHeight - maskNode.offsetHeight;
            }
            maskNode.style.left = maskPosition.left + 'px'
            maskNode.style.top = maskPosition.top + 'px';
            //大图的位置
            //大图和小图的移动比例
            var scale = 0.5;
            var bigImgPosition = {
                left: maskPosition.left / scale,
                top: maskPosition.top / scale
            };
            bigImgNode.style.marginLeft = -bigImgPosition.left + 'px';
            bigImgNode.style.marginTop = -bigImgPosition.top + 'px';


        }
        preview.onmouseleave = function () {
            //删除节点
            zoomNode.removeChild(maskNode);
            preview.removeChild(bigImgBoxNode);
            maskNode = null;
            bigImgBoxNode = null;
            bigImgNode = null;
            zoomNode.onmousemove = null;
            preview.onmouseleave = null;
        }

    }

    //内容区右侧动态生成
    var crumbData = goodData.goodsDetail.crumbData;
    var chooseArea = document.querySelector('.chooseArea');
    //遍历crumbData数据
    crumbData.forEach(function (item) {
        // 创建节点
        var dlNode = document.createElement('dl');
        var dtNode = document.createElement('dt');
        dtNode.innerHTML = item.title;
        dlNode.appendChild(dtNode);

        //在遍历对象中的对象
        item.data.forEach(function (item) {
            var ddNode = document.createElement('dd');
            ddNode.innerHTML = item.type;
            ddNode.setAttribute('changePrice',item.changePrice);
            dlNode.appendChild(ddNode);


        })
        chooseArea.appendChild(dlNode);
    })
    // 以下是点击筛选内容的交互
    //获取页面中所有的dl
    var dllist = document.getElementsByTagName('dl');
    //设置一个空数组
    var arr = new Array(dllist.length);
    //设置数组中的每个元素都为0
    arr.fill(0);
    //遍历dl,给当前的dd绑定事件
    for (var i = 0; i < dllist.length; i++) {
        //给dl设置index索引
        dllist[i].index = i;
        (function () {
            var ddlist = dllist[i].getElementsByTagName('dd');
            //给dd绑定单击事件
            for (var j = 0; j < ddlist.length; j++) {
                // console.log(arr);
                ddlist[j].onclick = function () {
                    //高亮切换
                    for (var k = 0; k < ddlist.length; k++) {
                        ddlist[k].style.color = '#666';
                    }
                    this.style.color = 'red';
                    arr[this.parentNode.index] = this;
                    priceSum(arr);
                    // console.log(arr);
                    var choosed = document.querySelector('.choosed');
                    choosed.innerHTML = '';
                    //把arr添加到页面
                    arr.forEach(function (item, index) {
                        //判断arr是否有内容，有内容的添加到页面
                        if (item) {
                            var mark = document.createElement('mark');
                            mark.innerHTML = item.innerHTML;
                            mark.className = 'mark';
                            var aNode = document.createElement('a');
                            // setAttribute用于设置元素自定义属性 参数1 属性名称 参数2 要设置的属性值
                            // getAttribute用于获取元素自定义属性
                            aNode.setAttribute('num', index);
                            aNode.innerHTML = 'X';
                            mark.appendChild(aNode);
                            choosed.appendChild(mark);
                        }
                    })
                    console.log(arr);
                    //a标签点击删除mark
                    var aNode = choosed.getElementsByTagName('a');
                    for (var k = 0; k < aNode.length; k++) {
                        aNode[k].onclick = function () {
                            this.parentNode.parentNode.removeChild(this.parentNode);
                            //高亮
                            // 获取当前点击的a标签的索引   去操作对应的dl元素当中dd高亮
                            //使用自定义属性给a添加一个num属性
                            var num = parseInt(this.getAttribute('num'));//返回的结果是一个字符串
                            var ddlist = dllist[num].querySelectorAll('dd');
                            for (var l = 0; l < ddlist.length; l++) {
                                ddlist[l].style.color = '#666';
                            }
                            ddlist[0].style.color = 'red';
                            //将已删除的a在arr数组中的内容设为0
                            arr[num] = 0;
                            priceSum(arr);

                        }
                    }
                }
            }
        })();
    }


    // 商品详情的数据动态生成
    goodsDetail();
    function goodsDetail() {
        var info1Node = document.querySelector('.wrap .con .mainCon .infoWrap .info1');
        // 获取数据
        var infoData = goodData.goodsDetail;
        var info1Content = `<h3 class="infoName">${infoData.title}</h3>
                    <p class="news">${infoData.recommend}</p>
                    <div class="priceArea">
                        <div class="priceArea1">
                            <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
                            <div class="price">
                                <i>¥</i>
                                <em>${infoData.price}</em>
                                <span>降价通知</span>
                            </div>
                            <div class="remark">
                                <i>累计评价</i>
                                <span>3283</span>
                            </div>
                        </div>
                        <div class="priceArea2">
                            <div class="title">促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</div>
                            <div class="fixWidth">
                                <i class="red-bg">${infoData.promoteSales.type}</i>
                                <em>${infoData.promoteSales.content}</em>
                            </div>
                        </div>
                    </div>
                    <div class="support">
                        <div class="supportArea">
                            <div class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</div>
                            <p>${infoData.support}</p>
                        </div>
                        <div class="supportArea">
                            <div class="title">配&nbsp;送&nbsp;至</div>
                            <p>${infoData.address}</p>
                        </div>
                    </div>`;
        info1Node.innerHTML=info1Content;
    }

    //商品数量
    //定义商品默认数量
    var changeNum = 1;
    goodsNum();
    function goodsNum(){
        var inputNode = document.querySelector('.wrap .con .mainCon .choose .cartWrap .controls input');
        var plusNode = document.querySelector('.wrap .con .mainCon .choose .cartWrap .controls .plus');
        var minusNode = document.querySelector('.wrap .con .mainCon .choose .cartWrap .controls .mins');
        console.log(minusNode);
        plusNode.onclick = function(){
            changeNum++;
            inputNode.value = changeNum;
        }
        minusNode.onclick = function(){
            if(changeNum>1){
                changeNum--;
                inputNode.value = changeNum;
            }
        }

    }



    //商品不同选择搭配价钱
    // priceSum();

    function priceSum(arr) {
        var newPrice = goodData.goodsDetail.price;
//                遍历arr数组  然后把里边每一个dd的changePrice加等
        arr.forEach(function (item) {
//                   先判断当前元素 是否有值
            if(item){
                newPrice += parseInt(item.getAttribute('changePrice'));
            }
        });
        console.log(newPrice);
             // 获取价钱容器
        var priceNode = document.querySelector('.wrap .con .mainCon .infoWrap .priceArea .priceArea1 .price em')
        priceNode.innerHTML = newPrice;
//               只要计算价钱 就改变选择搭配的价钱
//         var choosePriceNode = document.querySelector('.wrap .product .detail .fitting .goodSutis .master p')
//         choosePriceNode.innerHTML = '¥'+(newPrice*changeNum);
// //              计算搭配完成的总价
// //            获取搭配后的总价元素
//         var chooseAllPrice = document.querySelector('.wrap .product .detail .fitting .goodSutis .result .price')
// //          获取搭配区域所有的复选框
//         var chooseAllCheckBox = document.querySelectorAll('.wrap .product .detail .fitting .goodSutis .suits .suitsItem input')
//         chooseAllCheckBox.forEach(function (item) {
//             if(item.checked){
//                 newPrice += parseInt(item.value);
//             }
//             chooseAllPrice.innerHTML = '¥'+(newPrice*changeNum);
//         })
    }


    //侧边栏
    var em = document.querySelectorAll('.toolist em');
    var ilist = document.querySelectorAll('.toolist i')
    for (var i = 0; i < em.length; i++) {
        em[i].index = i;
        em[i].onmouseenter = function () {
            ilist[this.index].style.left = '-80px';
            ilist[this.index].style.background = 'firebrick';
            this.style.backgroundColor = 'firebrick';
        }
        em[i].onmouseleave = function () {
            ilist[this.index].style.left = '40px';
            ilist[this.index].style.background = 'peru';
            this.style.backgroundColor = 'peru';
        }
    }
    var btn = document.querySelector('.btn');
    var toolbar = document.querySelector('.toolbar')
    flag = true;
    btn.onclick = function () {
        if (flag) {
            toolbar.style.right = '0';
            this.style.backgroundImage = 'url(./img/cross.png)'
        } else {
            toolbar.style.right = '-294px';
            this.style.backgroundImage = 'url(./img/list.png)'
        }
        flag = !flag;
    }
}

