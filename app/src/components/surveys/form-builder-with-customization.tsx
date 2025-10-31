"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";
import { FormBuilderV2, type Question } from "./form-builder-v2";
import { CustomizationModal } from "./customization-modal";

interface FormBuilderWithCustomizationProps {
  surveyId?: string;
  initialTitle?: string;
  initialDescription?: string;
  initialWelcomeMessage?: string;
  initialThankYouMessage?: string;
  initialQuestions?: Question[];
  initialStatus?: "draft" | "active" | "paused" | "archived";
  initialBrandColor?: string;
  initialAccentColor?: string;
  initialLogoUrl?: string;
  mode: "create" | "edit";
}

export function FormBuilderWithCustomization(props: FormBuilderWithCustomizationProps) {
  const [showCustomization, setShowCustomization] = useState(false);
  const [brandColor, setBrandColor] = useState(props.initialBrandColor || "#2563eb");
  const [accentColor, setAccentColor] = useState(props.initialAccentColor || "#06b6d4");
  const [logoUrl, setLogoUrl] = useState(props.initialLogoUrl || "");
  const router = useRouter();

  const handleCustomizationSave = async (data: {
    brandColor: string;
    accentColor: string;
    logoUrl: string;
  }) => {
    setBrandColor(data.brandColor);
    setAccentColor(data.accentColor);
    setLogoUrl(data.logoUrl);

    // Save to DB if in edit mode
    if (props.mode === "edit" && props.surveyId) {
      try {
        await fetch(`/api/surveys/${props.surveyId}/customization`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Error saving customization:", error);
      }
    }
  };

  return (
    <>
      <FormBuilderV2
        {...props}
        customizationButton={
          <button
            onClick={() => setShowCustomization(true)}
            className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <Palette className="w-4 h-4" />
            Personalizar
          </button>
        }
      />

      {/* Customization Modal */}
      <CustomizationModal
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        initialBrandColor={brandColor}
        initialAccentColor={accentColor}
        initialLogoUrl={logoUrl}
        onSave={handleCustomizationSave}
      />
    </>
  );
}
