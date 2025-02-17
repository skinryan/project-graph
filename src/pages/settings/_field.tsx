import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import FileChooser from "../../components/ui/FileChooser";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Slider from "../../components/ui/Slider";
import Switch from "../../components/ui/Switch";
import { Settings } from "../../core/Settings";
import { cn } from "../../utils/cn";

export function SettingField({
  settingKey,
  type = "text",
  min = 0,
  max = 100,
  step = 1,
  placeholder = "",
  icon = <></>,
  kind = "file",
}: {
  settingKey: keyof Settings.Settings;
  type?: "text" | "number" | "slider" | "switch" | "select" | "file";
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  icon?: React.ReactNode;
  kind?: "file" | "directory";
}) {
  const [value, setValue] = React.useState<any>();
  const { t, i18n } = useTranslation("settings");

  React.useEffect(() => {
    Settings.get(settingKey).then((v) => {
      setValue(v);
    });
  }, []);
  React.useEffect(() => {
    if (value !== undefined) {
      Settings.set(settingKey, value);

      if (settingKey === "language") {
        i18n.changeLanguage(value);
      }
    }
  }, [value]);

  return (
    <Field
      title={t(`${settingKey}.title`)}
      description={t(`${settingKey}.description`, { defaultValue: "" })}
      icon={icon}
    >
      {type === "text" && (
        <Input value={value} onChange={setValue} placeholder={placeholder} />
      )}
      {type === "number" && <Input value={value} onChange={setValue} number />}
      {type === "slider" && (
        <Slider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
        />
      )}
      {type === "switch" && <Switch value={value} onChange={setValue} />}
      {type === "select" && (
        <Select
          value={value}
          onChange={setValue}
          options={Object.entries(
            t(`${settingKey}.options`, {
              returnObjects: true,
              defaultValue: { error: "Error: options not found" },
            }),
          ).map(([k, v]) => ({
            label: v as string,
            value: k,
          }))}
        ></Select>
      )}
      {type === "file" && (
        <FileChooser kind={kind} value={value} onChange={setValue} />
      )}
    </Field>
  );
}
export function ButtonField({
  title,
  description = "",
  label = "",
  disabled = false,
  onClick = () => {},
  icon = <></>,
}: {
  title: string;
  description?: string;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Field title={title} description={description} icon={icon}>
      <Button disabled={disabled} onClick={onClick}>
        {label}
      </Button>
    </Field>
  );
}

const fieldColors = {
  default: "hover:bg-white/10",
  green: "bg-green-500/20 hover:bg-green-500/25",
  red: "bg-red-500/20 hover:bg-red-500/25",
  yellow: "bg-yellow-500/20 hover:bg-yellow-500/25",
  blue: "bg-blue-500/20 hover:bg-blue-500/25",
  purple: "bg-purple-500/20 hover:bg-purple-500/25",
};
export function Field({
  title = "",
  description = "",
  children = <></>,
  color = "default",
  icon = <></>,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  color?: "default" | "green" | "red" | "yellow" | "blue" | "purple";
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl p-4",
        fieldColors[color],
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col">
          <span>{title}</span>
          <span className="text-xs text-gray-500">
            {description.split("\n").map((dd, ii) => (
              <p key={ii} className="text-xs text-gray-500">
                {dd}
              </p>
            ))}
          </span>
        </div>
      </div>
      <div className="flex-1"></div>
      {children}
    </div>
  );
}
