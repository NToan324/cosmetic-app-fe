interface Props {
  delay?: number
  direction: string
  zoom?: number
  duration?: number
}

export const FadeIn = ({ direction, delay, duration }: Props) => {
  return {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        delay: delay || 0,
        duration: duration || 1,
        staggerChildren: 1,
        ease: 'easeInOut',
        type: 'tween'
      }
    }
  }
}

export const FadeZoom = ({ direction, delay, zoom, duration }: Props) => {
  return {
    hidden: {
      opacity: 0,
      scale: zoom || 0.9,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        delay: delay || 0,
        duration: duration || 1,
        staggerChildren: 1,
        type: 'spring'
      }
    }
  }
}
