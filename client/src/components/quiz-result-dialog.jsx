import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Sparkles, Star, Trophy, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";

export function QuizResultDialog({
  isOpen,
  onClose,
  isPassed,
  score,
  activityType,
  totalQuestions = 10,
}) {
  const [isConfettiShown, setIsConfettiShown] = useState(false);

  // Trigger confetti when dialog opens and quiz is passed
  if (isOpen && isPassed && !isConfettiShown) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsConfettiShown(true);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setIsConfettiShown(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-md border-4 rounded-xl p-0 overflow-hidden">
        {isPassed ? (
          <div className="bg-gradient-to-b from-green-100 to-green-50 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="relative">
                  <Trophy className="h-24 w-24 text-yellow-500" />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                Awesome Job!
              </h2>
              <p className="text-lg text-green-700 mb-4">
                You got {score} out of {totalQuestions} correct!
              </p>
              <p className="text-md text-green-600 mb-6">
                You're super smart! Keep up the great work!
              </p>

              <div className="flex justify-center gap-4">
                <Link to={`/${activityType === 'activity' ? 'activities' : 'todo'}`}>
                  <Button
                    onClick={onClose}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-lg capitalize"
                  >
                    Other {activityType}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-6 text-center">
            <div className="mb-4 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        delay: i * 0.2,
                      }}
                    >
                      <Star className="h-16 w-16 text-blue-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-blue-800 mb-2">
                Nice Try!
              </h2>
              <p className="text-lg text-blue-700 mb-4">
                You got {score} out of {totalQuestions}
              </p>
              <p className="text-md text-blue-600 mb-6">
                You're doing great! Let's try again and see if we can do even
                better!
              </p>

              <div className="flex justify-center gap-4">
                <Link to={`/${activityType === 'activity' ? 'activities' : 'todo'}`}>
                  <Button
                    onClick={onClose}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-lg capitalize"
                  >
                    Other {activityType}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
