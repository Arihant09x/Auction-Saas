"use client";

import {
    createReactBlockSpec,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from "@blocknote/react";

import { BlockNoteView } from "@blocknote/mantine";

import {
    BlockNoteSchema,
    defaultBlockSpecs,
    filterSuggestionItems,
} from "@blocknote/core";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

type Alignment = "start" | "center" | "end";
type StatsDirection = "horizontal" | "vertical";
type ButtonSize = "small" | "medium" | "large";
type ShadowSize = "none" | "small" | "medium" | "large";

export type StatItem = {
    number: string;
    label: string;
};

// ---------------------------------------------------------
// DEFAULTS
// ---------------------------------------------------------

const DEFAULTS = {
    stat: {
        number: "10K+",
        label: "Active Users",
        backgroundColor: "#eff6ff",
        numberColor: "#1d4ed8",
        labelColor: "#6b7280",
        borderColor: "#bfdbfe",
        borderWidth: 2,
        radius: 16,
        shadow: "small",
        width: 320,
        height: 170,
        alignment: "center",
    },

    statsGroup: {
        direction: "horizontal",
        alignment: "center",
        gap: 16,
        backgroundColor: "#eff6ff",
        numberColor: "#1d4ed8",
        labelColor: "#6b7280",
        borderColor: "#bfdbfe",
        borderWidth: 2,
        radius: 16,
        shadow: "small",
        width: 260,
        height: 150,
    },

    button: {
        text: "Click Here",
        url: "https://",
        alignment: "center",
        backgroundColor: "#2563eb",
        textColor: "#ffffff",
        hoverColor: "#1d4ed8",
        borderColor: "#2563eb",
        borderWidth: 0,
        radius: 8,
        shadow: "small",
        width: 180,
        height: 48,
        size: "medium",
        newTab: true,
    },
} as const;

// ---------------------------------------------------------
// JSON HELPERS
// ---------------------------------------------------------

function parseStats(value: string): StatItem[] {
    try {
        const parsed: unknown = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(
            (item): item is StatItem =>
                typeof item === "object" &&
                item !== null &&
                typeof (item as StatItem).number === "string" &&
                typeof (item as StatItem).label === "string",
        );
    } catch {
        return [];
    }
}

function serializeStats(stats: StatItem[]) {
    return JSON.stringify(
        stats.map((item) => ({
            number: item.number,
            label: item.label,
        })),
    );
}

// ---------------------------------------------------------
// SAVE SANITIZER
// ---------------------------------------------------------

function isEmptyParagraph(block: any) {
    return (
        block.type === "paragraph" &&
        (!Array.isArray(block.content) || block.content.length === 0) &&
        (!Array.isArray(block.children) || block.children.length === 0)
    );
}

function isDefaultParagraphProps(props: Record<string, unknown>) {
    return (
        props.backgroundColor === "default" &&
        props.textColor === "default" &&
        props.textAlignment === "left"
    );
}

function cleanBlock(block: any): any | null {
    if (!block || typeof block !== "object") {
        return null;
    }

    if (isEmptyParagraph(block)) {
        return null;
    }

    const cleaned: Record<string, unknown> = {
        id: block.id,
        type: block.type,
    };

    if (block.props && typeof block.props === "object") {
        const props = { ...block.props };

        if (block.type === "paragraph" && isDefaultParagraphProps(props)) {
            delete props.backgroundColor;
            delete props.textColor;
            delete props.textAlignment;
        }

        if (block.type === "stat") {
            removeDefaultProps(props, DEFAULTS.stat);
        }

        if (block.type === "statsGroup") {
            removeDefaultProps(props, DEFAULTS.statsGroup);
        }

        if (block.type === "button") {
            removeDefaultProps(props, DEFAULTS.button);
        }

        if (Object.keys(props).length > 0) {
            cleaned.props = props;
        }
    }

    if (Array.isArray(block.content) && block.content.length > 0) {
        cleaned.content = block.content;
    }

    if (Array.isArray(block.children) && block.children.length > 0) {
        const children = block.children
            .map((child: any) => cleanBlock(child))
            .filter(Boolean);

        if (children.length > 0) {
            cleaned.children = children;
        }
    }

    return cleaned;
}

function removeDefaultProps(
    props: Record<string, unknown>,
    defaults: Record<string, unknown>,
) {
    Object.entries(defaults).forEach(([key, defaultValue]) => {
        if (props[key] === defaultValue) {
            delete props[key];
        }
    });
}

export function sanitizeDocument(blocks: any[]) {
    return blocks.map((block) => cleanBlock(block)).filter(Boolean);
}

// ---------------------------------------------------------
// GENERAL HELPERS
// ---------------------------------------------------------

function updateBlockProps(
    editor: any,
    block: any,
    props: Record<string, unknown>,
) {
    editor.updateBlock(block, {
        props,
    });
}

function shadowValue(shadow: ShadowSize) {
    const values: Record<ShadowSize, string> = {
        none: "none",
        small: "0 2px 6px rgba(0, 0, 0, 0.10)",
        medium: "0 8px 20px rgba(0, 0, 0, 0.14)",
        large: "0 16px 35px rgba(0, 0, 0, 0.20)",
    };

    return values[shadow];
}

function buttonPadding(size: ButtonSize) {
    const values: Record<ButtonSize, string> = {
        small: "8px 14px",
        medium: "12px 22px",
        large: "16px 30px",
    };

    return values[size];
}

function buttonFontSize(size: ButtonSize) {
    const values: Record<ButtonSize, string> = {
        small: "13px",
        medium: "15px",
        large: "18px",
    };

    return values[size];
}

function alignmentValue(alignment: Alignment) {
    if (alignment === "start") return "flex-start";
    if (alignment === "end") return "flex-end";
    return "center";
}

// ---------------------------------------------------------
// STAT CARD
// ---------------------------------------------------------

function StatCard({
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
    editor: any;
    block: any;
    itemIndex?: number;
    groupMode?: boolean;
}) {
    const updateItem = (key: "number" | "label", value: string) => {
        if (groupMode && typeof itemIndex === "number") {
            const stats = parseStats(block.props.stats);

            stats[itemIndex] = {
                ...stats[itemIndex],
                [key]: value,
            };

            updateBlockProps(editor, block, {
                ...block.props,
                stats: serializeStats(stats),
            });

            return;
        }

        updateBlockProps(editor, block, {
            ...block.props,
            [key]: value,
        });
    };

    return (
        <div
            style={{
                backgroundColor,
                border: `${borderWidth}px solid ${borderColor}`,
                borderRadius: `${radius}px`,
                boxShadow: shadowValue(shadow),
                width: `${width}px`,
                minHeight: `${height}px`,
            }}
            className="flex flex-col items-center justify-center p-6 transition-all duration-200"
        >
            <input
                value={number}
                onChange={(event) => updateItem("number", event.target.value)}
                placeholder="Number..."
                className="w-full bg-transparent text-center text-4xl font-extrabold outline-none"
                style={{
                    color: numberColor,
                }}
            />

            <input
                value={label}
                onChange={(event) => updateItem("label", event.target.value)}
                placeholder="Label..."
                className="mt-2 w-full bg-transparent text-center text-sm font-semibold uppercase tracking-wider outline-none"
                style={{
                    color: labelColor,
                }}
            />
        </div>
    );
}

// ---------------------------------------------------------
// STAT SETTINGS
// ---------------------------------------------------------

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
                            onChange={(event) =>
                                update("backgroundColor", event.target.value)
                            }
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
                            onChange={(event) =>
                                update("borderWidth", Number(event.target.value))
                            }
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
                            className="mt-1 w-full rounded border px-2 py-2 text-sm"
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
                                className="mt-1 w-full rounded border px-2 py-2 text-sm"
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
// STAT BLOCK
// ---------------------------------------------------------

const StatBlock = createReactBlockSpec(
    {
        type: "stat",
        propSchema: {
            number: { default: DEFAULTS.stat.number, type: "string" },
            label: { default: DEFAULTS.stat.label, type: "string" },
            backgroundColor: {
                default: DEFAULTS.stat.backgroundColor,
                type: "string",
            },
            numberColor: {
                default: DEFAULTS.stat.numberColor,
                type: "string",
            },
            labelColor: {
                default: DEFAULTS.stat.labelColor,
                type: "string",
            },
            borderColor: {
                default: DEFAULTS.stat.borderColor,
                type: "string",
            },
            borderWidth: {
                default: DEFAULTS.stat.borderWidth,
                type: "number",
            },
            radius: {
                default: DEFAULTS.stat.radius,
                type: "number",
            },
            shadow: {
                default: DEFAULTS.stat.shadow,
                type: "string",
            },
            width: {
                default: DEFAULTS.stat.width,
                type: "number",
            },
            height: {
                default: DEFAULTS.stat.height,
                type: "number",
            },
            alignment: {
                default: DEFAULTS.stat.alignment,
                type: "string",
            },
        },
        content: "none",
    },
    {
        render: (props) => {
            const blockProps = props.block.props;

            return (
                <div
                    className="my-4 flex w-full"
                    style={{
                        justifyContent: alignmentValue(blockProps.alignment as Alignment),
                    }}
                >
                    <div className="flex w-full flex-col items-center">
                        <StatCard
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

                        <StatSettings editor={props.editor} block={props.block} />
                    </div>
                </div>
            );
        },
    },
);

// ---------------------------------------------------------
// STATS GROUP BLOCK
// ---------------------------------------------------------

const StatsGroupBlock = createReactBlockSpec(
    {
        type: "statsGroup",
        propSchema: {
            stats: {
                default: JSON.stringify([
                    { number: "10K+", label: "Active Users" },
                    { number: "99.9%", label: "Uptime" },
                ]),
                type: "string",
            },
            direction: {
                default: DEFAULTS.statsGroup.direction,
                type: "string",
            },
            alignment: {
                default: DEFAULTS.statsGroup.alignment,
                type: "string",
            },
            gap: {
                default: DEFAULTS.statsGroup.gap,
                type: "number",
            },
            backgroundColor: {
                default: DEFAULTS.statsGroup.backgroundColor,
                type: "string",
            },
            numberColor: {
                default: DEFAULTS.statsGroup.numberColor,
                type: "string",
            },
            labelColor: {
                default: DEFAULTS.statsGroup.labelColor,
                type: "string",
            },
            borderColor: {
                default: DEFAULTS.statsGroup.borderColor,
                type: "string",
            },
            borderWidth: {
                default: DEFAULTS.statsGroup.borderWidth,
                type: "number",
            },
            radius: {
                default: DEFAULTS.statsGroup.radius,
                type: "number",
            },
            shadow: {
                default: DEFAULTS.statsGroup.shadow,
                type: "string",
            },
            width: {
                default: DEFAULTS.statsGroup.width,
                type: "number",
            },
            height: {
                default: DEFAULTS.statsGroup.height,
                type: "number",
            },
        },
        content: "none",
    },
    {
        render: (props) => {
            const blockProps = props.block.props;
            const stats = parseStats(blockProps.stats);

            const updateStats = (newStats: StatItem[]) => {
                updateBlockProps(props.editor, props.block, {
                    ...props.block.props,
                    stats: serializeStats(newStats),
                });
            };

            return (
                <div className="my-4">
                    <div
                        contentEditable={false}
                        className="mb-3 flex flex-wrap items-center gap-2"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                updateStats([
                                    ...stats,
                                    {
                                        number: "New",
                                        label: "New Stat",
                                    },
                                ])
                            }
                            className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
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
                            className="rounded border px-2 py-2 text-xs"
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
                            className="rounded border px-2 py-2 text-xs"
                        >
                            <option value="start">Start</option>
                            <option value="center">Center</option>
                            <option value="end">End</option>
                        </select>

                        {stats.length > 1 && (
                            <button
                                type="button"
                                onClick={() => updateStats(stats.slice(0, -1))}
                                className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                            >
                                Remove last
                            </button>
                        )}
                    </div>

                    <div
                        className="flex flex-wrap"
                        style={{
                            flexDirection:
                                blockProps.direction === "vertical" ? "column" : "row",
                            justifyContent: alignmentValue(blockProps.alignment as Alignment),
                            alignItems:
                                blockProps.direction === "vertical"
                                    ? alignmentValue(blockProps.alignment as Alignment)
                                    : "stretch",
                            gap: `${blockProps.gap}px`,
                        }}
                    >
                        {stats.map((stat, index) => (
                            <StatCard
                                key={`${index}-${stat.label}`}
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
                                editor={props.editor}
                                block={props.block}
                                itemIndex={index}
                                groupMode
                            />
                        ))}
                    </div>

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
                </div>
            );
        },
    },
);

// ---------------------------------------------------------
// BUTTON BLOCK
// ---------------------------------------------------------

const ButtonBlock = createReactBlockSpec(
    {
        type: "button",
        propSchema: {
            text: { default: DEFAULTS.button.text, type: "string" },
            url: { default: DEFAULTS.button.url, type: "string" },
            alignment: { default: DEFAULTS.button.alignment, type: "string" },
            backgroundColor: {
                default: DEFAULTS.button.backgroundColor,
                type: "string",
            },
            textColor: {
                default: DEFAULTS.button.textColor,
                type: "string",
            },
            hoverColor: {
                default: DEFAULTS.button.hoverColor,
                type: "string",
            },
            borderColor: {
                default: DEFAULTS.button.borderColor,
                type: "string",
            },
            borderWidth: {
                default: DEFAULTS.button.borderWidth,
                type: "number",
            },
            radius: {
                default: DEFAULTS.button.radius,
                type: "number",
            },
            shadow: {
                default: DEFAULTS.button.shadow,
                type: "string",
            },
            width: {
                default: DEFAULTS.button.width,
                type: "number",
            },
            height: {
                default: DEFAULTS.button.height,
                type: "number",
            },
            size: { default: DEFAULTS.button.size, type: "string" },
            newTab: { default: DEFAULTS.button.newTab, type: "boolean" },
        },
        content: "none",
    },
    {
        render: (props) => {
            const blockProps = props.block.props;

            return (
                <div
                    className="my-6 flex w-full"
                    style={{
                        justifyContent: alignmentValue(blockProps.alignment as Alignment),
                    }}
                >
                    <div className="w-full">
                        <div
                            contentEditable={false}
                            className="mb-3 flex flex-col gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-100 p-4"
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
                                className="w-full rounded border bg-white px-3 py-2 text-sm"
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
                                className="w-full rounded border bg-white px-3 py-2 text-sm"
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
                                    <label
                                        key={key}
                                        className="text-xs font-semibold text-gray-600"
                                    >
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

                        <a
                            href={blockProps.url || "#"}
                            target={blockProps.newTab ? "_blank" : undefined}
                            rel={blockProps.newTab ? "noopener noreferrer" : undefined}
                            className="group/button inline-flex items-center justify-center font-semibold transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                                width: `${blockProps.width}px`,
                                height: `${blockProps.height}px`,
                                padding: buttonPadding(blockProps.size as ButtonSize),
                                fontSize: buttonFontSize(blockProps.size as ButtonSize),
                                color: blockProps.textColor,
                                backgroundColor: blockProps.backgroundColor,
                                border: `${blockProps.borderWidth}px solid ${blockProps.borderColor}`,
                                borderRadius: `${blockProps.radius}px`,
                                boxShadow: shadowValue(blockProps.shadow as ShadowSize),
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.backgroundColor =
                                    blockProps.hoverColor;
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.backgroundColor =
                                    blockProps.backgroundColor;
                            }}
                        >
                            {blockProps.text}
                        </a>
                    </div>
                </div>
            );
        },
    },
);

// ---------------------------------------------------------
// SCHEMA
// ---------------------------------------------------------

export const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        stat: StatBlock(),
        statsGroup: StatsGroupBlock(),
        button: ButtonBlock(),
    },
});

export type MyBlock = typeof schema.Block;

// ---------------------------------------------------------
// INSERT BLOCKS
// ---------------------------------------------------------

function insertCustomBlock(
    editor: typeof schema.BlockNoteEditor,
    type: "stat" | "statsGroup" | "button",
) {
    const currentBlock = editor.getTextCursorPosition().block;

    editor.insertBlocks(
        [
            {
                type,
            },
        ],
        currentBlock,
        "after",
    );
}

// ---------------------------------------------------------
// SLASH MENU
// ---------------------------------------------------------

const insertStatItem = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Stat Highlight",
    onItemClick: () => insertCustomBlock(editor, "stat"),
    aliases: ["stat", "metric", "number"],
    group: "Custom Elements",
    icon: <span className="text-xl">📊</span>,
});

const insertStatsGroupItem = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Stats Group",
    onItemClick: () => insertCustomBlock(editor, "statsGroup"),
    aliases: ["stats", "metrics", "cards", "statistics"],
    group: "Custom Elements",
    icon: <span className="text-xl">📈</span>,
});

const insertButtonItem = (editor: typeof schema.BlockNoteEditor) => ({
    title: "CTA Button",
    onItemClick: () => insertCustomBlock(editor, "button"),
    aliases: ["button", "link", "cta"],
    group: "Custom Elements",
    icon: <span className="text-xl">🔘</span>,
});

// ---------------------------------------------------------
// MAIN EDITOR
// ---------------------------------------------------------

export default function BlogEditor({
    onChange,
}: {
    onChange: (data: MyBlock[]) => void;
}) {
    const editor = useCreateBlockNote({
        schema,
    });

    return (
        <div className="min-h-[500px] rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <BlockNoteView
                editor={editor}
                theme="light"
                slashMenu={false}
                onChange={() => {
                    onChange(sanitizeDocument(editor.document));
                }}
            >
                <SuggestionMenuController
                    triggerCharacter="/"
                    getItems={async (query) =>
                        filterSuggestionItems(
                            [
                                ...getDefaultReactSlashMenuItems(editor),
                                insertStatItem(editor),
                                insertStatsGroupItem(editor),
                                insertButtonItem(editor),
                            ],
                            query,
                        )
                    }
                />
            </BlockNoteView>
        </div>
    );
}
