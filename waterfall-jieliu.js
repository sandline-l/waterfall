var li = document.getElementsByTagName('li'),
    len = li.length,
    flag = true,
    num,
    myindex;
var n = 1;

//用ajax来获取后台数据，当flag为true时允许获取数据，并将flag设为false，使开关关闭
function getData() {
    if (flag) {
        flag = false;
        ajax("get", "getPics.php", addDom, "cpage=" + n, true);
        n++;
    }
}
//第一次获取数据
getData();
//用回调函数处理获取到的数据，动态生成div，再插入li中
function addDom(data) {
    //将后台的数据处理为json格式
    var list = JSON.parse(data);
    // console.log(list);
    //判断，当数据长度大于0时（数据不为空的时候），创建Dom元素
    //当后台没有那么多数据的时候，会返回一个null给你，这是候，就不需要进行下面的处理了
    if (list.length > 0) {
        //对数据遍历，并将img加到div中
        list.forEach(function (ele, index) {
            var div = document.createElement('div'),
                p = document.createElement('p'),
                img = new Image();
            img.src = ele.preview;
            p.innerHTML = ele.title;
            div.appendChild(img);
            div.appendChild(p);
            //提前设置好图片的高度，给图片占位，防止在图片没加载时叠加几个图片在一个li中
            img.style.height = ele.height / ele.width * 200 + 'px';
            img.onerror=function(){
                img.style.margin='-1px';
                img.style.width='202px';
            }
            myindex = mymin(li);
            li[num].appendChild(div);
            //img加载好之后再将div添加到最短的li中，
            //！！！不能用onload事件来等待图片加载之后再添加。会使用户体验不好！！！          
            // img.onload = function () {
            //     myindex = mymin(li);
            //     li[num].appendChild(div);
            // }
        });
    }
    //如果不加锁的话，可能在你滚动到最后面的时候，数据还没加载完，但是你又在不停的请求ajax
    //请求了多个ajax，在数据加载完之后，一次给你返回很多数据
    //当Dom文档加载完成之后，将锁解开。以便再次通过ajax来获取数据
    flag = true;
}

//寻找最短的li的函数
function mymin(dom) {
    var min = dom[0].offsetHeight;
    //为什么要加num=0呢？没加就有问题
    //原因是，当某次寻找时，正好是第一列最短，那么进入for循环之后，因为min > dom[i].offsetHeight不符合
    //所以不会进入if里面，然后就是返回一个num。而此时的num值还是上一次最短时取的值，所以就会继续在上一次的li上加图片
    //然后再寻找最短li时，又会陷入刚刚的问题中，num取得值还是上一次的，而无法取到0。因此就会出现这种不断的在一个li
    //上加图片的现象。
    num = 0;
    for (var i = 1; i < len; i++) {
        if (min > dom[i].offsetHeight) {
            min = dom[i].offsetHeight;
            num = i;
        }
    }
    return num;
}

//当滚动高度加上视口高度大于最短li的高度时，重新执行getDate函数，来获取新的数据
window.onscroll = throttle(show, 1000);

function throttle(func, wait) {
    var timer = null;
    return function () {
        var _this = this;
        var argus = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                func.apply(_this, argus);
                timer = null;
            }, wait)
        }
    }
}
function show() {
    //滚轮滚动的高度
    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
    //视口的高度
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //最短li的高度
    var pageHeigh = li[mymin(li)].offsetHeight;
    if (scrollHeight + clientHeight > pageHeigh) {
        getData();
    }
}


















