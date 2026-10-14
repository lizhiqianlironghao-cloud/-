# 艺名 · 个人作品集

React + Vite 的个人作品集基础版，面向抖音千川信息流编导与剪辑师。

## 运行

```bash
npm install
npm run dev
```

默认预览地址：`http://127.0.0.1:5173/`。生产构建：`npm run build`；构建预览：`npm run preview`。

Windows 也可以双击 `start-preview.cmd` 启动。预览依赖本地 Vite 服务；关闭启动窗口或重启电脑后，需要重新启动服务。

## 内容与素材

- `src/content.js`：姓名、邮箱、个人介绍、项目、技能和项目数据。
- `src/App.jsx`：五个页面模块，以及项目详情弹窗。
- `src/components/WorkShowcase.jsx` / `WorkShowcase.css`：首页按钮打开的全屏作品展厅，包含拖拽浏览、3D 悬浮、手机滑动和返回操作。
- `src/components/ProjectContent.jsx`：展厅和作品卡片共用的项目详情与视频播放器。
- `src/styles.css`：配色、字体、1700px 版心、桌面与移动端布局。
- `src/motion/usePortfolioMotion.js`：GSAP 开场、英文大标题揭幕、卡片错峰入场和桌面图片视差。
- `src/motion/motion.css`：幕布、文字遮罩和独立的图片动画层。
- `public/images/`：首页海报、工作场景和项目封面。
- `public/media/hero.mp4`：首页背景视频。
- 项目的 `video` 字段填入视频路径后，详情弹窗会自动显示播放器。

## 当前内容状态

显示名称暂为“艺名”，邮箱使用用户提供的 `3328323973@qq.com`。

首张作品卡片已经接入用户提供的“拾铁兽 · 新店探馆”完整视频。其余标注“视觉样稿”的卡片，以及关于我中的工作场景，仍为网站视觉练习。履历与投放数据尚未提供，不填写虚构的工作年限、客户或 ROI。后续可在 `src/content.js` 中替换成真实信息。

原视频位于 `作品集/10月14日.mp4`；网页播放版本位于 `public/media/work-01.mp4`，采用 720 × 1280 的 H.264 + AAC MP4，约 49 秒。手机支持内嵌播放与原生全屏。

首页“浏览作品”按钮打开全屏作品展厅；点击展厅卡片进入视频或样稿详情，点击“返回作品展厅”返回列表。Escape 会先返回展厅，再关闭展厅。首页背景视频在展厅打开期间暂停，关闭后恢复。页面原有的作品卡片仍可直接打开项目详情。

展厅是独立实现的原创组件，参考了可拖拽画廊和 3D 悬浮的交互形式，未使用 React Bits Pro 的付费源码、素材或依赖。展厅与页面共用 `src/content.js` 中的 `projects`，不需要维护第二份作品列表。

## 当前公开站点

当前使用 Cloudflare Pages：https://grjl-3u2.pages.dev/ 。发布源码仓库为 https://github.com/lizhiqianlironghao-cloud/- ，使用 `main` 分支。推送该分支后，应检查 Cloudflare 构建及公开网页是否更新。

此前的 Sites 身份仍保留在 `.openai/hosting.json`，用于旧站点记录。更新当前 Cloudflare 站点时，使用上述 GitHub 仓库。

背景视频采用摄影工作台的公开素材，仅作为环境背景。来源和许可见 `ASSETS.md`。

导航锚点、项目详情、背景视频暂停、邮箱复制、邮件联系均已实现。系统设置为减少动态效果时，页面会减少滚动与入场动效，并暂停背景视频。

刷新首页或 `#home` 可观看完整开场，进入其他锚点时跳过开场。开场可点击“跳过开场”，或通过滚动、Escape 结束。动效编排见 `docs/motion-direction.md`。
