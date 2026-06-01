import { memo } from 'react';

interface GooseHeadProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

const GooseHead = memo(({ size = 24, className = '', animated = true }: GooseHeadProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'group-hover:animate-bounce-soft' : ''}`}
      aria-hidden="true"
    >
      {/* 企鹅头部轮廓 */}
      <ellipse cx="24" cy="26" rx="16" ry="18" fill="currentColor" opacity="0.9" />
      
      {/* 白色脸部区域 */}
      <ellipse cx="24" cy="28" rx="12" ry="13" fill="white" />
      
      {/* 左眼 */}
      <circle cx="19" cy="24" r="2.5" fill="#1A1D27" />
      <circle cx="19.5" cy="23.5" r="0.8" fill="white" />
      
      {/* 右眼 */}
      <circle cx="29" cy="24" r="2.5" fill="#1A1D27" />
      <circle cx="29.5" cy="23.5" r="0.8" fill="white" />
      
      {/* 喙 - 使用腾讯橙 */}
      <path
        d="M24 28 C22 28, 20 30, 20 31 C20 32, 22 33, 24 33 C26 33, 28 32, 28 31 C28 30, 26 28, 24 28Z"
        fill="#FF9F43"
      />
      
      {/* 头顶小绒毛 */}
      <path
        d="M22 8 C23 6, 25 6, 26 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});

GooseHead.displayName = 'GooseHead';

export default GooseHead;
