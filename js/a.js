window.onload = function () {
//        放大镜大图索引
    var magnifierId = 0;
    //          定义商品默认数量
    var changeNum = 1;
//    放大镜效果
    magnifier();
    function magnifier() {
//            模拟后台数据
        var imgsrc = goodData.imgsrc;
//        获取小图容器
        var zoomNode = document.querySelector('.wrap .con .mainCon .previewWrap .preview .zoom');
//        获取放大镜外层容器
        var previewNode = document.querySelector('.wrap .con .mainCon .previewWrap .preview')
//        初始化蒙版
        var maskNode = null;
//        初始化大图容器
        var bigImgBoxNode = null;
//        初始化大图
        var bigImgNode = null;

//        绑定鼠标移入移出事件
        previewNode.onmouseenter = function () {
//        当鼠标移入元素，创建蒙版，大图，大图容器 如果蒙版不存 即可创建 如果存在 不创建
            if(!maskNode){//只要能进这个判断 mask一定是null  说明没有蒙版元素
//                  创建蒙版
                maskNode = document.createElement('div');
//                结合css当中已经存在的class  对蒙版设置样式
                maskNode.className = 'mask';
//                  把蒙版插入到小图容器当中
                zoomNode.appendChild(maskNode);
//                 如果蒙版不存在 大图和大图容器一定也不存在 所以直接同时创建即可
//                 创建大图容器
                bigImgBoxNode = document.createElement('div');
                bigImgBoxNode.className = 'bigImgBox';
//                 创建大图
                bigImgNode = new Image();
//                  bigImgNode = document.createElement('img');
//                   把放大镜生成的大图路径 改为动态
                bigImgNode.src = imgsrc[magnifierId].b;
//                 把大图放入到大图容器当中
                bigImgBoxNode.appendChild(bigImgNode);
//                  把大图容器添加到放大镜结构中
                previewNode.appendChild(bigImgBoxNode);
            }
            zoomNode.onmousemove = function (event) {
//              移动的逻辑
//        当元素移动的时候 蒙版的位置   鼠标的clientX - 蒙版一半 - 父级距离屏幕边缘的位置
                var maskPosition = {
                    left:event.clientX - maskNode.offsetWidth / 2 - zoomNode.getBoundingClientRect().left,
                    top: event.clientY - maskNode.offsetHeight / 2 - zoomNode.getBoundingClientRect().top
                };
//                console.log(maskPosition)
//                判断边界     右侧边界的判断小图容器宽度 - 蒙版宽度
                if(maskPosition.left <= 0){
                    maskPosition.left = 0;
                }else if(maskPosition.left >= zoomNode.clientWidth - maskNode.offsetWidth){
                    maskPosition.left = zoomNode.clientWidth - maskNode.offsetWidth;
                }
                if(maskPosition.top <= 0){
                    maskPosition.top = 0;
                }else if(maskPosition.top >= zoomNode.clientHeight - maskNode.offsetHeight){
                    maskPosition.top = zoomNode.clientHeight - maskNode.offsetHeight;
                }
//                对蒙版进行赋值
                maskNode.style.left = maskPosition.left + 'px';
                maskNode.style.top = maskPosition.top + 'px';
//              计算比例: 蒙版总共可以移动的距离 / 大图能够移动的距离
                var scale = (zoomNode.clientWidth - maskNode.offsetWidth) / (bigImgNode.offsetWidth-bigImgBoxNode.clientWidth)
//              计算大图偏移
                var bigImgPosition = {
                    left:maskPosition.left / scale,
                    top:maskPosition.top / scale
                };
//                给大图修改位置
                bigImgNode.style.marginLeft = - bigImgPosition.left + 'px';
                bigImgNode.style.marginTop = - bigImgPosition.top + 'px';
            };
            previewNode.onmouseleave = function () {
//                删除大图容器  和蒙版
                zoomNode.removeChild(maskNode);
                previewNode.removeChild(bigImgBoxNode);
//              把蒙版元素的变量初始化
                maskNode = null;
                bigImgBoxNode = null;
                bigImgNode = null;
//              事件解绑
                zoomNode.onmousemove = null;
                previewNode.onmouseleave= null;
            }
        }
    }
//        获取元素非行间样式
    function getStyle(obj,attr) {
        if(obj.currentStyle){
            return obj.currentStyle(attr);
        }else{
            return window.getComputedStyle(obj)[attr];
        }
    }
//      缩略图滑动效果
    thumbnail();
    function thumbnail() {
        //         图片容器(ul)
        var listNode = document.querySelector('.wrap .con .mainCon .specScroll .items .list');
//            根据动态数据生成缩略图结构
        var imgSrc = goodData.imgsrc;
        imgSrc.forEach(function (item) {
//              创建li
            var liNode = document.createElement('li');
//              创建图片
            var imgNode = new Image();
//                给图片设置对应的src属性
            imgNode.src = item.s;
//                把图片放入到li中
            liNode.appendChild(imgNode);
//                把li放入到ul中
            listNode.appendChild(liNode)
        });

//         左右按钮
        var prevNode = document.querySelector('.wrap .con .mainCon .specScroll .prev');
        var nextNode = document.querySelector('.wrap .con .mainCon .specScroll .next');

//         获取li
        var liNodes = document.querySelectorAll('.wrap .con .mainCon .specScroll .items .list>li');
//          定义每次滑动的数量
        var moveNum = 2;
//          定义容器中默认显示的数量
        var viewNum = 5;
//          一次移动两张图片   两张图片的宽度 + 两倍的marginRight
//           移动规则 如果剩余距离够移动则正常移动   如果不够 直接走完剩余距离
//         计算总共可以移动的长度   （li总数 - 默认显示li的个数）* （li的宽度+ li的marginRight）
        var countLength = (liNodes.length - viewNum) * (liNodes[0].offsetWidth + parseInt(getStyle(liNodes[0],'marginRight')))
//          计算每次移动的长度  (一个元素的宽度（带margin）) * 每次移动的数量
        var moveLength = (liNodes[0].offsetWidth + parseInt(getStyle(liNodes[0],'marginRight'))) * moveNum;
//          初始化已经移动的距离
        var tempLenght = 0;

        nextNode.onclick = function () {
//             如果已经走过的距离 小于总共可以走的距离 才能继续移动
            if(tempLenght < countLength){
//                  剩余距离 大于每次可以移动的长度   则每次都该走的距离
//                  剩余的距离 = 总共可以走的距离 - 已经移动的距离

                if(countLength - tempLenght > moveLength){
                    tempLenght += moveLength;
                    listNode.style.left = -tempLenght + 'px';
                }else{
//                    剩余距离小于每次可以移动的距离  则直接走完剩余的
                    tempLenght += (countLength - tempLenght);
                    listNode.style.left = - tempLenght + 'px';
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
            if(tempLenght > 0){
//                    如果可以走的距离 大于每次移动的距离 则走该走的长度  否则直接为0
                if(tempLenght > moveLength){
                    tempLenght -= moveLength;
                    listNode.style.left = - tempLenght + 'px';
                }else{
                    tempLenght = 0;
                    listNode.style.left = tempLenght + 'px';
                }
            }
        }
    }
//      缩略图点击效果
    thumbnailClick();
    function thumbnailClick() {
//           获取容器中图片的集合
        var scrollItems = document.querySelectorAll('.wrap .con .mainCon .specScroll .items .list li>img');
//          获取小图
        var zoomImgNode = document.querySelector('.wrap .con .mainCon .previewWrap .preview .zoom>img');
//          给所有图片单击事件
        for (var i = 0; i < scrollItems.length; i++) {
//                scrollItems[i].index = i;
            scrollItems[i].onclick = function () {
                for (var j = 0; j < scrollItems.length; j++) {
                    if(scrollItems[j] == this){
//          当点击是  我能够获得缩略图的索引  通过这个索引可以去数据当中照当对应的大图路径
                        magnifierId = j;
                    }
                }
//                  修改小图
                zoomImgNode.src = this.src;
            }
        }
    }
//        商品内容筛选 动态生成
    screening();
    function screening() {
//          模拟数据
        var crumbData = goodData.goodsDetail.crumbData;
//          获取容器元素
        var chooseAreaNode = document.querySelector('.wrap .con .mainCon .choose .chooseArea')
        crumbData.forEach(function (item) {
//              每次遍历进来 先创建一个dl标签
            var dlNode = document.createElement('dl');
//               每一个dl当中都只有一个dt  所以在这里同步创建即可
            var dtNode = document.createElement('dt');
//                通过title属性  给每一个dt设置文本
            dtNode.innerHTML = item.title;
//                把dt插入到dl中
            dlNode.appendChild(dtNode);

//                遍历每一个对象当中的data属性   动态创建dd
            item.data.forEach(function (item) {
//                  生成dd
                var ddNode = document.createElement('dd');
//                  给dd插入内容
                ddNode.innerHTML = item.type;
//                   给生成的dd添加自定义属性 保存对价格的修改
                ddNode.setAttribute('changePrice',item.changePrice);
//                  把dd插入到dl中
                dlNode.appendChild(ddNode);
            });

//              把当前遍历生成的dl插入到页面中
            chooseAreaNode.appendChild(dlNode);
        });
//            以下是点击筛选内容的交互
//            获取dl集合
        var dlList = chooseAreaNode.getElementsByTagName('dl');
//            定义一个数组，数组中保存筛选条件，需要的时候 按顺序保存和获取里边的内容
//            并且 保证数组中只有dlList.length(crumbData.length)个值 当更换数据时 直接替换原有位置即可
        var arr = new Array(crumbData.length);
//            填充数组   用传入的值填充整个数组
        arr.fill(0);
        console.log(arr);
//            var arr = [];
//            for (var i = 0; i < crumbData.length; i++) {
//                arr.push(0);
//            }
//            遍历所有的dl标签 然后给当前的dl标签中的dd绑定事件
        for (var i = 0; i < dlList.length; i++) {
//                给每一个dl添加索引
            dlList[i].index = i;
//                获取当前dl标签中所有的dd
            (function () {
                var ddList = dlList[i].getElementsByTagName('dd');
//                对所有的dd绑定单击事件
                for (var j = 0; j < ddList.length; j++) {
                    ddList[j].onclick = function () {
//                      dd高亮切换
//                        先恢复所有dd的默认颜色
                        for (var i = 0; i < ddList.length; i++) {
                            ddList[i].style.color = '#666';
                        }
                        this.style.color = 'red';
//                          用户点击了dd 根据当前的dd找到对应的dl获取索引 然后修改数组内容
                        arr[this.parentNode.index] = this;
//                          更新了新的选择结果  重新计算价钱
                        priceSum(arr);
                        console.log(arr);
//                          获取存放选择结果的容器
                        var choosedNode = document.querySelector('.wrap .con .mainCon .choose .chooseArea .choosed')
//                          每次创建元素之前先把 结果容器清空
                        choosedNode.innerHTML = '';
//                            遍历数组 生成对应的选择结果
                        arr.forEach(function (item,index) {
//                               检测数组，当当前元素不为0的时候 创建mark标签
                            if(item){
//                                    创建mark标签
                                var markNode = document.createElement('mark');
//                                    把数组的内容放到mark标签中
                                markNode.innerHTML = item.innerHTML;
//                                    创建mark标签中的a标签
                                var aNode = document.createElement('a');
//                                  创建a标签时用一个自定义属性保存当前a所在数组的下标
//                                  setAttribute用于设置元素自定义属性 参数1 属性名称 参数2 要设置的属性值
//                                  getAttribute用于获取元素自定义属性
                                aNode.setAttribute('num',index);
                                aNode.innerHTML = 'X';
//                                    把A标签放入到mark中
                                markNode.appendChild(aNode);
//                                    把mark标签放入到存放选择结果的容器中
                                choosedNode.appendChild(markNode);
                            }
                        });
//                          获取mark标签中所有的a标签
                        var aList = choosedNode.querySelectorAll('mark>a');
                        for (var i = 0; i < aList.length; i++) {
                            aList[i].onclick = function () {
//                                    获取当前点击的a标签的索引   去操作对应的dl元素当中dd高亮
                                var num = parseInt(this.getAttribute('num'));//返回的结果是一个字符串
//                                  删除掉当前点击的mark标签
                                this.parentNode.parentNode.removeChild(this.parentNode);
                                var ddList = dlList[num].querySelectorAll('dd');
                                for (var i = 0; i < ddList.length; i++) {
                                    ddList[i].style.color = '#666'
                                }
//                                  把默认的颜色给上去
                                ddList[0].style.color = 'red';
//                                  每一次删除一个内容的时候 要把当前数组当中对应的元素清空
                                arr[num] = 0;
//                                  在删除的时候数组改变  调用价格改变函数
                                priceSum(arr);
                            }
                        }
                    }
                }
            })();
        }
//          计算价钱的函数
//          只要保存筛选条件的数组被操作了 则调用该函数 所以可以吧数组当做传输传递过来
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
//              获取价钱容器
            var priceNode = document.querySelector('.wrap .con .mainCon .infoWrap .priceArea .priceArea1 .price em')
            priceNode.innerHTML = newPrice;
//               只要计算价钱 就改变选择搭配的价钱
            var choosePriceNode = document.querySelector('.wrap .product .detail .fitting .goodSutis .master p')
            choosePriceNode.innerHTML = '¥'+(newPrice*changeNum);
//              计算搭配完成的总价
//            获取搭配后的总价元素
            var chooseAllPrice = document.querySelector('.wrap .product .detail .fitting .goodSutis .result .price')
//          获取搭配区域所有的复选框
            var chooseAllCheckBox = document.querySelectorAll('.wrap .product .detail .fitting .goodSutis .suits .suitsItem input')
            chooseAllCheckBox.forEach(function (item) {
                if(item.checked){
                    newPrice += parseInt(item.value);
                }
                chooseAllPrice.innerHTML = '¥'+(newPrice*changeNum);
            })
        }
    }
    //      选择搭配价钱
    fittingPrice();
    function fittingPrice() {
//            获取搭配后的总价元素
        var chooseAllPrice = document.querySelector('.wrap .product .detail .fitting .goodSutis .result .price')
//          获取搭配区域所有的复选框
        var chooseAllCheckBox = document.querySelectorAll('.wrap .product .detail .fitting .goodSutis .suits .suitsItem input')
//          给所有的复选框 绑定单击事件
        for (var i = 0; i < chooseAllCheckBox.length; i++) {
            chooseAllCheckBox[i].onclick = function () {
//                  获取原价元素
                var choosePriceNode = document.querySelector('.wrap .product .detail .fitting .goodSutis .master p')
//                  获取原价
                var choosePrice = parseInt(choosePriceNode.innerHTML.substr(1));
//                  遍历所有的复选框 判断哪一个被选中
                chooseAllCheckBox.forEach(function (item) {
//                     如果当前的多选框被选中 则返回的checked属性为true
                    if(item.checked){
                        choosePrice+= parseInt(item.value);
                    }
                });
                chooseAllPrice.innerHTML = '¥'+choosePrice;
            }
        }
    }
//        商品数量交互
    goodsNum();
    function goodsNum() {
        var inputNode = document.querySelector('.wrap .con .mainCon .choose .cartWrap .controls input');
        var plusNode = document.querySelector('.wrap .con .mainCon .choose .cartWrap .controls .plus');
        var minusNode = document.querySelector('.wrap .con .mainCon .choose .cartWrap .controls .minus');

        plusNode.onclick = function () {
            changeNum++;
            inputNode.value = changeNum;
            changeFittingPrice()
        };
        minusNode.onclick = function () {
//               商品数量最小值为1
            if(changeNum > 1){
                changeNum--;
                inputNode.value = changeNum;
                changeFittingPrice()
            }
        }
//           封装一个 改变数量就改变搭配总价的函数
        function changeFittingPrice() {
            var priceNode = document.querySelector('.wrap .con .mainCon .infoWrap .priceArea .priceArea1 .price em')
//              需要修改的价格就是  单价*数量
            var finalPrice = priceNode.innerHTML*changeNum;
            console.log(finalPrice);

//                改变选择搭配价钱
            var choosePrice = document.querySelector('.wrap .product .detail .fitting .goodSutis .master p')
            choosePrice.innerHTML = '¥'+finalPrice;

//                修改搭配后的价钱
//            获取搭配后的总价元素
            var chooseAllPrice = document.querySelector('.wrap .product .detail .fitting .goodSutis .result .price')
//          获取搭配区域所有的复选框
            var chooseAllCheckBox = document.querySelectorAll('.wrap .product .detail .fitting .goodSutis .suits .suitsItem input')
            chooseAllCheckBox.forEach(function (item) {
                if(item.checked){
                    finalPrice += parseInt(item.value);
                }
                chooseAllPrice.innerHTML = '¥'+finalPrice;
            })
        }
    }
//        路径导航动态生成
    pathUrl();
    function pathUrl() {
//         获取容器
        var conPoinNode = document.querySelector('.wrap .con .conPoin');
//         获取数据
        var path = goodData.path;
//            遍历路径的数据
        path.forEach(function (item,index) {
//               遍历的时候创建a标签
            var aNode = document.createElement('a');
//                先判断数据有没有url属性
            if(index == path.length-1){
//                 最后一个a标签  没有href属性  也不需要创建i标签
                aNode.innerHTML = item.title;
                conPoinNode.appendChild(aNode);
            }else {
                aNode.href = item.url;
                aNode.innerHTML = item.title;
                conPoinNode.appendChild(aNode);
                var iNode = document.createElement('i');
                iNode.innerHTML = '/';
                conPoinNode.appendChild(iNode);
            }
        })
    }
//      商品详情的数据动态生成
    goodsDetail();
    function goodsDetail() {
//       获取容器
        var info1Node = document.querySelector('.wrap .con .mainCon .infoWrap .info1');
//       获取数据
        var infoData = goodData.goodsDetail;
        var num = 1;
//            var str = 'haha'+num+'hehe'
//            ${变量}   就可以再字符串当中正常解析
//            字符串拼接
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
                                <i>${infoData.promoteSales.type}</i>
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
        info1Node.innerHTML = info1Content;
    }
//      选项卡封装
    function Tab(btns,content) {
        this.tabBtn = btns;
        this.content = content;
//          保存当前的this，用于内部事件的回调函数访问外部的this
        var _this = this;

//           给所有的btn绑定单击事件
        for (var i = 0; i < this.tabBtn.length; i++) {
//               需要给所有的按钮添加索引
            this.tabBtn[i].index = i;
            this.tabBtn[i].onclick = function () {
//                    this  事件源
                _this.clickBtn(this)
            }
        }
    }
    Tab.prototype.clickBtn = function (btn) {
//            btn接受的就是当前点击的事件源
//          选项卡切换
        for (var i = 0; i < this.tabBtn.length; i++) {
            this.tabBtn[i].className = '';
            this.content[i].style.display = 'none';
        }
        btn.className = 'active';
        this.content[btn.index].style.display = 'block';
    }
//      侧边栏调用tab切换
    asideNav();
    function asideNav() {
        var tabNodes = document.querySelectorAll('.wrap .product > aside .tabWrap>h4');
        var contentNodes = document.querySelectorAll('.wrap .product > aside .tabContent .tabItem');
        new Tab(tabNodes,contentNodes);
    }
//      评论区域tab切换
    intro();
    function intro() {
        var tabNodes = document.querySelectorAll('.wrap .product .detail .intro .tabWrap li');
        var contentNodes = document.querySelectorAll('.wrap .product .detail .intro .tabContent .tabItem')
        new Tab(tabNodes,contentNodes);
    }

};