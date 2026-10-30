import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Difficulty } from "../types/Difficulty";
import { changeDifficulty } from "@/store/gameSlice";

const difficulties = {
  difficulties_uk: [
    "Легко",
    "Нормально",
    "Хитро",
    "Складнувато",
    "Складно",
    "Дуже складно",
    "Експерт",
    "Майстер",
    "Кошмар",
    "Неможливо",
  ],
  difficulties_en: [
    "Easy",
    "Normal",
    "Tricky",
    "Challenging",
    "Hard",
    "Very hard",
    "Expert",
    "Master",
    "Nightmare",
    "Impossible",
  ],
};

export function DifficultySlider({
  language,
  font,
}: {
  language: "uk" | "en";
  font: string;
}) {
  const difficulty = useAppSelector((state) => state.gameState.difficulty);
  const dispatch = useAppDispatch();
  const LEVELS = [0, 2, 4, 6, 8, 10, 12, 14, 17, 20];
  const [index, setIndex] = useState(Math.max(0, LEVELS.indexOf(difficulty)));
  const [direction, setDirection] = useState<-1 | 1>(1);
  const difficultyLang = difficulties[`difficulties_${language}`];
  const variants = {
    enter: (direction: -1 | 1) => ({
      x: direction * 100,
      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,
    },

    exit: (direction: -1 | 1) => ({
      x: -direction * 100,
      opacity: 0,
    }),
  };

  function handleChangeDifficulty(step: -1 | 1) {
    const nextIndex =
      (index + step + difficultyLang.length) % difficultyLang.length;
    setDirection(step);
    setIndex(nextIndex);
    dispatch(
      changeDifficulty({
        difficulty: difficulties.difficulties_en[nextIndex] as Difficulty,
      }),
    );
  }

  return (
    <div className={`flex items-center gap-8"`}>
      <Button
        onClick={() => handleChangeDifficulty(-1)}
        style={`cursor-pointer transition duration-300 ease-in-out hover:translate-y-[-4px] font-bold ${font} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] text-[48px] text-settings-button`}
      >
        {"<"}
      </Button>
      <div className="relative w-82 h-16 overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={index}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className={`font-bold ${font} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] text-[36px] text-settings-button  whitespace-nowrap`}
            >
              {difficultyLang[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        onClick={() => handleChangeDifficulty(1)}
        style={`transition duration-300 ease-in-out hover:translate-y-[-4px] cursor-pointer font-bold ${font} [text-shadow:0_4px_8px_rgba(42,14,16,0.8)] text-[48px] text-settings-button`}
      >
        {">"}
      </Button>
    </div>
  );
}
