# 素材来源

## 边缘发光组件

`src/components/BorderGlow.jsx` 和配套 CSS 来自用户提供的 React Bits BorderGlow 组件代码。为本项目补充了动画清理、鼠标离开复位、键盘焦点提示，并接入精选项目与个人优势卡片。

## 首页背景视频

- 标题：Photographer´s Workplace
- 作者：Leeloo The First
- 来源：https://www.pexels.com/video/photographer-s-workplace-7610985/
- 许可：https://www.pexels.com/license/
- 用途：首版环境背景示例，不代表本人拍摄或客户作品。
- 本地文件：`public/media/hero.mp4`

## 网站图像

首页摄影机海报、匿名千川数据复盘工作场景、椰子产品封面和运动鞋封面由 ImageGen 为本次页面设计生成，仅作为视觉样稿。后续用真实作品与本人照片替换。

关于我模块使用 `public/images/portrait-qianchuan.png`，在原剪辑工作场景上编辑显示器内容。屏幕上的千川看板为演示数据，生成方式与完整提示词见 `docs/portrait-qianchuan-prompt.md`。

## 作品视频

`public/media/work-01.mp4` 来自用户提供的 `作品集/10月14日.mp4`，内容为拾铁兽新店探馆。网页版本为 720 × 1280、H.264 + AAC、约 49 秒，保留画面、字幕、声音和完整时长，原片保持在用户提供的目录中。

`public/images/work-01-cover.jpg` 为该视频约第 3 秒的画面截帧。视频由用户明确授权用于公开作品集展示；未填写未提供的投放数据。

## 新增展厅视觉样稿

饮品、美妆、数码、咖啡、家居和汽车的六张新封面由内置 `image_gen` 生成，采用无品牌的产品或场景摄影方向，全部标注为视觉样稿，不代表真实客户合作或新增视频。

- `public/images/study-coconut.webp`：椰汁与鲜椰。
- `public/images/study-skincare.webp`：琥珀色精华瓶。
- `public/images/study-headphones.webp`：金属头戴式耳机。
- `public/images/study-coffee.webp`：咖啡出杯场景。
- `public/images/study-interior.webp`：家居空间。
- `public/images/study-automotive.webp`：无品牌汽车细节。

网页图片为 1200 × 800 WebP，完整生成提示词见 `docs/showcase-study-prompts.json`。原始生成 PNG 保留在 Codex 的生成图片目录中，网页仅发布压缩后的封面。

## 字体许可

Space Grotesk，SIL Open Font License，采用本地 WOFF2 文件。
- 项目：https://github.com/floriankarsten/space-grotesk
- 字体许可：`public/fonts/OFL.txt`
