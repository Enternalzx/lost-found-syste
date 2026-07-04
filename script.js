// 存储键名
const STORAGE_KEY = 'lostFoundData_v2';

// 读取数据
function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 保存数据
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 渲染列表
function renderList() {
    const listEl = document.getElementById('cardList');
    const emptyTip = document.getElementById('emptyTip');
    const searchVal = document.getElementById('searchInput').value.trim().toLowerCase();
    const typeVal = document.getElementById('typeFilter').value;

    let data = getData();
    
    // 类型筛选
    if (typeVal !== 'all') {
        data = data.filter(item => item.type === typeVal);
    }

    // 关键词搜索
    if (searchVal) {
        data = data.filter(item => 
            item.name.toLowerCase().includes(searchVal) || 
            item.location.toLowerCase().includes(searchVal)
        );
    }

    // 更新统计
    const allData = getData();
    document.getElementById('totalStat').textContent = allData.length;
    document.getElementById('lostStat').textContent = allData.filter(i => i.type === 'lost').length;
    document.getElementById('foundStat').textContent = allData.filter(i => i.type === 'found').length;

    // 空数据处理
    if (data.length === 0) {
        listEl.innerHTML = '';
        emptyTip.style.display = 'block';
        return;
    }
    emptyTip.style.display = 'none';

    // 渲染卡片
    listEl.innerHTML = data.map(item => `
        <div class="card ${item.type}">
            <div class="card-header">
                <span class="card-tag">${item.type === 'lost' ? '寻物启事' : '失物招领'}</span>
            </div>
            <div class="card-title">${item.name}</div>
            <div class="card-meta">
                <div class="card-location">📍 ${item.location}</div>
                <div class="card-time">发布于 ${item.time}</div>
            </div>
            <div class="card-desc">${item.desc}</div>
            <div class="card-btns">
                <button class="card-btn detail" onclick="showDetail(${item.id})">查看详情</button>
                <button class="card-btn del" onclick="deleteItem(${item.id})">删除</button>
            </div>
        </div>
    `).join('');
}

// 显示详情
function showDetail(id) {
    const data = getData();
    const item = data.find(i => i.id === id);
    if (!item) return;

    document.getElementById('detailType').textContent = item.type === 'lost' ? '寻物启事' : '失物招领';
    document.getElementById('detailName').textContent = item.name;
    document.getElementById('detailLocation').textContent = '📍 ' + item.location;
    document.getElementById('detailTime').textContent = item.time;
    document.getElementById('detailDesc').textContent = item.desc;
    document.getElementById('detailPhone').textContent = item.phone;
    
    document.getElementById('detailModal').classList.add('show');
}

// 关闭详情弹窗
function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// 打开发布弹窗
function openPublishModal() {
    document.getElementById('publishModal').classList.add('show');
}

// 关闭发布弹窗
function closePublishModal() {
    document.getElementById('publishModal').classList.remove('show');
    document.getElementById('pubName').value = '';
    document.getElementById('pubPhone').value = '';
    document.getElementById('pubLocation').value = '';
    document.getElementById('pubDesc').value = '';
}

// 提交发布
function submitPublish() {
    const type = document.getElementById('pubType').value;
    const name = document.getElementById('pubName').value.trim();
    const phone = document.getElementById('pubPhone').value.trim();
    const location = document.getElementById('pubLocation').value.trim();
    const desc = document.getElementById('pubDesc').value.trim();

    if (!name || !phone || !location || !desc) {
        alert('请填写完整信息后再提交');
        return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newItem = {
        id: Date.now(),
        type: type,
        name: name,
        location: location,
        desc: desc,
        phone: phone,
        time: timeStr
    };

    const data = getData();
    data.unshift(newItem);
    saveData(data);
    renderList();
    closePublishModal();
    alert('发布成功！');
}

// 删除信息
function deleteItem(id) {
    if (!confirm('确定要删除这条信息吗？此操作不可恢复。')) {
        return;
    }
    let data = getData();
    data = data.filter(item => item.id !== id);
    saveData(data);
    renderList();
}

// 初始化默认示例数据（共22条）
function initData() {
    const data = getData();
    if (data.length === 0) {
        const defaultData = [
            // 寻物启事 11条
            {
                id: Date.now() - 1 * 86400000,
                type: 'lost',
                name: '黑色华为平板电脑',
                location: '图书馆三楼电子阅览室',
                desc: '黑色华为MatePad，保护套是深蓝色海贼王图案，内有专业课程笔记和期末复习资料，对本人十分重要，捡到必有重谢。',
                phone: '138****1234',
                time: '2025-05-26 16:20'
            },
            {
                id: Date.now() - 2 * 86400000,
                type: 'lost',
                name: '银色苹果笔记本电脑',
                location: '第二教学楼204教室',
                desc: '银色MacBook Air，电脑壳有轻微划痕，桌面壁纸是星空图，里面有毕业设计源码和答辩PPT，万分着急，捡到请联系。',
                phone: '159****5678',
                time: '2025-05-25 10:15'
            },
            {
                id: Date.now() - 3 * 86400000,
                type: 'lost',
                name: '蓝色膳魔师保温杯',
                location: '三号教学楼305教室',
                desc: '膳魔师深蓝色保温杯，杯身有宇航员贴纸，杯底有轻微磕碰，里面泡了枸杞菊花茶，有纪念意义，捡到请归还。',
                phone: '136****9012',
                time: '2025-05-24 09:45'
            },
            {
                id: Date.now() - 4 * 86400000,
                type: 'lost',
                name: '黑色耐克双肩背包',
                location: '第一食堂二楼',
                desc: '黑色耐克双肩包，包侧有白色logo，里面有高数课本、笔记本和一个黑色充电宝，包内还有本人校园卡。',
                phone: '188****3456',
                time: '2025-05-23 12:30'
            },
            {
                id: Date.now() - 5 * 86400000,
                type: 'lost',
                name: '白色AirPods Pro耳机',
                location: '操场跑道看台',
                desc: '白色AirPods Pro充电盒，盒身有一道细小划痕，耳机左耳有轻微电流声，上周刚买的，十分心疼。',
                phone: '135****7890',
                time: '2025-05-22 18:10'
            },
            {
                id: Date.now() - 6 * 86400000,
                type: 'lost',
                name: '学生校园卡',
                location: '洗浴中心门口',
                desc: '丢失校园卡一张，姓名尾号为鑫，卡号尾号3321，卡套是透明的带小熊挂绳，里面还有热水卡余额，补办很麻烦。',
                phone: '132****4567',
                time: '2025-05-21 20:05'
            },
            {
                id: Date.now() - 7 * 86400000,
                type: 'lost',
                name: '黑色长款钱包',
                location: '超市收银台附近',
                desc: '黑色皮质长款钱包，里面有身份证、银行卡和少量现金，身份证姓名朱家鑫，对本人非常重要，捡到必有重谢。',
                phone: '150****8901',
                time: '2025-05-20 17:40'
            },
            {
                id: Date.now() - 8 * 86400000,
                type: 'lost',
                name: '透明框近视眼镜',
                location: '自习室201座位',
                desc: '透明细框近视眼镜，黑色眼镜盒，盒内有眼镜布和一瓶护理液，度数350度，没有眼镜上课十分不方便。',
                phone: '158****2345',
                time: '2025-05-19 21:20'
            },
            {
                id: Date.now() - 9 * 86400000,
                type: 'lost',
                name: '黑色折叠雨伞',
                location: '一号宿舍楼楼下',
                desc: '黑色全自动折叠伞，伞柄有橡胶握把，伞面内侧有印花，昨天雨天忘在楼下了，最近多雨十分需要。',
                phone: '139****6789',
                time: '2025-05-18 19:30'
            },
            {
                id: Date.now() - 10 * 86400000,
                type: 'lost',
                name: '数据结构专业课本',
                location: '四号教学楼402教室',
                desc: '蓝色封面数据结构课本，书内有大量笔记和划线，扉页写了班级姓名，马上要期末考试了，十分着急。',
                phone: '137****0123',
                time: '2025-05-17 14:50'
            },
            {
                id: Date.now() - 11 * 86400000,
                type: 'lost',
                name: '银色钥匙串',
                location: '乒乓球馆内',
                desc: '银色钥匙一串，大约5把钥匙，挂着一个小黄人挂件，有宿舍钥匙和柜子钥匙，丢了十分麻烦。',
                phone: '155****4567',
                time: '2025-05-16 15:10'
            },

            // 失物招领 11条
            {
                id: Date.now() - 1.5 * 86400000,
                type: 'found',
                name: '白色无线蓝牙耳机',
                location: '第一食堂三楼',
                desc: '在食堂三楼麻辣香锅窗口捡到白色无线耳机一副，充电盒有卡通玉桂狗贴纸，已交至食堂服务台保管。',
                phone: '159****5678',
                time: '2025-05-25 12:15'
            },
            {
                id: Date.now() - 2.5 * 86400000,
                type: 'found',
                name: '校园卡一张',
                location: '操场主席台附近',
                desc: '晨跑时在主席台台阶捡到校园卡一张，卡号尾号8842，已交至体育部值班室，失主可携带证件前去领取。',
                phone: '188****3456',
                time: '2025-05-24 07:30'
            },
            {
                id: Date.now() - 3.5 * 86400000,
                type: 'found',
                name: '粉色充电宝',
                location: '图书馆二楼自习区',
                desc: '在二楼靠窗座位捡到粉色充电宝一个，10000毫安，表面有星黛露图案，现放在图书馆总服务台。',
                phone: '136****9012',
                time: '2025-05-23 16:40'
            },
            {
                id: Date.now() - 4.5 * 86400000,
                type: 'found',
                name: '黑色运动水杯',
                location: '篮球场边休息区',
                desc: '打篮球时在场地边捡到黑色运动水杯，特百惠品牌，杯身有篮球印花，放在篮球场门卫室了。',
                phone: '138****1234',
                time: '2025-05-22 17:20'
            },
            {
                id: Date.now() - 5.5 * 86400000,
                type: 'found',
                name: '棕色卡包',
                location: '菜鸟驿站门口',
                desc: '取快递时在驿站门口捡到棕色卡包，内有银行卡、会员卡若干，没有现金，已放驿站服务台。',
                phone: '135****7890',
                time: '2025-05-21 18:50'
            },
            {
                id: Date.now() - 6.5 * 86400000,
                type: 'found',
                name: '红色钢笔',
                location: '三号教学楼301教室',
                desc: '在301教室第一排座位捡到红色凌美钢笔一支，笔尖较细，看起来比较贵重，放在教室讲台抽屉里了。',
                phone: '132****4567',
                time: '2025-05-20 11:30'
            },
            {
                id: Date.now() - 7.5 * 86400000,
                type: 'found',
                name: '格子围巾',
                location: '二号宿舍楼楼道',
                desc: '在二号楼三楼楼道捡到一条棕灰色格子围巾，羊绒材质，看起来很新，应该是同学收衣服时掉的。',
                phone: '150****8901',
                time: '2025-05-19 20:10'
            },
            {
                id: Date.now() - 8.5 * 86400000,
                type: 'found',
                name: '紫色文件袋',
                location: '教学楼大厅',
                desc: '在一号教学楼大厅捡到紫色透明文件袋，里面有英语四级真题试卷和复习资料，还有写了名字的笔记本。',
                phone: '158****2345',
                time: '2025-05-18 13:25'
            },
            {
                id: Date.now() - 9.5 * 86400000,
                type: 'found',
                name: '儿童电话手表',
                location: '校园小花园长椅',
                desc: '在中心花园长椅上捡到粉色儿童电话手表，应该是教职工家属小朋友丢的，现在在保卫处保管。',
                phone: '139****6789',
                time: '2025-05-17 10:05'
            },
            {
                id: Date.now() - 10.5 * 86400000,
                type: 'found',
                name: '黑色有线鼠标',
                location: '计算机房2号机房',
                desc: '上完课在机房座位捡到黑色罗技有线鼠标，底部有磨损痕迹，放在机房讲台处，失主可前去认领。',
                phone: '137****0123',
                time: '2025-05-16 15:40'
            },
            {
                id: Date.now() - 11.5 * 86400000,
                type: 'found',
                name: '米色帆布包',
                location: '校医院挂号处',
                desc: '在校医院挂号处捡到米色帆布包，包上印着学校校徽，里面有感冒药和病历本，应该是看病时落下的。',
                phone: '155****4567',
                time: '2025-05-15 09:20'
            }
        ];
        saveData(defaultData);
    }
}

// 页面加载完成后初始化
window.onload = function() {
    initData();
    renderList();
}