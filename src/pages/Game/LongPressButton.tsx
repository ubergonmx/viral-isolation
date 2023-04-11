import { useCallback, useState } from "react";
import { LongPressDetectEvents, LongPressOptions, useLongPress } from "use-long-press";

type LongPressButtonProps = {
  text: string;
  callback: () => void;
  disabled?: boolean; // make the disabled prop optional
  className?: string; // make the className prop optional
};

function LongPressButton({ text, callback, disabled, className }: LongPressButtonProps) {
  const [showRipple, setShowRipple] = useState(false);
  const invokeCallback = useCallback(() => {
    callback();
    setShowRipple(false);
  }, []);
  const LongPressOptions: LongPressOptions = {
    onStart: (e) => setShowRipple(true),
    onFinish: (e) => setShowRipple(false),
    onCancel: (e) => setShowRipple(false),
    threshold: 700,
    captureEvent: true,
    cancelOnMovement: false,
    detect: LongPressDetectEvents.BOTH,
  };
  const longPressBind = useLongPress(invokeCallback, LongPressOptions);

  return (
    <button
      {...longPressBind()}
      disabled={disabled}
      className={className + " relative top-0 flex place-content-center items-center justify-center overflow-hidden"}
    >
      {text}
      {showRipple && <span className="ripple absolute h-full w-full rounded-full  bg-slate-400/75">&nbsp;</span>}
    </button>
  );
}

export default LongPressButton;