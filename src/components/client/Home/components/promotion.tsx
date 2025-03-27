interface PromotionProps {
  image: string
}
const Promotion = ({ image }: PromotionProps) => {
  return (
    <div className=''>
      <img src={image} alt='' />
    </div>
  )
}

export default Promotion
