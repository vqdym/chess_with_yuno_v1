import { BackgroundAudio } from "./components/BackgroundAudio";
import { Dialogs } from "./components/Dialogs";
import { LoadingScreen } from "./components/LoadingScreen";
import { Menu } from "./components/Menu";
import { Scene3D } from "./components/Scene3D";
import { SwitchCamera } from "./components/SwitchCamera";
import { FpsCounter } from "./components/FpsCounter";
import { TestComp } from "./components/TestComp";

export default function Home() {
  return (
    <main className="relative w-screen bg-beige-surface h-screen overflow-hidden">
      <LoadingScreen />
      <BackgroundAudio />
      <FpsCounter />
      {/* <div className="absolute inset-0 z-10">
      <TestComp />
      </div> */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Menu />
      </div>
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Dialogs />
      </div>
      <div className="absolute z-10 bottom-4 right-4">
        <SwitchCamera />
      </div>
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>
    </main>
  );
}
