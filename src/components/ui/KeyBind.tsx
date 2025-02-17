import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyBinds } from "../../core/KeyBinds";
import { cn } from "../../utils/cn";
import Button from "./Button";

export default function KeyBind({
  value,
  onChange,
}: {
  value: { key: string; modifiers: KeyBinds.KeyModifiers };
  onChange: (value: { key: string; modifiers: KeyBinds.KeyModifiers }) => void;
}) {
  const [choosing, setChoosing] = useState(false);
  const { t } = useTranslation("keys");

  const startInput = () => {
    const end = () => {
      setChoosing(false);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("wheel", handleWheel);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (
        event.key === "Control" ||
        event.key === "Alt" ||
        event.key === "Shift"
      ) {
        return;
      }
      if (event.key === "Escape") {
        end();
        return;
      }
      const modifiers = {
        control: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
      };
      onChange({ key: event.key, modifiers });
      end();
    };
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const modifiers = {
        control: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
      };
      if (event.button !== 0) {
        onChange({
          key: `mouse${event.button}`,
          modifiers,
        });
        end();
      }
    };
    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const modifiers = {
        control: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
      };
      if (event.deltaY < 0) {
        onChange({ key: "wheelup", modifiers });
      } else {
        onChange({ key: "wheeldown", modifiers });
      }
      end();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("wheel", handleWheel);

    setChoosing(true);
    onChange({
      key: "",
      modifiers: { control: false, alt: false, shift: false },
    });
  };

  return (
    <Button
      onClick={startInput}
      className={cn("outline-none outline-0", {
        "bg-blue-950 outline outline-4 outline-blue-500": choosing,
      })}
    >
      {value.modifiers.control && "Ctrl + "}
      {value.modifiers.alt && "Alt + "}
      {value.modifiers.shift && "Shift + "}
      {t(value.key, { defaultValue: value.key.toUpperCase() })}
      {value.key.length === 0 && choosing && "..."}
      {value.key.length === 0 && !choosing && t("none")}
    </Button>
  );
}
