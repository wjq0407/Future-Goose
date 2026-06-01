import { memo, useEffect, useState } from 'react';

type GooseMood = 'default' | 'thinking' | 'happy' | 'encouraging';
type GooseSize = 'xs' | 'sm' | 'md' | 'lg';

interface GooseMascotProps {
  mood?: GooseMood;
  size?: GooseSize;
  className?: string;
  animated?: boolean;
}

const sizeMap: Record<GooseSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
};

const frameCount = 6;

const moodSpriteMap: Record<GooseMood, string> = {
  default: '/assets/goose/default-sprite.png',
  thinking: '/assets/goose/thinking-sprite.png',
  happy: '/assets/goose/happy-sprite.png',
  encouraging: '/assets/goose/encouraging-sprite.png',
};

const GooseMascot = memo(({ mood = 'default', size = 'md', className = '', animated = true }: GooseMascotProps) => {
  const pixelSize = sizeMap[size];
  const [currentFrame, setCurrentFrame] = useState(0);
  const spriteUrl = moodSpriteMap[mood];

  useEffect(() => {
    if (!animated) {
      setCurrentFrame(0);
      return;
    }

    const fps = 12;
    const interval = 1000 / fps;
    let animationId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        setCurrentFrame((prev) => (prev + 1) % frameCount);
        lastTime = time;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [animated, mood]);

  const backgroundPosition = `-${currentFrame * pixelSize}px 0`;

  return (
    <div
      className={`${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        backgroundImage: `url(${spriteUrl})`,
        backgroundPosition,
        backgroundSize: `${frameCount * pixelSize}px ${pixelSize}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto',
      }}
      aria-hidden="true"
      role="img"
      aria-label={`企鹅IP - ${mood}状态`}
    />
  );
});

GooseMascot.displayName = 'GooseMascot';

export default GooseMascot;
