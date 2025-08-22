import React from "react";
import { Company } from "@/types/company";
import { useTranslation } from "react-i18next";

interface CompanyDetailsDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyDetailsDialog: React.FC<CompanyDetailsDialogProps> = ({
  company,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !company) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        <h2 className="text-xl font-semibold mb-4">{t("companyDetails")}</h2>
        <div className="flex justify-center mb-4 gap-8">
          {company.imageUrl && (
            <div className="flex flex-col items-center">
              <img
                src={company.imageUrl}
                alt=""
                className="max-h-40 rounded shadow"
              />
              <span className="mt-1 text-xs text-gray-600">
                {t("image")}
              </span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <strong>{t("companyNameEN")}:</strong> {company.nameEn}
        </div>

        <div className="mb-4">
          <strong>{t("companyNameAR")}:</strong> {company.nameAr}
        </div>

        <div className="mb-4">
          <strong>{t("noteEN")}:</strong> {company.noteEN || t("none")}
        </div>

        <div className="mb-4">
          <strong>{t("noteAR")}:</strong> {company.noteAR || t("none")}
        </div>

        

        <div className="mb-4">
          <strong>{t("categories")}:</strong>
          {company.categories && company.categories.length > 0 ? (
            <ul className="list-disc ml-5 mt-2 max-h-40 overflow-auto">
              {company.categories.map((cat) => (
                <li key={cat.id}>
                  {cat.nameEN} / {cat.nameAR}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t("noCategories")}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsDialog;
