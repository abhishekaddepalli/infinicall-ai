import { ImageDropzone } from "@/components/shared/ImageDropzone";
import TextAreaField from "@/components/shared/TextAreaField";
import TextInput from "@/components/shared/TextInput";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadImageMutation } from "@/redux/api/uploadApi";
import { HeroSectionFormProps } from "@/types/landing";
import { useFormikContext } from "formik";
import React from "react";

export const HeroSectionForm: React.FC<HeroSectionFormProps> = ({ t }) => {
  const [uploadImage] = useUploadImageMutation();
  const { setFieldValue, values } = useFormikContext<any>();

  const handleFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await uploadImage(formData).unwrap();
      if (result.imagePath) {
        setFieldValue('hero.image', result.imagePath);
      }
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <CardHeader className="border-b border-input-border-color py-4 sm:px-6 px-4">
        <CardTitle className="sm:text-xl text-lg font-bold text-title">
          {t("hero_section_configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <TextInput name="hero.badge" label={t("top_badge_text")} placeholder={t('e.g. New: Voice Calling AI v2.0')} />
        <TextInput name="hero.heading" label={t("main_headline_title")} placeholder={t('e.g. AI Voice Agents That Call, Qualify, Book & Follow Up')} />
        <TextAreaField name="hero.subheading" label={t("subheading_subtitle")} placeholder={t('A detailed description to show below the main title')} rows={4} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TextInput name="hero.cta_primary_text" label={t("primary_cta_button_text")} placeholder="Let's Talk" />
          <TextInput name="hero.cta_secondary_text" label={t("secondary_cta_button_text")} placeholder={t('view_documentation')} />
          <TextInput name="hero.cta_secondary_link" label={t("secondary_cta_button_link")} placeholder="https://docs.pixelstrap.net/autocall" />
        </div>
        <TextInput name="hero.image" label={t("hero_image_url")} placeholder={t('e.g. /uploads/landing-page/hero-image.png')} />
        <ImageDropzone
          label={t("upload_hero_image")}
          name="heroImageFile"
          onUpload={handleFile}
          value={values?.hero?.image}
          onRemove={() => setFieldValue('hero.image', '')}
        />
      </CardContent>
    </div>
  );
};
