import { cn } from "@/lib/utils"
import { Marquee } from "./ui/marquee"
import { motion } from 'motion/react';
import { url } from "inspector";

const urlStorage = import.meta.env.VITE_MINIO_ENDPOINT
const path = 'objects/download?prefix=parciros/'
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

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
        <img className="rounded-full" width="132" height="232" alt="" src={`${urlStorage}${path}parceiro_${index}.png`} />
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
        )).reverse()}
      </Marquee>
        </motion.div>

    
    
     
    </div>
  )
}
