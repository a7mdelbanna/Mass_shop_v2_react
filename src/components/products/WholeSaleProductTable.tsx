import React, { useState } from "react";
import { FullProduct } from "@/types/product";
import { BaseTable, TableColumn } from "@/components/ui/base-table";
import { Button } from "../ui/button";
import { uploadProductImage, getProductById } from "@/services/product-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/services/auth-service";
import { API_BASE_URL } from "@/config/api";
import { sweetAlert } from "@/utils/alert";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { getImageUrl } from "@/lib/utils";

interface ProductTableProps {
  products: FullProduct[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onImageUploaded?: () => void;
}

const WholeSaleProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onImageUploaded,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [flavourPreviews, setFlavourPreviews] = useState<
    Record<number, string>
  >({});
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<FullProduct | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [bigUnitImageFile, setBigUnitImageFile] = React.useState<File | null>(
    null
  );
  const [uploading, setUploading] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [viewedProduct, setViewedProduct] = React.useState<FullProduct | null>(
    null
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadFlavourImage = async (
    itemId: number,
    flavourId: number,
    file: File
  ) => {
    const formData = new FormData();
    formData.append("ItemId", itemId.toString());
    formData.append("FlavourId", flavourId.toString());
    formData.append("Image", file);

    const response = await fetch(
      `${API_BASE_URL}/Item/UploadImageForFlavour/1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      sweetAlert.fire({
        icon: "error",
        title: "Flavour image upload failed",
        text: errorText,
      });
      return;
    }

    sweetAlert.fire({
      icon: "success",
      title: "Flavour image uploaded successfully",
    });
    if (onImageUploaded) onImageUploaded();
  };

  const handleView = async (id: number) => {
    const product = await getProductById(id);
    setViewedProduct(product);
    setViewDialogOpen(true);
  };

  // Import Excel handler
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      // Log the parsed data for now
      console.log("Parsed Excel Products:", json);
      // TODO: Send json to backend for bulk import
    };
    reader.readAsBinaryString(file);
  };

  const columns: TableColumn<FullProduct>[] = [
    {
      key: "product",
      header: t("product"),
      className: isRTL ? "text-right" : "text-left",
      cell: (product) => (
        <div className={`d-flex align-items-center`}>
          <div className="symbol symbol-50px me-5">
            <img
              src={
                (product.itemImageForBigUnitUrl && product.itemImageForBigUnitUrl.trim() !== "") 
                  ? product.itemImageForBigUnitUrl 
                  : product.itemImageForSmallUnitUrl
              }
              alt=""
            />
          </div>
          <div className="d-flex flex-column">
            <a
              href="#"
              className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
            >
              {product.nameEN}
            </a>
            <a
              href="#"
              className="text-gray-700 fw-semibold text-hover-primary mb-1 fs-7"
            >
              {product.nameAR}
            </a>
            <span className="text-muted fw-semibold d-block fs-7">
              {product.descriptionEN}
            </span>
            <span className="text-gray-500 fw-semibold d-block fs-8">
              #{product.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "big unit",
      header: t("bigUnit"),
      className: isRTL ? "text-right" : "text-left",
      cell: (product) => (
        <span className="font-medium">
          {isRTL ? product.bigUnit?.nameAR : product.bigUnit?.nameEN}
        </span>
      ),
    },
    {
      key: "small unit",
      header: t("smallUnit"),
      className: isRTL ? "text-right" : "text-left",
      cell: (product) => (
        <span className="font-medium">
          {isRTL ? product.smallUnit?.nameAR : product.smallUnit?.nameEN}
        </span>
      ),
    },
    {
      key: "amount",
      header: t("amount"),
      className: isRTL ? "text-right" : "text-left",
      cell: (product) => (
        <span className="font-medium">{product.itemAmount}</span>
      ),
    },
    {
      key: "category",
      header: t("category"),
      className: isRTL ? "text-right" : "text-left",
      cell: (product) => (
        <span className="badge bg-success text-white">
          {isRTL ? product.category?.nameAR : product.category?.nameEN}
        </span>
      ),
    },
    {
      key: "company",
      header: t("company"),
      className: isRTL ? "text-right" : "text-left",
      cell: (product) => (
        <span className="badge bg-info text-white">
          {isRTL ? product.company?.nameAr : product.company?.nameEn}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      cell: (product) => (
        <div className="flex justify-end gap-2">
          {/* View Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleView(product.id)}
            className="btn btn-icon btn-sm btn-light-primary"
            title={t("view")}
          >
            <i className="ki-duotone ki-eye fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>{" "}
          </Button>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(product.id)}
            className="btn btn-icon btn-sm btn-light-warning"
            title={t("edit")}
          >
            <i className="ki-duotone ki-pencil fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </Button>
          {/* Delete Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(product.id)}
            className="btn btn-icon btn-sm btn-light-danger"
            title={t("delete")}
          >
            <i className="ki-duotone ki-trash fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </Button>
          {/* Unified Upload Image Dialog Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedProduct(product);
              setImageFile(null);
              setBigUnitImageFile(null);
              setUploadDialogOpen(true);
            }}
            className="btn btn-icon btn-sm btn-light-info"
            title={t("uploadImage") + " / " + t("uploadBigUnitImage")}
          >
            <i className="ki-duotone ki-switch fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </Button>
        </div>
      ),
      className: `${isRTL ? "text-right" : "text-left"} w-32`,
    },
  ];

  return (
    <>
      {/* Import Excel Button */}
      {/*<div className="mb-4 flex justify-end">
        <button
          className="btn btn-success"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('importExcel')}
        </button>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImportExcel}
        />
      </div>*/}
      {/* Table */}
      <BaseTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        getItemId={(product) => product.id}
      />
      {/* View Product Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-2">
              {t("productDetails")}
            </DialogTitle>
          </DialogHeader>
          {viewedProduct && (
            <div className="space-y-6">
              {/* Images */}
              {(viewedProduct.itemImageForSmallUnitUrl ||
                (viewedProduct.itemImageForBigUnitUrl && viewedProduct.itemImageForBigUnitUrl.trim() !== "")) && (
                <div className="flex justify-center mb-6 gap-8">
                  {viewedProduct.itemImageForBigUnitUrl && viewedProduct.itemImageForBigUnitUrl.trim() !== "" && (
                    <div className="flex flex-col items-center">
                      <img
                        src={viewedProduct.itemImageForBigUnitUrl}
                        alt={t("bigUnitImage")}
                        className="max-h-40 rounded-lg shadow-md border border-gray-100"
                      />
                      <span className="mt-2 text-xs text-gray-500">
                        {t("bigUnitImage")}
                      </span>
                    </div>
                  )}
                  {viewedProduct.itemImageForSmallUnitUrl && (
                    <div className="flex flex-col items-center">
                      <img
                        src={viewedProduct.itemImageForSmallUnitUrl}
                        alt={t("smallUnitImage")}
                        className="max-h-40 rounded-lg shadow-md border border-gray-100"
                      />
                      <span className="mt-2 text-xs text-gray-500">
                        {t("smallUnitImage")}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                    {t("basicInfo")}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">#</span>{" "}
                    {viewedProduct.id}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("nameEN")}:
                    </span>{" "}
                    {viewedProduct.nameEN}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("nameAR")}:
                    </span>{" "}
                    {viewedProduct.nameAR}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("descriptionEN")}:
                    </span>{" "}
                    {viewedProduct.descriptionEN}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("descriptionAR")}:
                    </span>{" "}
                    {viewedProduct.descriptionAR}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("category")}:
                    </span>{" "}
                    <span className="inline-block rounded px-2 py-1 bg-yellow-100 text-yellow-800 text-xs ml-1">
                      {isRTL
                        ? viewedProduct.category?.nameAR
                        : viewedProduct.category?.nameEN}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("company")}:
                    </span>{" "}
                    <span className="inline-block rounded px-2 py-1 bg-blue-100 text-blue-800 text-xs ml-1">
                      {isRTL
                        ? viewedProduct.company?.nameAr
                        : viewedProduct.company?.nameEn}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                    {t("unitsAndPricing")}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("bigUnit")}:
                    </span>{" "}
                    {isRTL
                      ? viewedProduct.bigUnit?.nameAR
                      : viewedProduct.bigUnit?.nameEN}{" "}
                    ({viewedProduct.bigUnit?.amount})
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("smallUnit")}:
                    </span>{" "}
                    {isRTL
                      ? viewedProduct.smallUnit?.nameAR
                      : viewedProduct.smallUnit?.nameEN}{" "}
                    ({viewedProduct.smallUnit?.amount})
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("bigUnitPrice")}:
                    </span>{" "}
                    {viewedProduct.bigUnitPrice}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("bigUnitSpecialPrice")}:
                    </span>{" "}
                    {viewedProduct.bigUnitSpecialPrice}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("smallUnitPrice")}:
                    </span>{" "}
                    {viewedProduct.smallUnitPrice}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("smallUnitSpecialPrice")}:
                    </span>{" "}
                    {viewedProduct.smallUnitSpecialPrice}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("itemAmount")}:
                    </span>{" "}
                    {viewedProduct.itemAmount}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                    {t("nutritionFacts")}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("perNut")}:
                    </span>{" "}
                    {viewedProduct.per}
                    {isRTL ? "جم" : "gm"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("calories")}:
                    </span>{" "}
                    {viewedProduct.calories}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("protein")}:
                    </span>{" "}
                    {viewedProduct.protein}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("fat")}:
                    </span>{" "}
                    {viewedProduct.fat}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("carbohydrates")}:
                    </span>{" "}
                    {viewedProduct.carbohydrates}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                    {t("otherDetails")}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("taxPrcent")}:
                    </span>{" "}
                    {viewedProduct.taxPrcent}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("vatPrcent")}:
                    </span>{" "}
                    {viewedProduct.vatPrcent}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("expiration")}:
                    </span>{" "}
                    {viewedProduct.expiration} {t(viewedProduct.expirationType)}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("isSoldByWeight")}:
                    </span>{" "}
                    {viewedProduct.isSoldByWeight ? t("yes") : t("no")}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("isSellByCustomValue")}:
                    </span>{" "}
                    {viewedProduct.isSellByCustomValue ? t("yes") : t("no")}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      {t("hasMaximumAmountForUser")}:
                    </span>{" "}
                    {viewedProduct.isMaximumAmountForUser ? t("yes") : t("no")}
                  </div>
                  {viewedProduct.isMaximumAmountForUser && (
                    <div>
                      <span className="font-semibold text-gray-700">
                        {t("maximumAmountPerUser")}:
                      </span>{" "}
                      {viewedProduct.maximumAmountForUser ?? "-"}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                  {t("flavours")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewedProduct.flavours?.map((flavour) => (
                    <span
                      key={flavour.id}
                      className="inline-block rounded px-2 py-1 bg-purple-100 text-purple-800 text-xs"
                    >
                      {isRTL ? flavour.nameAR : flavour.nameEN}
                      {flavour.flavourImageURL && (
                        <div className="flex flex-col items-center">
                          <img
                            src={flavour.flavourImageURL}
                            alt={t("flavourImage")}
                            className="max-h-40 rounded-lg shadow-md border border-gray-100"
                          />
                          <span className="mt-2 text-xs text-gray-500">
                            {t("flavourImage")}
                          </span>
                        </div>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                  {t("tags")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewedProduct.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block rounded px-2 py-1 bg-blue-100 text-blue-800 text-xs"
                    >
                      {isRTL ? tag.nameAR : tag.nameEN} {tag.emoji}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-700 text-xs uppercase tracking-wider mb-1">
                  {t("notices")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewedProduct.notices?.map((notice) => (
                    <span
                      key={notice.id}
                      className="inline-block rounded px-2 py-1 bg-yellow-100 text-yellow-800 text-xs"
                    >
                      {isRTL ? notice.nameAR : notice.nameEN} {notice.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unified Upload Image Dialog for both main and big unit images */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("uploadBigUnitImage")} / {t("uploadSmallUnitImage")}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedProduct) return;
              setUploading(true);
              let success = false;
              // Upload main image if selected
              if (imageFile) {
                const formData = new FormData();
                formData.append("ItemId", selectedProduct.id.toString());
                formData.append("Image", imageFile);
                const response = await fetch(
                  `${API_BASE_URL}/Item/UploadImageForItemSmallUnit/1`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${authService.getToken()}`,
                    },
                    body: formData,
                  }
                );
                if (!response.ok) {
                  const errorText = await response.text();
                  sweetAlert.fire({
                    icon: "error",
                    title: "Upload failed",
                    text: errorText,
                  });
                  setUploading(false);
                  return;
                }
                success = true;
              }
              // Upload big unit image if selected
              if (bigUnitImageFile) {
                const formData = new FormData();
                formData.append("ItemId", selectedProduct.id.toString());
                formData.append("Image", bigUnitImageFile);
                const response = await fetch(
                  `${API_BASE_URL}/Item/UploadImageForItemBigUnit/1`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${authService.getToken()}`,
                    },
                    body: formData,
                  }
                );
                if (!response.ok) {
                  const errorText = await response.text();
                  sweetAlert.fire({
                    icon: "error",
                    title: "Big unit upload failed",
                    text: errorText,
                  });
                  setUploading(false);
                  return;
                }
                success = true;
              }
              setUploading(false);
              setUploadDialogOpen(false);
              if (success) {
                sweetAlert.fire({
                  icon: "success",
                  title: "Image(s) uploaded successfully",
                });
                if (onImageUploaded) onImageUploaded();
              }
            }}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="mt-5">
              <label>{t("bigUnitImage")}</label>
              <input
                type="file"
                name="BigUnitImage"
                accept="image/*"
                onChange={(e) =>
                  setBigUnitImageFile(e.target.files?.[0] || null)
                }
                className="input input-bordered w-full"
              />
              {bigUnitImageFile && (
                <img
                  src={URL.createObjectURL(bigUnitImageFile)}
                  alt={t("preview")}
                  className="h-24 mt-2"
                />
              )}
            </div>
            <div className="mt-3">
              <label>{t("smallUnitImage")}</label>
              <input
                type="file"
                name="Image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="input input-bordered w-full"
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt={t("preview")}
                  className="h-24 mt-2"
                />
              )}
            </div>
            {selectedProduct?.flavours?.map((flavour) => (
              <div key={flavour.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded px-2 py-1 bg-purple-100 text-purple-800 text-xs">
                    {isRTL ? flavour.nameAR : flavour.nameEN}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const previewUrl = URL.createObjectURL(file);
                      setFlavourPreviews((prev) => ({
                        ...prev,
                        [flavour.id]: previewUrl,
                      }));

                      uploadFlavourImage(selectedProduct.id, flavour.id, file);
                    }}
                  />
                </div>

                {flavourPreviews[flavour.id] && (
                  <img
                    src={flavourPreviews[flavour.id]}
                    alt={t("preview")}
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
                disabled={uploading}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={uploading || (!imageFile && !bigUnitImageFile)}
              >
                {uploading ? t("uploading") : t("upload")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WholeSaleProductTable;
