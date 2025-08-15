import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function BlurText({
  text,
  className,
  animateBy = "words",
  direction = "top",
  delay = 50,
}: BlurTextProps) {
  const getDirection = () => {
    switch (direction) {
      case "top":
        return { y: -20 };
      case "bottom":
        return { y: 20 };
      case "left":
        return { x: -20 };
      case "right":
        return { x: 20 };
      default:
        return { y: -20 };
    }
  };

  const items = animateBy === "words" ? text.split(" ") : text.split("");

  return (
    <motion.div className={cn("", className)}>
      {items.map((item, index) => (
        <motion.span
          key={index}
          initial={{ 
            opacity: 0, 
            filter: "blur(10px)",
            ...getDirection()
          }}
          animate={{ 
            opacity: 1, 
            filter: "blur(0px)",
            y: 0,
            x: 0
          }}
          transition={{
            duration: 0.8,
            delay: index * (delay / 1000),
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {item}
          {animateBy === "words" && index < items.length - 1 && " "}
        </motion.span>
      ))}
    </motion.div>
  );
}