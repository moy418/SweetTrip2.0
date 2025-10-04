import React from 'react'

interface FloatingEmojiProps {
  emoji: string
  position: {
    top: string
    left?: string
    right?: string
    bottom?: string
  }
  animation: {
    duration: number
    delay: number
    direction: 'up' | 'down' | 'left' | 'right' | 'rotate'
  }
  size?: 'sm' | 'md' | 'lg'
}

const FloatingEmoji: React.FC<FloatingEmojiProps> = ({ 
  emoji, 
  position, 
  animation, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  const animationClasses = {
    up: 'animate-float-up',
    down: 'animate-float-down',
    left: 'animate-float-left',
    right: 'animate-float-right',
    rotate: 'animate-float-rotate'
  }

  return (
    <div
      className={`absolute ${sizeClasses[size]} select-none pointer-events-none z-10 ${animationClasses[animation.direction]}`}
      style={{
        top: position.top,
        left: position.left || 'auto',
        right: position.right || 'auto',
        bottom: position.bottom || 'auto',
        animationDuration: `${animation.duration}s`,
        animationDelay: `${animation.delay}s`,
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out'
      }}
    >
      {emoji}
    </div>
  )
}

const FloatingEmojis: React.FC = () => {
  const emojis = [
    // Dulces
    { emoji: '🍭', position: { top: '10%', left: '5%' }, animation: { duration: 3, delay: 0, direction: 'up' as const }, size: 'md' as const },
    { emoji: '🍬', position: { top: '15%', right: '8%' }, animation: { duration: 4, delay: 0.5, direction: 'down' as const }, size: 'sm' as const },
    { emoji: '🍫', position: { top: '25%', left: '3%' }, animation: { duration: 3.5, delay: 1, direction: 'rotate' as const }, size: 'md' as const },
    { emoji: '🍪', position: { top: '20%', right: '12%' }, animation: { duration: 4.5, delay: 1.5, direction: 'left' as const }, size: 'sm' as const },
    { emoji: '🧁', position: { top: '35%', left: '8%' }, animation: { duration: 3.8, delay: 2, direction: 'right' as const }, size: 'lg' as const },
    { emoji: '🍰', position: { top: '30%', right: '5%' }, animation: { duration: 4.2, delay: 2.5, direction: 'up' as const }, size: 'md' as const },
    { emoji: '🍩', position: { top: '45%', left: '2%' }, animation: { duration: 3.2, delay: 3, direction: 'rotate' as const }, size: 'sm' as const },
    { emoji: '🍯', position: { top: '40%', right: '15%' }, animation: { duration: 4.8, delay: 3.5, direction: 'down' as const }, size: 'md' as const },
    
    // Viajes
    { emoji: '✈️', position: { top: '12%', left: '15%' }, animation: { duration: 5, delay: 0.8, direction: 'right' as const }, size: 'sm' as const },
    { emoji: '🌍', position: { top: '18%', right: '20%' }, animation: { duration: 6, delay: 1.2, direction: 'rotate' as const }, size: 'md' as const },
    { emoji: '🗺️', position: { top: '28%', left: '12%' }, animation: { duration: 4.5, delay: 1.8, direction: 'left' as const }, size: 'sm' as const },
    { emoji: '🏛️', position: { top: '22%', right: '25%' }, animation: { duration: 5.5, delay: 2.2, direction: 'up' as const }, size: 'md' as const },
    { emoji: '🗼', position: { top: '38%', left: '18%' }, animation: { duration: 4.8, delay: 2.8, direction: 'down' as const }, size: 'sm' as const },
    { emoji: '🎒', position: { top: '32%', right: '18%' }, animation: { duration: 3.8, delay: 3.2, direction: 'right' as const }, size: 'md' as const },
    { emoji: '🎫', position: { top: '48%', left: '10%' }, animation: { duration: 4.2, delay: 3.8, direction: 'rotate' as const }, size: 'sm' as const },
    { emoji: '🏖️', position: { top: '42%', right: '22%' }, animation: { duration: 5.2, delay: 4.2, direction: 'left' as const }, size: 'md' as const },
    
    // Emojis adicionales para más dinamismo
    { emoji: '⭐', position: { top: '8%', left: '25%' }, animation: { duration: 2.5, delay: 0.3, direction: 'rotate' as const }, size: 'sm' as const },
    { emoji: '💫', position: { top: '16%', right: '30%' }, animation: { duration: 3.2, delay: 0.7, direction: 'up' as const }, size: 'sm' as const },
    { emoji: '🎈', position: { top: '24%', left: '28%' }, animation: { duration: 4.8, delay: 1.1, direction: 'down' as const }, size: 'md' as const },
    { emoji: '🎊', position: { top: '26%', right: '35%' }, animation: { duration: 3.5, delay: 1.6, direction: 'rotate' as const }, size: 'sm' as const },
    { emoji: '🎉', position: { top: '34%', left: '35%' }, animation: { duration: 4.1, delay: 2.1, direction: 'right' as const }, size: 'md' as const },
    { emoji: '🌈', position: { top: '36%', right: '28%' }, animation: { duration: 5.5, delay: 2.7, direction: 'left' as const }, size: 'sm' as const },
    { emoji: '🦄', position: { top: '44%', left: '32%' }, animation: { duration: 4.3, delay: 3.3, direction: 'up' as const }, size: 'md' as const },
    { emoji: '🎪', position: { top: '46%', right: '32%' }, animation: { duration: 3.7, delay: 3.9, direction: 'down' as const }, size: 'sm' as const },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojis.map((emojiData, index) => (
        <FloatingEmoji
          key={index}
          emoji={emojiData.emoji}
          position={emojiData.position}
          animation={emojiData.animation}
          size={emojiData.size}
        />
      ))}
    </div>
  )
}

export default FloatingEmojis
