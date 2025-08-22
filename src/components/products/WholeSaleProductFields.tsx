import React, { useState } from "react";
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
import { ExpirationType, WholeSaleProduct } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ItemUnit } from "@/types/item-unit";
import { Category } from "@/types/category";
import { Company } from "@/types/company";
import { Tag } from "@/types/tag";
import { Notice } from "@/types/notice";
import { useTranslation } from "react-i18next";
import { fetchCategoriesByCompanyId } from "@/services/category-service";
import FlavourMultiSelect from "@/components/products/FlavourMultiSelect";
import { Flavour } from "@/services/flavour-service";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";

const expirationTypes = ["Day", "Week", "Month", "Year"];

interface WholeSaleProductFormFieldsProps {
  units: ItemUnit[];
  categories: Category[];
  companies: Company[];
  tags: Tag[];
  notices: Notice[];
  selectedFlavours: Flavour[];
  setSelectedFlavours: (flavours: Flavour[]) => void;
}

const expirationOptions = [
  { label: "day", value: ExpirationType.Day },
  { label: "week", value: ExpirationType.Week },
  { label: "month", value: ExpirationType.Month },
  { label: "year", value: ExpirationType.Year },
];

const WholeSaleProductFormFields = ({
  units,
  categories: initialCategories,
  companies,
  tags,
  notices,
  selectedFlavours,
  setSelectedFlavours,
}: WholeSaleProductFormFieldsProps) => {
  const form = useFormContext<WholeSaleProduct>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const isSellByCustomValue = form.watch("isSellByCustomValue");
  const isMaximumAmountForUser = form.watch("isMaximumAmountForUser");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const companyId = form.watch("companyId");

  // Defensive: Ensure tagIds and noticeIds are always arrays
  React.useEffect(() => {
    if (!Array.isArray(form.getValues("tagIds"))) {
      form.setValue("tagIds", []);
    }
    if (!Array.isArray(form.getValues("noticeIds"))) {
      form.setValue("noticeIds", []);
    }
  }, [form]);

  React.useEffect(() => {
    if (companyId) {
      fetchCategoriesByCompanyId(companyId)
        .then((cats) => {
          setCategories(cats);
          const currentCategoryId = form.getValues("categoryId");
          if (!cats.some((cat) => cat.id === currentCategoryId)) {
            form.setValue("categoryId", null);
          }
        })
        .catch(() => {
          setCategories([]);
          form.setValue("categoryId", null);
        });
    } else {
      setCategories([]);
      form.setValue("categoryId", null);
    }
  }, [companyId, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nameEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("nameEN")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterProductNameEN")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nameAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("nameAR")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterProductNameAR")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descriptionEN"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("descriptionEN")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("enterDescriptionEN")}
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
        name="descriptionAR"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("descriptionAR")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t("enterDescriptionAR")}
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Units */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bigUnitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bigUnit")}</FormLabel>
              <Select
                value={field.value == null ? "" : String(field.value)}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
              >
                <FormControl>
                  <SelectTrigger
                    className={isRTL ? "text-right" : ""}
                    style={isRTL ? { direction: "rtl" } : {}}
                  >
                    <SelectValue
                      placeholder={t("selectUnit")}
                      className={isRTL ? "text-right" : ""}
                      style={isRTL ? { direction: "rtl" } : {}}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  className={isRTL ? "text-right" : ""}
                  style={isRTL ? { direction: "rtl" } : {}}
                >
                  {(units || []).map((u: ItemUnit) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {isRTL ? u.nameAR : u.nameEN} ({u.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="smallUnitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("smallUnit")}</FormLabel>
              <Select
                value={field.value == null ? "" : String(field.value)}
                onValueChange={(val) =>
                  field.onChange(val ? Number(val) : null)
                }
              >
                <FormControl>
                  <SelectTrigger
                    className={isRTL ? "text-right" : ""}
                    style={isRTL ? { direction: "rtl" } : {}}
                  >
                    <SelectValue
                      placeholder={t("selectUnit")}
                      className={isRTL ? "text-right" : ""}
                      style={isRTL ? { direction: "rtl" } : {}}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  className={isRTL ? "text-right" : ""}
                  style={isRTL ? { direction: "rtl" } : {}}
                >
                  {units.map((u: ItemUnit) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {isRTL ? u.nameAR : u.nameEN} ({u.amount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bigUnitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bigUnitPrice")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterBigUnitPrice")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smallUnitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("smallUnitPrice")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterSmallUnitPrice")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bigUnitSpecialPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("bigUnitSpecialPrice")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterSpecialBigUnitPrice")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smallUnitSpecialPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("smallUnitSpecialPrice")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterSpecialSmallUnitPrice")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tax, Expiration */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="taxPrcent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("tax")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterTax")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vatPrcent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("vat")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterVat")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="expiration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("expirationDuration")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? null : parseFloat(e.target.value)
                  )
                }
                placeholder={t("enterExpirationDuration")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expirationType"
        render={({ field }) => (
          <FormItem
            className={isRTL ? "text-right" : ""}
            style={isRTL ? { direction: "rtl" } : {}}
          >
            <FormLabel>{t("expirationType")}</FormLabel>
            <Select
              value={field.value == null ? "" : String(field.value)}
              onValueChange={(val) => field.onChange(val ? Number(val) : null)}
            >
              <FormControl>
                <SelectTrigger
                  className={isRTL ? "text-right" : ""}
                  style={isRTL ? { direction: "rtl" } : {}}
                >
                  <SelectValue
                    placeholder={t("selectType")}
                    className={isRTL ? "text-right" : ""}
                    style={isRTL ? { direction: "rtl" } : {}}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                className={isRTL ? "text-right" : ""}
                style={isRTL ? { direction: "rtl" } : {}}
              >
                {expirationOptions.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {t(opt.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nutrition */}
      <FormField
        control={form.control}
        name="per"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("per")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t("per")}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? null : parseFloat(e.target.value)
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("calories")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterCalories")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="protein"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("protein")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterProtein")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fat")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterFat")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carbohydrates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("carbohydrates")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value)
                    )
                  }
                  placeholder={t("enterCarbohydrates")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Selects */}
      <FormField
        control={form.control}
        name="companyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("company")}</FormLabel>
            <Select
              value={field.value == null ? "" : String(field.value)}
              onValueChange={(val) => field.onChange(val ? Number(val) : null)}
            >
              <FormControl>
                <SelectTrigger
                  className={isRTL ? "text-right" : ""}
                  style={isRTL ? { direction: "rtl" } : {}}
                >
                  <SelectValue
                    placeholder={t("selectCompany")}
                    className={isRTL ? "text-right" : ""}
                    style={isRTL ? { direction: "rtl" } : {}}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                className={isRTL ? "text-right" : ""}
                style={isRTL ? { direction: "rtl" } : {}}
              >
                {(companies || []).map((c: Company) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {isRTL ? t(c.nameAr) : t(c.nameEn)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("category")}</FormLabel>
            <Select
              value={field.value == null ? "" : String(field.value)}
              onValueChange={(val) =>
                field.onChange(val === "" ? null : Number(val))
              }
            >
              <FormControl>
                <SelectTrigger
                  className={isRTL ? "text-right" : ""}
                  style={isRTL ? { direction: "rtl" } : {}}
                >
                  <SelectValue
                    placeholder={t("selectCategory")}
                    className={isRTL ? "text-right" : ""}
                    style={isRTL ? { direction: "rtl" } : {}}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                className={isRTL ? "text-right" : ""}
                style={isRTL ? { direction: "rtl" } : {}}
              >
                {(categories || []).map((c: Category) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {isRTL ? t(c.nameAR) : t(c.nameEN)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormLabel>
        {t("flavours")}
        <span style={{ marginLeft: 8, fontWeight: "bold" }}>
          {selectedFlavours.length > 0
            ? `(${selectedFlavours.length} ${t('selected')})`
            : ""}
        </span>
      </FormLabel>
      <FlavourMultiSelect
        value={selectedFlavours}
        onChange={setSelectedFlavours}
      />

      {/* Checkbox group for Tags */}
      <FormField
        control={form.control}
        name="tagIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              {t("tagsLabel")}
            </FormLabel>
            <FormControl>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {!tags || !Array.isArray(tags) || tags.length === 0
                    ? null
                    : tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200"
                        >
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={(field.value || []).includes(tag.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = Array.isArray(field.value)
                                ? field.value
                                : [];
                              if (checked) {
                                field.onChange([...currentValues, tag.id]);
                              } else {
                                field.onChange(
                                  currentValues.filter((id) => id !== tag.id)
                                );
                              }
                            }}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <label
                            htmlFor={`tag-${tag.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 hover:text-blue-600 transition-colors duration-200"
                          >
                            {isRTL ? tag.nameAR : tag.nameEN}
                            {tag.emoji}
                          </label>
                        </div>
                      ))}
                </div>
                {(!tags || tags.length === 0) && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {t("noTagsAvailable") || "No tags available"}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Checkbox group for Notices */}
      <FormField
        control={form.control}
        name="noticeIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              {t("noticesLabel")}
            </FormLabel>
            <FormControl>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {!notices || !Array.isArray(notices) || notices.length === 0
                    ? null
                    : notices.map((notice) => (
                        <div
                          key={notice.id}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200"
                        >
                          <Checkbox
                            id={`notice-${notice.id}`}
                            checked={(field.value || []).includes(notice.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = Array.isArray(field.value)
                                ? field.value
                                : [];
                              if (checked) {
                                field.onChange([...currentValues, notice.id]);
                              } else {
                                field.onChange(
                                  currentValues.filter((id) => id !== notice.id)
                                );
                              }
                            }}
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <label
                            htmlFor={`notice-${notice.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 hover:text-green-600 transition-colors duration-200"
                          >
                            {isRTL ? notice.nameAR : notice.nameEN}
                            {notice.emoji}
                          </label>
                        </div>
                      ))}
                </div>
                {(!notices || notices.length === 0) && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {t("noNoticesAvailable") || "No notices available"}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Toggles */}
      <FormField
        control={form.control}
        name="isSoldByWeight"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormLabel>{t("isSoldByWeight")}</FormLabel>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isSellByCustomValue"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormLabel>{t("isSellByCustomValue")}</FormLabel>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Always register customValue, but only show input if enabled */}
      <div style={{ display: isSellByCustomValue ? "block" : "none" }}>
        <FormField
          control={form.control}
          name="customValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customValue")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  placeholder={t("enterCustomValue")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="isMaximumAmountForUser"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4">
            <FormLabel>{t("hasMaximumAmountForUser")}</FormLabel>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Always register maximumAmountForUser, but only show input if enabled */}
      <div style={{ display: isMaximumAmountForUser ? "block" : "none" }}>
        <FormField
          control={form.control}
          name="maximumAmountForUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("hasMaximumAmountForUser")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  placeholder={t("enterMaximumAmountToSale")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default WholeSaleProductFormFields;
