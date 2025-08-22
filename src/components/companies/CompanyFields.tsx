import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import CategoryMultiSelect from "../categories/CategoryMultiSelect";

// Adjust import path to your Category type
import { Category } from "@/types/category";
import { fetchCategories } from "@/services/category-service";

export type FormValues = {
  nameEn: string;
  nameAr: string;
  noteEN?: string;
  noteAR?: string;
  categoryIds: number[];
};

const CompanyFormFields = () => {
  const { t } = useTranslation();
  const form = useFormContext<FormValues>();

  // 1. State to store categories
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nameEn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("companyNameEN")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterCompanyNameEN")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nameAr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("companyNameAR")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterCompanyNameAR")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="noteEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("noteEN")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("enterCompanyNoteEN")}
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="noteAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("noteAR")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("enterCompanyNoteAR")}
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Multi-select for categories */}
      <FormField
        control={form.control}
        name="categoryIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("categories")}
              <span style={{ marginLeft: 8, fontWeight: "bold" }}>
                {Array.isArray(field.value) && field.value.length > 0
                  ? `(${field.value.length} ${t("selected")})`
                  : ""}
              </span>
            </FormLabel>
            <FormControl>
              <CategoryMultiSelect
                value={field.value ?? []} // fallback to empty array if undefined
                onChange={field.onChange}
                options={categories.map((c) => ({
                  value: c.id,
                  label: `${c.nameEN} / ${c.nameAR}`,
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyFormFields;
