import { cn } from "@/lib/utils"
import { Marquee } from "./ui/marquee"
import { motion } from 'motion/react';
import { getStorageUrl } from "@/lib/supabase";
const reviews = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 
];

const firstRow = reviews
const ReviewCard = ({
  index
}: {
  index: number}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="132" height="232" alt="" src={getStorageUrl('site-assets', `parceiros/parceiro_${index}.png`)} />
      </div>
    </figure>
  )
}

export function MarqueeImpl() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
    <motion.div
            initial={{ opacity: 0.8, x: 0 }}
            animate={{ opacity: 0.8, x: 1000 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
            className="mb-8">
         <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={review.username} index={index} />
        ))}
      </Marquee>
        </motion.div>

    
    
     
    </div>
  )
}
