import { Brain, Rocket } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">

      {/* PERSPECTIVE */}
      <div className="w-14 h-14 perspective">

        {/* CARD */}
        <div className="relative w-full h-full preserve-3d animate-cardSpin">

          {/* FRONT — Brain */}
          <div className="
            absolute inset-0
            bg-emerald-700 rounded-xl
            flex items-center justify-center
            backface-hidden
          ">
            <Brain className="w-7 h-7 text-green-500" />
          </div>

          {/* BACK — Rocket */}
          <div className="
            absolute inset-0
            bg-emerald-700 rounded-xl
            flex items-center justify-center
            backface-hidden
          "
            style={{ transform: "rotateY(180deg)" }}
          >
            <Rocket className="w-6 h-6 text-green-500 rotate-40 animate-rocketGlow" />
          </div>

        </div>
      </div>


    </div>
  );
}
