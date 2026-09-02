"use client";

import {
    createReactBlockSpec,
    useCreateBlockNote,
    BlockNoteViewRaw,
} from "@blocknote/react";

import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------

type Alignment = "start" | "center" | "end";
type ShadowSize = "none" | "small" | "medium" | "large";

type StatItem = {
    number: string;
    label: string;
};

// ---------------------------------------------------------
// HELPERS
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

function shadowValue(shadow: ShadowSize) {
    const values: Record<ShadowSize, string> = {
        none: "none",
        small: "0 2px 6px rgba(0, 0, 0, 0.10)",
        medium: "0 8px 20px rgba(0, 0, 0, 0.14)",
        large: "0 16px 35px rgba(0, 0, 0, 0.20)",
    };

    return values[shadow] ?? values.none;
}

function alignmentValue(alignment: Alignment) {
    if (alignment === "start") return "flex-start";
    if (alignment === "end") return "flex-end";
    return "center";
}

// ---------------------------------------------------------
// READ-ONLY STAT CARD
// ---------------------------------------------------------

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
}) {
    return (
        <div
            className="flex flex-col items-center justify-center p-6 transition-transform duration-300 hover:-translate-y-1"
            style={{
                width: `${width}px`,
                minHeight: `${height}px`,
                backgroundColor,
                border: `${borderWidth}px solid ${borderColor}`,
                borderRadius: `${radius}px`,
                boxShadow: shadowValue(shadow),
            }}
        >
            <span
                className="text-center text-4xl font-extrabold"
                style={{
                    color: numberColor,
                }}
            >
                {number}
            </span>

            <span
                className="mt-2 text-center text-sm font-semibold uppercase tracking-wider"
                style={{
                    color: labelColor,
                }}
            >
                {label}
            </span>
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
            number: { default: "10K+", type: "string" },
            label: { default: "Active Users", type: "string" },
            backgroundColor: { default: "#eff6ff", type: "string" },
            numberColor: { default: "#1d4ed8", type: "string" },
            labelColor: { default: "#6b7280", type: "string" },
            borderColor: { default: "#bfdbfe", type: "string" },
            borderWidth: { default: 2, type: "number" },
            radius: { default: 16, type: "number" },
            shadow: { default: "small", type: "string" },
            width: { default: 320, type: "number" },
            height: { default: 170, type: "number" },
            alignment: { default: "center", type: "string" },
        },
        content: "none",
    },
    {
        render: (props) => {
            const blockProps = props.block.props;

            return (
                <div
                    className="my-8 flex w-full"
                    style={{
                        justifyContent: alignmentValue(blockProps.alignment as Alignment),
                    }}
                >
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
            direction: { default: "horizontal", type: "string" },
            alignment: { default: "center", type: "string" },
            gap: { default: 16, type: "number" },
            backgroundColor: { default: "#eff6ff", type: "string" },
            numberColor: { default: "#1d4ed8", type: "string" },
            labelColor: { default: "#6b7280", type: "string" },
            borderColor: { default: "#bfdbfe", type: "string" },
            borderWidth: { default: 2, type: "number" },
            radius: { default: 16, type: "number" },
            shadow: { default: "small", type: "string" },
            width: { default: 260, type: "number" },
            height: { default: 150, type: "number" },
        },
        content: "none",
    },
    {
        render: (props) => {
            const blockProps = props.block.props;
            const stats = parseStats(blockProps.stats);

            return (
                <div
                    className="my-8 flex w-full flex-wrap"
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
                        <ReadOnlyStatCard
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
                        />
                    ))}
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
            text: { default: "Click Here", type: "string" },
            url: { default: "https://", type: "string" },
            alignment: { default: "center", type: "string" },
            backgroundColor: { default: "#2563eb", type: "string" },
            textColor: { default: "#ffffff", type: "string" },
            hoverColor: { default: "#1d4ed8", type: "string" },
            borderColor: { default: "#2563eb", type: "string" },
            borderWidth: { default: 0, type: "number" },
            radius: { default: 8, type: "number" },
            shadow: { default: "small", type: "string" },
            width: { default: 180, type: "number" },
            height: { default: 48, type: "number" },
            size: { default: "medium", type: "string" },
            newTab: { default: true, type: "boolean" },
        },
        content: "none",
    },
    {
        render: (props) => {
            const blockProps = props.block.props;

            return (
                <div
                    className="my-8 flex w-full"
                    style={{
                        justifyContent: alignmentValue(blockProps.alignment as Alignment),
                    }}
                >
                    <a
                        href={blockProps.url || "#"}
                        target={blockProps.newTab ? "_blank" : undefined}
                        rel={blockProps.newTab ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center font-semibold transition-all duration-200 hover:-translate-y-1"
                        style={{
                            width: `${blockProps.width}px`,
                            height: `${blockProps.height}px`,
                            color: blockProps.textColor,
                            backgroundColor: blockProps.backgroundColor,
                            border: `${blockProps.borderWidth}px solid ${blockProps.borderColor}`,
                            borderRadius: `${blockProps.radius}px`,
                            boxShadow: shadowValue(blockProps.shadow as ShadowSize),
                        }}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.backgroundColor = blockProps.hoverColor;
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.backgroundColor =
                                blockProps.backgroundColor;
                        }}
                    >
                        {blockProps.text}
                    </a>
                </div>
            );
        },
    },
);

// ---------------------------------------------------------
// COMPLETE RENDERER SCHEMA
// ---------------------------------------------------------

const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        stat: StatBlock(),
        statsGroup: StatsGroupBlock(),
        button: ButtonBlock(),
    },
});

export type RendererBlock = typeof schema.Block;

// ---------------------------------------------------------
// RENDERER
// ---------------------------------------------------------

export default function BlogRenderer({
    content,
}: {
    content: RendererBlock[];
}) {
    const editor = useCreateBlockNote({
        schema,
        initialContent: content,
    });

    return (
        <div className="prose prose-lg w-full max-w-none prose-headings:font-bold prose-a:text-blue-600">
            <BlockNoteViewRaw editor={editor} editable={false} theme="light" />
        </div>
    );
}
