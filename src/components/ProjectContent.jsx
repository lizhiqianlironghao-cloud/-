import { ArrowUpRight, X } from '@phosphor-icons/react';
import { profile } from '../content.js';

export default function ProjectContent({ project, onClose, titleId = 'dialog-title' }) {
  return <div className="dialog-panel">
    {onClose && <button className="dialog-close icon-button" onClick={onClose} aria-label="关闭项目详情"><X size={25} /></button>}
    <div className={`dialog-visual ${project.video ? 'is-video' : ''}`}>
      {project.video
        ? <video src={project.video} controls autoPlay playsInline preload="metadata" poster={project.image} aria-label={`${project.title}，完整作品视频`} />
        : <img src={project.image} alt={project.imageAlt} />}
    </div>
    <div className="dialog-content">
      <p className="dialog-category mono">{project.category} / {project.isDemo ? 'VISUAL STUDY' : 'PROJECT'}</p>
      <h2 id={titleId}>{project.title}</h2>
      <p>{project.description}</p>
      <ul>{project.approach.map(step => <li key={step}><span /><p>{step}</p></li>)}</ul>
      {project.isDemo && <div className="dialog-demo-note">此处为网站视觉样稿，不代表客户案例或投放成绩。正式项目视频与数据待补充。</div>}
      <a className="text-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(`项目沟通：${project.title}`)}`}>交流类似项目 <ArrowUpRight size={18} /></a>
    </div>
  </div>;
}
