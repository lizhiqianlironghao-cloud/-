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
    category: '健身场馆 / 门店宣传', image: '/images/work-01-cover.jpg', imageAlt: '拾铁兽新店探馆视频封面，出镜人在门店外介绍新店',
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
