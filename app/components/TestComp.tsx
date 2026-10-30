"use client";
import { setResult } from "@/store/gameSlice";
import { useAppDispatch } from "@/store/hooks";

export function TestComp() {
  const dispatch = useAppDispatch();
  function testWin() {
    dispatch(setResult("win"));
  }

  function testLose() {
    dispatch(setResult("lose"));
  }

  function testDraw() {
    dispatch(setResult("draw"));
  }

  return (
    <div className="absolute">
      <div className="flex flex-col gap-4 m-4">
        <button
          className="bg-blue-300 px-4 py-2 rounded-4xl text-4xl text-white cursor-pointer"
          onClick={testWin}
        >
          WIN
        </button>
        <button
          className="bg-blue-300 px-4 py-2 rounded-4xl text-4xl text-white cursor-pointer"
          onClick={testLose}
        >
          LOSE
        </button>
        <button
          className="bg-blue-300 px-4 py-2 rounded-4xl text-4xl text-white cursor-pointer"
          onClick={testDraw}
        >
          DRAW
        </button>
      </div>
    </div>
  );
}
