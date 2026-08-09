"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import { useCreateContactInquiryMutation } from "@/redux/api/contactInquiryApi";
import { ContactProps } from "@/types/landing";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Contact({ contactDetailsData }: ContactProps) {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  const [createContactInquiry] = useCreateContactInquiryMutation();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      await createContactInquiry({
        name: formState.name,
        email: formState.email,
        subject: formState.subject,
        message: formState.message,
      }).unwrap();
      setFormStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setFormStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section className="relative py-[calc(40px+(96-40)*((100vw-320px)/(1920-320)))] bg-transparent border-t border-[#e2e8f0]/80 overflow-hidden" id="contact">
      {/* Subtle dotted grid background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0 bg-dot-pattern" />

      <div className="max-w-[1450px] mx-auto px-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[calc(25px+(48-25)*((100vw-320px)/(1920-320)))] items-stretch max-w-[1450px] mx-auto">
          {/* Left Side: Contact Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-center py-10 lg:pr-10">
            <div>
              <h2 className="text-[calc(32px+(48-32)*((100vw-320px)/(1920-320)))] leading-[1.2] font-semibold text-title mb-4">
                {t('contact_title')}
              </h2>
              <p className="text-[15px] text-subtitle-color leading-relaxed mb-10 max-w-md">
                {t('contact_sub_title')}
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Us */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-primary! rounded-full border border-slate-200 flex items-center justify-center text-white flex-shrink-0 bg-transparent">
                  <Mail className="w-4 h-4" />
                </div>
                <p className="text-base font-medium text-subtitle-color">{contactDetailsData.content?.email || "admin@domain.com"}</p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-primary! rounded-full border border-slate-200 flex items-center justify-center text-white flex-shrink-0 bg-transparent">
                  <Phone className="w-4 h-4" />
                </div>
                <p className="text-base font-medium text-subtitle-color">{contactDetailsData.content?.phone || "+1 (234) 567-890"}</p>
              </div>

              {/* Headquarters */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-primary! rounded-full border border-slate-200 flex items-center justify-center text-white flex-shrink-0 bg-transparent">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-base font-medium text-subtitle-color">{contactDetailsData.content?.location || "43 Roselle St. New York"}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl sm:p-6 p-4 flex flex-col justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
            {/* Soft decorative visual background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-full blur-2xl pointer-events-none" />

            {formStatus === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 flex flex-col items-center justify-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-title mb-2">{t('message_sent_successfully')}</h3>
                <p className="text-[14px] text-subtitle-color max-w-sm mb-8 leading-relaxed">{t('message_sent_successfully_desc')}</p>
                <Button onClick={() => setFormStatus("idle")} className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary/90 transition-colors duration-200">
                  {t('send_another_message')}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="form-name" className="text-[13px] font-medium text-slate-800">
                    {t('name')}
                  </Label>
                  <Input type="text" id="form-name" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 shadow-none" placeholder={t('full_name')} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="text-md font-bold text-slate-800">
                      {t('email')}
                    </Label>
                    <Input type="email" id="form-email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 shadow-none" placeholder={t('email')} />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="form-email" className="text-md font-bold text-slate-800">
                      {t('subject')}
                    </Label>
                    <Input type="text" id="form-subject" required value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 shadow-none" placeholder={t('subject')} />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="form-message" className="text-[13px] font-medium text-slate-800">
                    {t('message')}
                  </Label>
                  <Textarea id="form-message" required rows={5} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none shadow-none" placeholder="Hi Team Hello! I'm Reaching Out For..." />
                </div>

                {/* Button Action */}
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={formStatus === "loading"} className="sm:h-12 h-10 px-8 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-none disabled:opacity-80">
                    {formStatus === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t('submit_details')}</span>
                      </>
                    ) : (
                      <span>{t('submit')}</span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
