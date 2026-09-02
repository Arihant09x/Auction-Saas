"use client";

import React from "react";
import {
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
} from "@blocknote/core";

import { DEFAULTS } from "./schema-config.js";
import { StatItem } from "./types.js";
import { isValidUrl } from "./validate.js";
// Add this declaration to satisfy TypeScript's JSX expectations


// ---------------------------------------------------------
// TYPES & CONSTANTS
// ---------------------------------------------------------

type Alignment = "start" | "center" | "end";
type ShadowSize = "none" | "small" | "medium" | "large";
type ButtonSize = "small" | "medium" | "large";

// ---------------------------------------------------------
// GENERAL HELPERS
// ---------------------------------------------------------

function parseStats(value: string): StatItem[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StatItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StatItem).number === "string" &&
        typeof (item as StatItem).label === "string"
    );
  } catch {
    return [];
  }
}

function serializeStats(stats: StatItem[]): string {
  return JSON.stringify(
    stats.map((item) => ({
      number: item.number,
      label: item.label,
    }))
  );
}

function shadowValue(shadow: ShadowSize) {
  const values: Record<ShadowSize, string> = {
    none: "none",
    small: "0 2px 6px rgba(0, 0, 0, 0.10)",
    medium: "0 8px 20px rgba(0, 0, 0, 0.14)",
    large: "0 16px 35px rgba(0, 0, 0, 0.20)",
  };
  return values[shadow] ?? values.none;
}

function buttonPadding(size: ButtonSize) {
  const values: Record<ButtonSize, string> = {
    small: "8px 14px",
    medium: "12px 22px",
    large: "16px 30px",
  };
  return values[size] ?? values.medium;
}

function buttonFontSize(size: ButtonSize) {
  const values: Record<ButtonSize, string> = {
    small: "13px",
    medium: "15px",
    large: "18px",
  };
  return values[size] ?? values.medium;
}

function alignmentValue(alignment: Alignment) {
  if (alignment === "start") return "flex-start";
  if (alignment === "end") return "flex-end";
  return "center";
}

function updateBlockProps(
  editor: any,
  block: any,
  props: Record<string, unknown>
) {
  editor.updateBlock(block, {
    props,
  });
}

// ---------------------------------------------------------
// RENDER COMPONENTS
// ---------------------------------------------------------

// Read-only clean stat card
function ReadOnlyStatCard({
  number,
  label,
  backgroundColor,
  numberColor,
  labelColor,
  borderColor,
  borderWidth,
  radius,
  shadow,
  width,
  height,
  fillWidth = false,
}: {
  number: string;
  label: string;
  backgroundColor: string;
  numberColor: string;
  labelColor: string;
  borderColor: string;
  borderWidth: number;
  radius: number;
  shadow: ShadowSize;
  width: number;
  height: number;
  fillWidth?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 sm:p-6 transition-transform duration-300 hover:-translate-y-1"
      style={{
        // Responsive: never wider than its container on small screens
        width: fillWidth ? "100%" : `min(${width}px, 100%)`,
        minHeight: `${height}px`,
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: `${radius}px`,
        boxShadow: shadowValue(shadow),
      }}
    >
      <span
        className="text-center text-3xl sm:text-4xl font-extrabold"
        style={{ color: numberColor }}
      >
        {number}
      </span>
      <span
        className="mt-2 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider"
        style={{ color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
}

// Editable stat card (bleed fixed)
function EditableStatCard({
  number,
  label,
  backgroundColor,
  numberColor,
  labelColor,
  borderColor,
  borderWidth,
  radius,
  shadow,
  width,
  height,
  fillWidth = false,
  editor,
  block,
  itemIndex,
  groupMode = false,
}: {
  number: string;
  label: string;
  backgroundColor: string;
  numberColor: string;
  labelColor: string;
  borderColor: string;
  borderWidth: number;
  radius: number;
  shadow: ShadowSize;
  width: number;
  height: number;
  fillWidth?: boolean;
  editor: any;
  block: any;
  itemIndex?: number;
  groupMode?: boolean;
}) {
  const updateItem = (key: "number" | "label", value: string) => {
    if (groupMode && typeof itemIndex === "number") {
      const stats = parseStats(block.props.stats);
      if (stats[itemIndex]) {
        stats[itemIndex] = {
          ...stats[itemIndex],
          [key]: value,
        };
        updateBlockProps(editor, block, {
          ...block.props,
          stats: serializeStats(stats),
        });
      }
      return;
    }

    updateBlockProps(editor, block, {
      ...block.props,
      [key]: value,
    });
  };

  return (
    <div
      contentEditable={false}
      style={{
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: `${radius}px`,
        boxShadow: shadowValue(shadow),
        // Responsive: never wider than its container on small screens
        width: fillWidth ? "100%" : `min(${width}px, 100%)`,
        minHeight: `${height}px`,
      }}
      className="flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-200"
    >
      <input
        value={number}
        onChange={(event) => updateItem("number", event.target.value)}
        placeholder="Number..."
        className="w-full bg-transparent text-center text-4xl font-extrabold outline-none border-b border-transparent hover:border-slate-300 focus:border-slate-400"
        style={{ color: numberColor }}
      />
      <input
        value={label}
        onChange={(event) => updateItem("label", event.target.value)}
        placeholder="Label..."
        className="mt-2 w-full bg-transparent text-center text-sm font-semibold uppercase tracking-wider outline-none border-b border-transparent hover:border-slate-300 focus:border-slate-400"
        style={{ color: labelColor }}
      />
    </div>
  );
}

// Settings Panel (bleed fixed)
function StatSettings({
  block,
  editor,
  groupMode = false,
}: {
  block: any;
  editor: any;
  groupMode?: boolean;
}) {
  const props = block.props;
  const update = (key: string, value: unknown) => {
    updateBlockProps(editor, block, {
      ...block.props,
      [key]: value,
    });
  };

  return (
    <div contentEditable={false} className="w-full">
      <details className="mt-4 w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-3">
        <summary className="cursor-pointer select-none text-sm font-semibold text-gray-700">
          Design settings
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-semibold text-gray-600">
            Background
            <input
              type="color"
              value={props.backgroundColor}
              onChange={(event) => update("backgroundColor", event.target.value)}
              className="mt-1 block h-10 w-full cursor-pointer rounded border"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Number color
            <input
              type="color"
              value={props.numberColor}
              onChange={(event) => update("numberColor", event.target.value)}
              className="mt-1 block h-10 w-full cursor-pointer rounded border"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Label color
            <input
              type="color"
              value={props.labelColor}
              onChange={(event) => update("labelColor", event.target.value)}
              className="mt-1 block h-10 w-full cursor-pointer rounded border"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Border color
            <input
              type="color"
              value={props.borderColor}
              onChange={(event) => update("borderColor", event.target.value)}
              className="mt-1 block h-10 w-full cursor-pointer rounded border"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Width: {props.width}px
            <input
              type="range"
              min="160"
              max="900"
              value={props.width}
              onChange={(event) => update("width", Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Height: {props.height}px
            <input
              type="range"
              min="100"
              max="500"
              value={props.height}
              onChange={(event) => update("height", Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Border width: {props.borderWidth}px
            <input
              type="range"
              min="0"
              max="8"
              value={props.borderWidth}
              onChange={(event) => update("borderWidth", Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Radius: {props.radius}px
            <input
              type="range"
              min="0"
              max="50"
              value={props.radius}
              onChange={(event) => update("radius", Number(event.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Shadow
            <select
              value={props.shadow}
              onChange={(event) => update("shadow", event.target.value)}
              className="mt-1 w-full rounded border px-2 py-2 text-sm bg-white"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
          {!groupMode && (
            <label className="text-xs font-semibold text-gray-600">
              Alignment
              <select
                value={props.alignment}
                onChange={(event) => update("alignment", event.target.value)}
                className="mt-1 w-full rounded border px-2 py-2 text-sm bg-white"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
              </select>
            </label>
          )}
        </div>
      </details>
    </div>
  );
}

// ---------------------------------------------------------
// CUSTOM BLOCKS IMPLEMENTATION
// ---------------------------------------------------------

const StatBlock = () =>
  createReactBlockSpec(
    {
      type: "stat",
      propSchema: {
        schemaVersion: { default: 1, type: "number" },
        number: { default: DEFAULTS.stat.number, type: "string" },
        label: { default: DEFAULTS.stat.label, type: "string" },
        backgroundColor: { default: DEFAULTS.stat.backgroundColor, type: "string" },
        numberColor: { default: DEFAULTS.stat.numberColor, type: "string" },
        labelColor: { default: DEFAULTS.stat.labelColor, type: "string" },
        borderColor: { default: DEFAULTS.stat.borderColor, type: "string" },
        borderWidth: { default: DEFAULTS.stat.borderWidth, type: "number" },
        radius: { default: DEFAULTS.stat.radius, type: "number" },
        shadow: { default: DEFAULTS.stat.shadow, type: "string" },
        width: { default: DEFAULTS.stat.width, type: "number" },
        height: { default: DEFAULTS.stat.height, type: "number" },
        alignment: { default: DEFAULTS.stat.alignment, type: "string" },
      },
      content: "none",
    },
    {
      render: (props) => {
        const blockProps = props.block.props;
        const isEditable = props.editor.isEditable;

        return (
          <div
            className="my-4 flex w-full flex-col items-center gap-2"
            style={{ alignItems: alignmentValue(blockProps.alignment as Alignment) }}
          >
            {isEditable ? (
              <EditableStatCard
                number={blockProps.number}
                label={blockProps.label}
                backgroundColor={blockProps.backgroundColor}
                numberColor={blockProps.numberColor}
                labelColor={blockProps.labelColor}
                borderColor={blockProps.borderColor}
                borderWidth={blockProps.borderWidth}
                radius={blockProps.radius}
                shadow={blockProps.shadow as ShadowSize}
                width={blockProps.width}
                height={blockProps.height}
                editor={props.editor}
                block={props.block}
              />
            ) : (
              <ReadOnlyStatCard
                number={blockProps.number}
                label={blockProps.label}
                backgroundColor={blockProps.backgroundColor}
                numberColor={blockProps.numberColor}
                labelColor={blockProps.labelColor}
                borderColor={blockProps.borderColor}
                borderWidth={blockProps.borderWidth}
                radius={blockProps.radius}
                shadow={blockProps.shadow as ShadowSize}
                width={blockProps.width}
                height={blockProps.height}
              />
            )}
            {isEditable && <StatSettings editor={props.editor} block={props.block} />}
          </div>
        );
      },
    }
  );

const StatsGroupBlock = () =>
  createReactBlockSpec(
    {
      type: "statsGroup",
      propSchema: {
        schemaVersion: { default: 1, type: "number" },
        stats: { default: DEFAULTS.statsGroup.stats, type: "string" },
        direction: { default: DEFAULTS.statsGroup.direction, type: "string" },
        alignment: { default: DEFAULTS.statsGroup.alignment, type: "string" },
        gap: { default: DEFAULTS.statsGroup.gap, type: "number" },
        backgroundColor: { default: DEFAULTS.statsGroup.backgroundColor, type: "string" },
        numberColor: { default: DEFAULTS.statsGroup.numberColor, type: "string" },
        labelColor: { default: DEFAULTS.statsGroup.labelColor, type: "string" },
        borderColor: { default: DEFAULTS.statsGroup.borderColor, type: "string" },
        borderWidth: { default: DEFAULTS.statsGroup.borderWidth, type: "number" },
        radius: { default: DEFAULTS.statsGroup.radius, type: "number" },
        shadow: { default: DEFAULTS.statsGroup.shadow, type: "string" },
        width: { default: DEFAULTS.statsGroup.width, type: "number" },
        height: { default: DEFAULTS.statsGroup.height, type: "number" },
      },
      content: "none",
    },
    {
      render: (props) => {
        const blockProps = props.block.props;
        const stats = parseStats(blockProps.stats);
        const isEditable = props.editor.isEditable;

        const updateStats = (newStats: StatItem[]) => {
          updateBlockProps(props.editor, props.block, {
            ...props.block.props,
            stats: serializeStats(newStats),
          });
        };

        return (
          <div className="my-4 w-full">
            {isEditable && (
              <div
                contentEditable={false}
                className="mb-3 flex flex-wrap items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    updateStats([
                      ...stats,
                      { number: "New", label: "New Stat" },
                    ])
                  }
                  className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-blue-700 transition"
                >
                  Add stat
                </button>
                <select
                  value={blockProps.direction}
                  onChange={(event) =>
                    updateBlockProps(props.editor, props.block, {
                      ...props.block.props,
                      direction: event.target.value,
                    })
                  }
                  className="rounded border px-2 py-2 text-xs bg-white"
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
                <select
                  value={blockProps.alignment}
                  onChange={(event) =>
                    updateBlockProps(props.editor, props.block, {
                      ...props.block.props,
                      alignment: event.target.value,
                    })
                  }
                  className="rounded border px-2 py-2 text-xs bg-white"
                >
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                </select>
                {stats.length > 1 && (
                  <button
                    type="button"
                    onClick={() => updateStats(stats.slice(0, -1))}
                    className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-red-700 transition"
                  >
                    Remove last
                  </button>
                )}
              </div>
            )}

            <div
              className="flex flex-wrap w-full"
              style={{
                flexDirection: blockProps.direction === "vertical" ? "column" : "row",
                justifyContent: alignmentValue(blockProps.alignment as Alignment),
                alignItems: blockProps.direction === "vertical"
                  ? alignmentValue(blockProps.alignment as Alignment)
                  : "stretch",
                gap: `${blockProps.gap}px`,
              }}
            >
              {stats.map((stat, index) => (
                <div
                  key={`${index}-${stat.label}`}
                  style={{
                    flex: `1 1 ${blockProps.width}px`,
                    maxWidth: "100%",
                    minWidth: 0,
                  }}
                >
                  {isEditable ? (
                    <EditableStatCard
                      number={stat.number}
                      label={stat.label}
                      backgroundColor={blockProps.backgroundColor}
                      numberColor={blockProps.numberColor}
                      labelColor={blockProps.labelColor}
                      borderColor={blockProps.borderColor}
                      borderWidth={blockProps.borderWidth}
                      radius={blockProps.radius}
                      shadow={blockProps.shadow as ShadowSize}
                      width={blockProps.width}
                      height={blockProps.height}
                      fillWidth
                      editor={props.editor}
                      block={props.block}
                      itemIndex={index}
                      groupMode
                    />
                  ) : (
                    <ReadOnlyStatCard
                      number={stat.number}
                      label={stat.label}
                      backgroundColor={blockProps.backgroundColor}
                      numberColor={blockProps.numberColor}
                      labelColor={blockProps.labelColor}
                      borderColor={blockProps.borderColor}
                      borderWidth={blockProps.borderWidth}
                      radius={blockProps.radius}
                      shadow={blockProps.shadow as ShadowSize}
                      width={blockProps.width}
                      height={blockProps.height}
                      fillWidth
                    />
                  )}
                </div>
              ))}
            </div>

            {isEditable && (
              <>
                <StatSettings editor={props.editor} block={props.block} groupMode />
                <div contentEditable={false}>
                  <label className="mt-3 block text-xs font-semibold text-gray-600">
                    Gap: {blockProps.gap}px
                    <input
                      type="range"
                      min="0"
                      max="80"
                      value={blockProps.gap}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          gap: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        );
      },
    }
  );

const ButtonBlock = () =>
  createReactBlockSpec(
    {
      type: "button",
      propSchema: {
        schemaVersion: { default: 1, type: "number" },
        text: { default: DEFAULTS.button.text, type: "string" },
        url: { default: DEFAULTS.button.url, type: "string" },
        alignment: { default: DEFAULTS.button.alignment, type: "string" },
        backgroundColor: { default: DEFAULTS.button.backgroundColor, type: "string" },
        textColor: { default: DEFAULTS.button.textColor, type: "string" },
        hoverColor: { default: DEFAULTS.button.hoverColor, type: "string" },
        borderColor: { default: DEFAULTS.button.borderColor, type: "string" },
        borderWidth: { default: DEFAULTS.button.borderWidth, type: "number" },
        radius: { default: DEFAULTS.button.radius, type: "number" },
        shadow: { default: DEFAULTS.button.shadow, type: "string" },
        width: { default: DEFAULTS.button.width, type: "number" },
        height: { default: DEFAULTS.button.height, type: "number" },
        size: { default: DEFAULTS.button.size, type: "string" },
        newTab: { default: DEFAULTS.button.newTab, type: "boolean" },
      },
      content: "none",
    },
    {
      render: (props) => {
        const blockProps = props.block.props;
        const isEditable = props.editor.isEditable;
        const safeUrl = isValidUrl(blockProps.url) ? blockProps.url : "#";

        return (
          <div
            className="my-6 flex w-full flex-col gap-3"
            style={{ alignItems: alignmentValue(blockProps.alignment as Alignment) }}
          >
            {isEditable && (
              <div
                contentEditable={false}
                className="w-full flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-100 p-4"
              >
                <label className="text-xs font-bold text-gray-600">
                  Button content and design
                </label>
                <input
                  value={blockProps.text}
                  onChange={(event) =>
                    updateBlockProps(props.editor, props.block, {
                      ...props.block.props,
                      text: event.target.value,
                    })
                  }
                  className="w-full rounded border bg-white px-3 py-2 text-sm outline-none"
                  placeholder="Button text"
                />
                <input
                  value={blockProps.url}
                  onChange={(event) =>
                    updateBlockProps(props.editor, props.block, {
                      ...props.block.props,
                      url: event.target.value,
                    })
                  }
                  className="w-full rounded border bg-white px-3 py-2 text-sm outline-none"
                  placeholder="https://example.com"
                />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-semibold text-gray-600">
                    Alignment
                    <select
                      value={blockProps.alignment}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          alignment: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border bg-white px-2 py-2 text-sm"
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    Size
                    <select
                      value={blockProps.size}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          size: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border bg-white px-2 py-2 text-sm"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    Width: {blockProps.width}px
                    <input
                      type="range"
                      min="80"
                      max="900"
                      value={blockProps.width}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          width: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    Height: {blockProps.height}px
                    <input
                      type="range"
                      min="30"
                      max="140"
                      value={blockProps.height}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          height: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {(
                    [
                      ["backgroundColor", "Background"],
                      ["textColor", "Text"],
                      ["hoverColor", "Hover"],
                      ["borderColor", "Border"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="text-xs font-semibold text-gray-600">
                      {label}
                      <input
                        type="color"
                        value={blockProps[key]}
                        onChange={(event) =>
                          updateBlockProps(props.editor, props.block, {
                            ...props.block.props,
                            [key]: event.target.value,
                          })
                        }
                        className="mt-1 block h-9 w-full cursor-pointer rounded border"
                      />
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <label className="text-xs font-semibold text-gray-600">
                    Border: {blockProps.borderWidth}px
                    <input
                      type="range"
                      min="0"
                      max="8"
                      value={blockProps.borderWidth}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          borderWidth: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    Radius: {blockProps.radius}px
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={blockProps.radius}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          radius: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>
                  <label className="text-xs font-semibold text-gray-600">
                    Shadow
                    <select
                      value={blockProps.shadow}
                      onChange={(event) =>
                        updateBlockProps(props.editor, props.block, {
                          ...props.block.props,
                          shadow: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded border bg-white px-2 py-2 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={blockProps.newTab}
                    onChange={(event) =>
                      updateBlockProps(props.editor, props.block, {
                        ...props.block.props,
                        newTab: event.target.checked,
                      })
                    }
                  />
                  Open link in a new tab
                </label>
              </div>
            )}

            <a
              href={safeUrl}
              target={blockProps.newTab ? "_blank" : undefined}
              rel={blockProps.newTab ? "noopener noreferrer" : undefined}
              className="group/button inline-flex items-center justify-center font-semibold transition-all duration-200"
              contentEditable={false}
              style={{
                // Responsive: shrink below configured width on small screens
                width: `min(${blockProps.width ?? 220}px, 100%)`,
                // minHeight instead of height so long labels can wrap on mobile
                minHeight: `${blockProps.height ?? 48}px`,
                padding: buttonPadding(blockProps.size as ButtonSize),
                fontSize: buttonFontSize(blockProps.size as ButtonSize),
                color: blockProps.textColor ?? "#fff",
                backgroundColor: blockProps.backgroundColor ?? "#2563eb",
                border: `${(blockProps.borderWidth ?? 0) > 0 ? `${blockProps.borderWidth}px solid ${blockProps.borderColor ?? "#000"}` : ""}`,
                borderRadius: `${blockProps.radius ?? 8}px`,
                boxShadow: blockProps.shadow ? shadowValue(blockProps.shadow as ShadowSize) : "none",
                whiteSpace: "normal",
                textAlign: "center",
              }}
              onMouseEnter={(event) => {
                const target = event.currentTarget;
                const originalBg = target.style.backgroundColor;
                const hoverBg = blockProps.hoverColor ?? target.style.backgroundColor;
                target.style.setProperty("background-color", hoverBg);
              }}
              onMouseLeave={(event) => {
                const target = event.currentTarget;
                const originalBg = target.style.backgroundColor;
                const defaultBg = blockProps.backgroundColor ?? originalBg;
                target.style.setProperty("background-color", defaultBg);
              }}
            >
              {blockProps.text}
            </a>
          </div>
        );
      },
    }
  );

// ---------------------------------------------------------
// SCHEMA CREATION
// ---------------------------------------------------------

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    stat: StatBlock()(),
    statsGroup: StatsGroupBlock()(),
    button: ButtonBlock()(),
  },
});
export type MyBlock = typeof schema.Block;

// Custom insertion logic
export function insertCustomBlock(
  editor: typeof schema.BlockNoteEditor,
  type: "stat" | "statsGroup" | "button"
) {
  const currentBlock = editor.getTextCursorPosition().block;
  editor.insertBlocks(
    [
      {
        type,
      },
    ],
    currentBlock,
    "after"
  );
}

// Suggestion Items for slash commands
export const insertStatItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Stat Highlight",
  onItemClick: () => insertCustomBlock(editor, "stat"),
  aliases: ["stat", "metric", "number"],
  group: "Custom Elements",
  icon: <span className="text-xl">📊</span>,
});

export const insertStatsGroupItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Stats Group",
  onItemClick: () => insertCustomBlock(editor, "statsGroup"),
  aliases: ["stats", "metrics", "cards", "statistics"],
  group: "Custom Elements",
  icon: <span className="text-xl">📈</span>,
});

export const insertButtonItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "CTA Button",
  onItemClick: () => insertCustomBlock(editor, "button"),
  aliases: ["button", "link", "cta"],
  group: "Custom Elements",
  icon: <span className="text-xl">🔘</span>,
});

// Alias for cleaner imports in consumer apps
export const customSchema = schema;

// ─────────────────────────────────────────────────────────────────────────────
// CustomSuggestionMenu — drop-in slash-menu replacement that injects custom
// block items alongside the default BlockNote items.
// ─────────────────────────────────────────────────────────────────────────────
export function CustomSuggestionMenu({ editor }: { editor: typeof schema.BlockNoteEditor }) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query: string) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(editor),
            insertStatItem(editor),
            insertStatsGroupItem(editor),
            insertButtonItem(editor),
          ],
          query
        )
      }
    />
  );
}
