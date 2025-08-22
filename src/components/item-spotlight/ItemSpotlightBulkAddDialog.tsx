import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fetchCompanies } from "@/services/company-service";
import { fetchCategories } from "@/services/category-service";
import {
  getAllItemSpotlightAll,
  createItemSpotlightDetailsByCompany,
  createItemSpotlightDetailsByCategory,
} from "@/services/spotlight-service";
import { useTranslation } from "react-i18next";

interface ItemSpotlightBulkAddDialogProps {
  open: boolean;
  onClose: () => void;
  storeId: string;
  spotlightId: number;
  onSuccess?: () => void;
}

const ItemSpotlightBulkAddDialog: React.FC<ItemSpotlightBulkAddDialogProps> = ({
  open,
  onClose,
  storeId,
  onSuccess,
  spotlightId: propSpotlightId,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [mode, setMode] = useState<"company" | "category">("company");
  const [companies, setCompanies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [spotlights, setSpotlights] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [spotlightId, setSpotlightId] = useState<string>("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBigUnit, setIsBigUnit] = useState<boolean | null>(null);

  useEffect(() => {
    if (open) {
      fetchCompanies()
        .then(setCompanies)
        .catch(() => setCompanies([]));
      fetchCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
      getAllItemSpotlightAll()
        .then((res) => setSpotlights(res.data || res || []))
        .catch(() => setSpotlights([]));
      setCompanyId("");
      setCategoryId("");
      setSpotlightId(String(propSpotlightId));
      setDiscountValue("");
      setDiscountPercent("");
    }
  }, [open, propSpotlightId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotlightId || isBigUnit === null) return;
    setLoading(true);
    try {
      const payload = {
        discountValue: discountValue ? Number(discountValue) : undefined,
        discountPercent: discountPercent ? Number(discountPercent) : undefined,
        spotlightAllId: Number(spotlightId),
        isBigUnit: isBigUnit, // boolean
      };
      if (mode === "company") {
        await createItemSpotlightDetailsByCompany(storeId, {
          companyId: Number(companyId),
          ...payload,
        });
      } else {
        await createItemSpotlightDetailsByCategory(storeId, {
          categoryId: Number(categoryId),
          ...payload,
        });
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      // error handled in service
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("addItemsToSpotlight")}</DialogTitle>
          <DialogDescription>
            {t("bulkAddItemsToSpotlightDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as any)}
              className="flex gap-x-8 items-center"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="by-company" />
                <label
                  htmlFor="by-company"
                  className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-600"
                >
                  {t("byCompany")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="category" id="by-category" />
                <label
                  htmlFor="by-category"
                  className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-600"
                >
                  {t("byCategory")}
                </label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex justify-center">
            <RadioGroup
              value={isBigUnit === null ? "" : String(isBigUnit)}
              onValueChange={(v) => setIsBigUnit(v === "true")}
              className="flex gap-x-8 items-center"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="big-unit-yes" />
                <label
                  htmlFor="big-unit-yes"
                  className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-600"
                >
                  {t("bigUnit")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="big-unit-no" />
                <label
                  htmlFor="big-unit-no"
                  className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-600"
                >
                  {t("smallUnit")}
                </label>
              </div>
            </RadioGroup>
          </div>
          {mode === "company" ? (
            <Select
              dir={isRTL ? "rtl" : "ltr"}
              value={companyId}
              onValueChange={setCompanyId}
            >
              <SelectTrigger className={isRTL ? "text-right" : ""}>
                <SelectValue placeholder={t("selectCompany")} />
              </SelectTrigger>
              <SelectContent
                className={isRTL ? "text-right" : ""}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {" "}
                {companies.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {isRTL ? c.nameAr : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              dir={isRTL ? "rtl" : "ltr"}
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <SelectTrigger className={isRTL ? "text-right" : ""}>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent
                className={isRTL ? "text-right" : ""}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {" "}
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {isRTL ? cat.nameAR : cat.nameEN}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input
            type="number"
            placeholder={t("discountValue")}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          <Input
            type="number"
            placeholder={t("discountPercent")}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />

          <Input type="hidden" value={spotlightId} />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading || isBigUnit === null}>
              {t("addItems")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSpotlightBulkAddDialog;
