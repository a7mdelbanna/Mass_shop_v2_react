import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { ItemSpotlightDetailsForCreateUpdateDto } from "@/types/spotlight";
import { createItemSpotlightDetail } from "@/services/spotlight-service";
import { FullProduct } from "@/types/product";
import { fetchProducts } from "@/services/product-service";
import { fetchCategories } from "@/services/category-service";
import { fetchCompanies } from "@/services/company-service";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface Product {
  id: number;
  nameEN: string;
  bigUnitPrice?: number;
  bigUnitSpecialPrice?: number;
  smallUnitPrice?: number;
  smallUnitSpecialPrice?: number;
  bigUnit?: { id: number; nameEN: string };
  smallUnit?: { id: number; nameEN: string };
}

interface ItemSpotlightDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  spotlight: { id: number; titleEN: string };
  onSave: (items: ItemSpotlightDetailsForCreateUpdateDto[]) => void;
}

const ProductCombobox = ({
  products,
  onAdd,
  spotlightId,
  onSearch,
  searchTerm,
  isSearching,
  categories,
  companies,
  selectedCategoryId,
  selectedCompanyId,
  onCategoryChange,
  onCompanyChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeCompanies = Array.isArray(companies) ? companies : [];
  const [selected, setSelected] = React.useState<any | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<number | null>(
    null
  );
  const [discountValue, setDiscountValue] = React.useState("");
  const [discountPercent, setDiscountPercent] = React.useState("");
  const [itemPrice, setItemPrice] = React.useState("");
  const [itemBasicPrice, setItemBasicPrice] = React.useState("");
  const [itemAmount, setItemAmount] = React.useState("");

  // Build units array from product
  const units = React.useMemo(() => {
    if (!selected) return [];
    if (selected.units && Array.isArray(selected.units)) {
      return selected.units;
    }
    const arr = [];
    if (selected.bigUnit)
      arr.push({
        id: selected.bigUnit.id,
        nameEN: selected.bigUnit.nameEN,
        nameAR: selected.bigUnit.nameAR,
        type: "big",
        price: selected.bigUnitPrice,
        specialPrice: selected.bigUnitSpecialPrice,
      });
    if (selected.smallUnit)
      arr.push({
        id: selected.smallUnit.id,
        nameEN: selected.smallUnit.nameEN,
        nameAR: selected.smallUnit.nameAR,
        type: "small",
        price: selected.smallUnitPrice,
        specialPrice: selected.smallUnitSpecialPrice,
      });
    return arr;
  }, [selected]);

  // When product or unit changes, update price fields
  React.useEffect(() => {
    if (selected && selectedUnitId) {
      const unit = units.find((u) => u.id === selectedUnitId);
      setItemBasicPrice(unit?.price ?? "");
      setItemPrice(unit?.specialPrice ?? "");
    } else {
      setItemBasicPrice("");
      setItemPrice("");
    }
  }, [selected, selectedUnitId, units]);

  // Reset unit when product changes
  React.useEffect(() => {
    if (units.length > 0) {
      setSelectedUnitId(units[0].id);
    } else {
      setSelectedUnitId(null);
    }
  }, [units]);

  return (
    <div className="rounded-lg bg-gray-50 p-4 shadow-sm border mb-4">
        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t("searchProducts")}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("search")}
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className={`pl-10 ${isRTL ? "pr-10 text-right" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            />
            {searchTerm && (
              <button
                onClick={() => onSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      {/* Loading Indicator */}
      {isSearching && (
        <div className="mb-4 text-sm text-blue-600">
          {t("loadingProducts")}...
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 items-end w-full">
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("product")}
          </label>
          <Select
            value={selected?.id ? String(selected.id) : ""}
            onValueChange={(val) => {
              const prod = safeProducts.find((p) => p.id === Number(val));
              setSelected(prod || null);
            }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <SelectTrigger className={isRTL ? "text-right" : ""}>
              <SelectValue placeholder={t("selectProduct")} />
            </SelectTrigger>
            <SelectContent
              className={isRTL ? "text-right" : ""}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {safeProducts.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {isRTL ? p.nameAR : p.nameEN}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("itemAmount")}
          </label>
          <Input
            type="number"
            placeholder={t("itemAmount")}
            value={itemAmount}
            onChange={(e) => setItemAmount(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("itemBasicPrice")}
          </label>
          <Input
            type="number"
            placeholder={t("itemBasicPrice")}
            value={itemBasicPrice}
            onChange={(e) => setItemBasicPrice(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("itemPrice")}
          </label>
          <Input
            type="number"
            placeholder={t("itemPrice")}
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("discountValue")}
          </label>
          <Input
            type="number"
            placeholder={t("discountValue")}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {t("discountPercent")}
          </label>
          <Input
            type="number"
            placeholder={t("discountPercent")}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>
        <div className="col-span-3 flex items-end">
          <Button
            type="button"
            className="btn btn-primary w-full bg-primary-600 hover:bg-primary-700 text-white transition"
            onClick={() => {
              if (selected && selected.id && selectedUnitId) {
                const unit = units.find((u) => u.id === selectedUnitId);
                onAdd({
                  itemAmount: itemAmount ? Number(itemAmount) : undefined,
                  itemBasicPrice: itemBasicPrice
                    ? Number(itemBasicPrice)
                    : undefined,
                  itemPrice: itemPrice ? Number(itemPrice) : undefined,
                  discountValue: discountValue
                    ? Number(discountValue)
                    : undefined,
                  discountPercent: discountPercent
                    ? Number(discountPercent)
                    : undefined,
                  spotlightAllId: spotlightId,
                  itemId: selected.id,
                });
                setSelected(null);
                setSelectedUnitId(null);
                setItemAmount("");
                setDiscountValue("");
                setDiscountPercent("");
                setItemBasicPrice("");
                setItemPrice("");
              }
            }}
          >
            {t("add")}
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
        <span>{t("addProductToSpotlightHelp")}</span>
      </div>
    </div>
  );
};

const ItemSpotlightDetailsDialog: React.FC<ItemSpotlightDetailsDialogProps> = ({
  open,
  onClose,
  spotlight,
  onSave,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [items, setItems] = React.useState<
    ItemSpotlightDetailsForCreateUpdateDto[]
  >([]);
  const [products, setProducts] = React.useState<FullProduct[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("ALL");
  const [selectedCompanyId, setSelectedCompanyId] =
    React.useState<string>("ALL");
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounced search function
  const debounceRef = React.useRef<NodeJS.Timeout>();

  const performSearch = React.useCallback(
    (term: string, categoryId: string, companyId: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setIsSearching(true);
        fetchProducts({
          page: 1,
          pageSize: 1000,
          searchTerm: term || undefined,
          itemCategoryId:
            categoryId && categoryId !== "ALL" ? Number(categoryId) : undefined,
          companyId:
            companyId && companyId !== "ALL" ? Number(companyId) : undefined,
        })
          .then((res) => setProducts(res.data || []))
          .catch(() => setProducts([]))
          .finally(() => setIsSearching(false));
      }, 500);
    },
    []
  );

  const handleSearch = React.useCallback(
    (term: string) => {
      setSearchTerm(term);
      performSearch(term, selectedCategoryId, selectedCompanyId);
    },
    [selectedCategoryId, selectedCompanyId, performSearch]
  );

  const handleCategoryChange = React.useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      performSearch(searchTerm, categoryId, selectedCompanyId);
    },
    [searchTerm, selectedCompanyId, performSearch]
  );

  const handleCompanyChange = React.useCallback(
    (companyId: string) => {
      setSelectedCompanyId(companyId);
      performSearch(searchTerm, selectedCategoryId, companyId);
    },
    [searchTerm, selectedCategoryId, performSearch]
  );

  React.useEffect(() => {
    if (open) {
      setLoadingProducts(true);
      setSearchTerm("");
      setSelectedCategoryId("ALL");
      setSelectedCompanyId("ALL");

      // Load initial data
      Promise.all([
        fetchProducts({ page: 1, pageSize: 1000 }),
        fetchCategories().catch(() => []),
        fetchCompanies().catch(() => []),
      ])
        .then(([productsRes, categoriesRes, companiesRes]) => {
          setProducts(productsRes.data || []);
          setCategories(categoriesRes || []);
          setCompanies(companiesRes || []);
        })
        .catch(() => {
          setProducts([]);
          setCategories([]);
          setCompanies([]);
        })
        .finally(() => setLoadingProducts(false));
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [open]);

  const handleAddItem = (item: ItemSpotlightDetailsForCreateUpdateDto) => {
    console.log(item);
    setItems((prev) => [...prev, item]);
  };
  const handleRemoveItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(items);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] my-6 p-0 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-primary-800">
            {t("addItemsToSpotlight")}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            {t("addProductsAndDiscountsToSpotlight")}:{" "}
            <span className="ml-1 font-semibold text-primary-600">
              {spotlight.titleEN}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="text-base font-semibold text-primary-700 mb-2">
                {t("addProductToSpotlight")}
              </h4>
              <ProductCombobox
                products={products}
                onAdd={handleAddItem}
                spotlightId={spotlight.id}
                onSearch={handleSearch}
                searchTerm={searchTerm}
                isSearching={isSearching}
                categories={categories}
                companies={companies}
                selectedCategoryId={selectedCategoryId}
                selectedCompanyId={selectedCompanyId}
                onCategoryChange={handleCategoryChange}
                onCompanyChange={handleCompanyChange}
              />
            </div>
            <div>
              <h4 className="text-base font-semibold text-primary-700 mb-2">
                {t("spotlightItems")}
              </h4>
              {items.length === 0 ? (
                <div className="text-gray-500 text-center py-6 border border-dashed border-gray-300 rounded-lg">
                  {t("noItemsAddedYet")}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table
                    className={`w-full text-sm text-${
                      isRTL ? "right" : "left"
                    } border-collapse`}
                  >
                    <thead className="bg-primary-50 text-primary-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-center">
                          {t("item")}
                        </th>
                        <th className="px-4 py-3 font-semibold text-center">
                          {t("itemAmount")}
                        </th>
                        <th className="px-4 py-3 font-semibold text-center">
                          {t("itemBasicPrice")}
                        </th>
                        <th className="px-4 py-3 font-semibold text-center">
                          {t("itemPrice")}
                        </th>
                        <th className="px-4 py-3 font-semibold text-center">
                          {t("discountValue")}
                        </th>
                        <th className="px-4 py-3 font-semibold text-center">
                          {t("discountPercent")}
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          {t("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-primary-100 transition-colors"
                        >
                          <td className="px-4 py-3 text-center">
                            {products.find((p) => p.id === item.itemId)
                              ?.nameEN || item.itemId}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.itemAmount}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.itemBasicPrice}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.itemPrice}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.discountValue}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.discountPercent}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="rounded-full px-4 py-1"
                              onClick={() => handleRemoveItem(idx)}
                            >
                              {t("remove")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="rounded-md"
                onClick={onClose}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="btn btn-primary text-white"
                disabled={items.length === 0}
              >
                {t("saveItems")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSpotlightDetailsDialog;
