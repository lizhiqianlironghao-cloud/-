// 在这里替换个人信息、项目和已核验的数据，页面组件会自动同步。
export const profile = {
  name: '艺名',
  role: '抖音千川信息流编导 / 剪辑师',
  email: '3328323973@qq.com',
  wechat: '',
  introduction: '我是艺名，一名专注抖音千川信息流的编导与剪辑师。关注产品、人群与观看行为之间的关系，把有用的信息，放进有节奏的画面。',
  philosophy: '从前几秒的吸引，到每一个卖点的呈现，再到最后的行动引导。让镜头服务表达，让创意回应真实需求。',
  portrait: '/images/portrait-qianchuan.png',
  heroPoster: '/images/camera.png',
  heroVideo: '/media/hero.mp4',
  metrics: [
    { value: '待补充', label: '累计交付素材', note: '作品数量' },
    { value: '待补充', label: '合作项目', note: '项目经验' },
    { value: '待披露', label: '代表素材 ROI', note: '经核验的投放表现' },
  ],
};

export const projects = [
  {
    id: '01', title: '拾铁兽 · 新店探馆', subtitle: '点击观看完整视频，走进新店的训练空间。',
    category: '健身场馆 / 门店宣传', image: '/images/work-01-cover.jpg', imageAlt: '拾铁兽新店探馆视频封面，出镜人在门店外介绍新店', imagePosition: '50% 42%',
    tags: ['门店探馆', '口播剪辑', '竖屏视频'], color: '#bdd6b4', featured: true,
    description: '以出镜口播串联场馆实景，介绍门店环境与训练分区。完整保留原作品的画面、字幕与声音。',
    approach: ['出镜口播，进入新店主题', '实景镜头，展示训练空间', '字幕与声音，推进内容表达'],
    video: '/media/work-01.mp4', durationLabel: '00:49', isDemo: false,
  },
  {
    id: '02', title: '节奏，先于速度', subtitle: '用声画的张力，建立运动感。',
    category: '运动消费', image: '/images/sneaker.png', imageAlt: '深色场景中的运动鞋产品摄影视觉样稿',
    tags: ['商业剪辑', '声画节奏'], color: '#eaa28c',
    description: '让产品细节与运动情绪形成呼应。通过镜头长度、动作方向和声音落点，让信息有层次地进入画面。',
    approach: ['细节特写，建立产品质感', '声音落点与剪辑点相互呼应', '针对不同开头准备素材版本'],
    video: '', isDemo: true,
  },
  {
    id: '03', title: '小画面，大叙事', subtitle: '把品牌的表达，放进每一帧。',
    category: '品牌内容', image: '/images/camera.png', imageAlt: '黑色电影摄影机的低照度视觉样稿',
    tags: ['镜头语言', '视觉表达'], color: '#c2d7ce', wide: true,
    description: '从创意意图出发，选择合适的构图、光线与镜头运动。让画面不只是装饰，而是品牌表达的一部分。',
    approach: ['明确核心信息与视觉基调', '让构图、光线与镜头服务同一表达', '用精简的结构完成叙事'],
    video: '', isDemo: true,
  },
  {
    id: '04', title: '椰香，刚好入镜', subtitle: '从一杯椰汁，展开产品的感官叙事。',
    category: '食品饮料', image: '/images/study-coconut.webp', imageAlt: '深绿石台上的椰汁与鲜椰产品摄影视觉样稿',
    tags: ['产品叙事', '感官镜头'], color: '#bdd6b4',
    description: '以椰汁的色泽、杯壁的水珠与鲜椰的质地，练习食品饮料类内容的镜头组织。此项为视觉样稿，后续可替换为正式作品。',
    approach: ['产品特写，建立第一眼感受', '食材与饮用场景，串联画面', '用光线和构图强化质地'],
    video: '', isDemo: true,
  },
  {
    id: '05', title: '让质感，自己说话', subtitle: '把光线落在材质最值得被看见的地方。',
    category: '美妆个护', image: '/images/study-skincare.webp', imageAlt: '暖色石材旁的琥珀色精华瓶产品摄影视觉样稿',
    tags: ['美妆视觉', '细节特写'], color: '#d8bb93',
    description: '以无品牌包装、通透液体与石材光影，练习美妆产品的细节表达。此项为视觉样稿，不涉及产品功效或真实品牌合作。',
    approach: ['以微距视角观察材质', '用柔和侧光塑造层次', '让包装与环境色彩呼应'],
    video: '', isDemo: true,
  },
  {
    id: '06', title: '听见，细节的分量', subtitle: '用克制的画面，呈现精密的产品语言。',
    category: '消费数码', image: '/images/study-headphones.webp', imageAlt: '深色石面上的金属头戴式耳机产品摄影视觉样稿',
    tags: ['数码产品', '声画设计'], color: '#b8c7cb',
    description: '以金属、织物与结构细节，练习消费数码产品的视觉叙事。此项为无品牌概念样稿，可用于后续正式视频的版式替换。',
    approach: ['结构特写，建立产品识别', '金属与织物，形成材质对比', '声音落点服务镜头节奏'],
    video: '', isDemo: true,
  },
  {
    id: '07', title: '一杯咖啡的停顿', subtitle: '让日常的动作，也有值得停留的温度。',
    category: '餐饮探店', image: '/images/study-coffee.webp', imageAlt: '咖啡师在木质吧台放下一杯咖啡的门店氛围视觉样稿',
    tags: ['门店氛围', '生活叙事'], color: '#c7a27b',
    description: '以出杯动作、吧台细节与自然光，练习餐饮门店的氛围表达。此项为场景视觉样稿，不对应真实门店合作。',
    approach: ['从具体动作进入场景', '用环境细节补充观看体验', '在自然声与画面间寻找节奏'],
    video: '', isDemo: true,
  },
  {
    id: '08', title: '把生活，放进光里', subtitle: '用空间与光影，讲述舒适的日常。',
    category: '家居生活', image: '/images/study-interior.webp', imageAlt: '午后阳光照进木质躺椅与石材边桌的家居空间视觉样稿',
    tags: ['空间表达', '生活方式'], color: '#c9c0a8',
    description: '以可实现的家居空间、材质关系与午后光线，练习生活方式内容的画面组织。此项为视觉样稿，不代表真实客户项目。',
    approach: ['空间全景，交代生活关系', '细节切换，传递材质与尺度', '以自然光统一画面情绪'],
    video: '', isDemo: true,
  },
  {
    id: '09', title: '线条，驶入视线', subtitle: '把工业细节，转化为画面的力量。',
    category: '汽车出行', image: '/images/study-automotive.webp', imageAlt: '傍晚建筑旁石墨灰跑车前轮与车身线条的汽车视觉样稿',
    tags: ['工业质感', '镜头节奏'], color: '#a8b7c0',
    description: '以无品牌车型的车身曲面、轮毂结构与环境反光，练习汽车类内容的视觉语言。此项为概念视觉样稿，不对应真实品牌合作。',
    approach: ['车身线条，建立视觉动势', '细节近景，呈现金属结构', '环境反射，统一画面层次'],
    video: '', isDemo: true,
  },
];

export const capabilities = [
  { id: '01', icon: 'target', title: '先理解，再表达', description: '拆解产品卖点与人群需求，寻找值得被看见的内容切口。', tags: ['人群洞察', '卖点拆解', '开头钩子'] },
  { id: '02', icon: 'frame', title: '把脚本变成镜头', description: '从信息结构到分镜，让拍摄有依据，让每个画面都承担一个任务。', tags: ['创意脚本', '分镜设计', '拍摄统筹'] },
  { id: '03', icon: 'scissors', title: '剪出观看的动力', description: '组织画面、字幕与声音，让内容清楚，有节奏，也有情绪。', tags: ['商业剪辑', '声画设计', '字幕包装'] },
  { id: '04', icon: 'chart', title: '交付之后，继续迭代', description: '结合素材反馈调整开头、表达与节奏，为下一轮创意提供依据。', tags: ['素材复盘', '版本迭代', '内容测试'] },
];

export const navigation = [
  { id: 'about', label: '关于我' },
  { id: 'work', label: '精选作品' },
  { id: 'expertise', label: '我的优势' },
];
