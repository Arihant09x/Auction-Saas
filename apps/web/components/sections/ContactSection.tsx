"use client";

import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@repo/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional().refine(val => !val || /^[0-9]{10,15}$/.test(val), "Invalid mobile number. Enter 10-15 digits."),
    message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", mobile: "", message: "" }
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Failed to submit message");
            }

            toast.success("Message sent successfully! We will get back to you soon.");
            reset();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while sending your message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="contact"
            className="py-16 lg:py-24 relative z-10 w-full flex justify-center bg-transparent mt-[-10px]"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="max-w-[1000px] w-full mx-4 bg-white rounded-[24px] shadow-2xl p-6 lg:p-10 relative overflow-hidden"
            >
                <div className="grid lg:grid-cols-2 gap-10 items-stretch">

                    {/* Left side: Illustration and Info */}
                    <div className="flex flex-col h-full bg-[#f9fbff] p-8 rounded-[16px] border border-[#e2efff]">
                        <div className="relative w-full aspect-square max-w-[320px] mx-auto mb-8 bg-white/50 rounded-2xl flex items-center justify-center">
                            {/* Placeholder for customer support illustration */}
                            <div className="absolute inset-0 bg-[#0A307F] opacity-[0.03] rounded-2xl" />
                            <img src="https://tse1.mm.bing.net/th/id/OIP.gSkpI5uIEa8Qxa_qfvSSpwHaHa?pid=Api&P=0&w=300&h=300" alt="Customer Support" />
                        </div>

                        <div className="flex flex-col gap-6 mt-auto">
                            <div className="flex items-center gap-4">
                                <Phone size={20} color="#00379d" className="shrink-0" />
                                <span className="text-[14px] font-semibold text-[#012972]">+91 80731 82649</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail size={20} color="#00379d" className="shrink-0" />
                                <span className="text-[14px] font-semibold text-[#012972]">auction11.live@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <MapPin size={24} color="#00379d" className="shrink-0" />
                                <span className="text-[14px] font-semibold text-[#012972] leading-tight">
                                    Karnataka, India
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Form */}
                    <div className="flex flex-col py-4">
                        <div className="mb-8 relative w-fit">
                            <h2 className="text-[28px] font-bold text-[#012972] mb-2 font-['Poppins']">Get in Touch</h2>
                            <p className="text-[14px] text-[#4a6090]">Any question or remarks? Let us know!</p>
                            <div className="absolute -bottom-3 left-0 w-1/2 h-[3px] bg-[#00379d] rounded-full" />
                        </div>

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-[#012972]">Name *</label>
                                <input
                                    {...register("name")}
                                    type="text"
                                    placeholder="Enter your name"
                                    className={`w-full h-11 px-4 rounded-[8px] bg-white border text-[14px] text-[#012972] shadow-sm focus:outline-none transition-colors ${
                                        errors.name
                                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-[#d1d5db] focus:border-[#00379d]"
                                    }`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-0.5 font-semibold">{errors.name.message}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-[#012972]">Email ID *</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`w-full h-11 px-4 rounded-[8px] bg-white border text-[14px] text-[#012972] shadow-sm focus:outline-none transition-colors ${
                                        errors.email
                                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-[#d1d5db] focus:border-[#00379d]"
                                    }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-0.5 font-semibold">{errors.email.message}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-[#012972]">Mobile Number</label>
                                <input
                                    {...register("mobile")}
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    className={`w-full h-11 px-4 rounded-[8px] bg-white border text-[14px] text-[#012972] shadow-sm focus:outline-none transition-colors ${
                                        errors.mobile
                                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-[#d1d5db] focus:border-[#00379d]"
                                    }`}
                                />
                                {errors.mobile && <p className="text-red-500 text-xs mt-0.5 font-semibold">{errors.mobile.message}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-bold text-[#012972]">Your Message *</label>
                                <textarea
                                    {...register("message")}
                                    placeholder="Enter your message"
                                    className={`w-full h-28 p-4 rounded-[8px] bg-white border text-[14px] text-[#012972] resize-none shadow-sm focus:outline-none transition-colors ${
                                        errors.message
                                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-[#d1d5db] focus:border-[#00379d]"
                                    }`}
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-0.5 font-semibold">{errors.message.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-4 bg-[#012972] text-white font-bold py-3.5 px-10 rounded-[99px] border border-[#ffaf2e] hover:opacity-90 hover:scale-105 transition-all duration-200 w-full max-w-[180px] text-[15px] shadow-[0_4px_16px_rgba(0,55,157,0.2)] focus:ring-2 focus:ring-[#ffaf2e] focus:outline-none w-[160px] self-end font-epilogue disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : "Submit"}
                            </Button>
                        </form>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
