import React, { useState } from "react";
import { Company } from "@/types/company";
import { BaseTable, TableColumn, formatDate } from "@/components/ui/base-table";
import { useTranslation } from "react-i18next";
import CompanyImageUploadDialog from "./CompanyImageUploadDialog";
import { getImageUrl } from "@/lib/utils";
import CompanyDetailsDialog from "./CompanyDetailsDialog";
import CompanyBannerUploadDialog from "./CompanyBannerUploadDialog";

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onReload?: () => void; // Add optional callback
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  isLoading,
  onEdit,
  onDelete,
  onReload,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<
    number | null
  >(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [selectedBannerCompanyId, setSelectedBannerCompanyId] = useState<
    number | null
  >(null);

  const openDialog = (company: Company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCompany(null);
  };
  const columns: TableColumn<Company>[] = [
    {
      key: "company",
      header: t("company"),
      className: isRTL ? "text-right" : "text-left",
      cell: (company) => (
        <div className={`d-flex align-items-center`}>
          <div className="symbol symbol-50px me-5">
            <img src={company.imageUrl} alt="" />
          </div>
          <div className="d-flex flex-column">
            <a
              href="#"
              className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
            >
              {company.nameEn}
            </a>

            <span className="text-gray-500 fw-semibold d-block fs-8">
              {t("id")}: #{company.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "nameAR",
      header: t("nameAR"),
      cell: (company) => company.nameAr,
      className: isRTL ? "text-right" : "text-left",
    },
    {
      key: "noteEN",
      header: t("noteEN"),
      cell: (company) => company.noteEN,
      className: isRTL ? "text-right" : "text-left",
    },
    {
      key: "noteAR",
      header: t("noteAR"),
      cell: (company) => company.noteAR,
      className: isRTL ? "text-right" : "text-left",
    },

    {
      key: "actions",
      header: t("actions"),
      cell: (company) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => openDialog(company)}
            className="btn btn-icon btn-sm btn-light-info"
            title={t("details")}
          >
            <i className="ki-duotone ki-eye fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>{" "}
          </button>
          <button
            onClick={() => {
              setSelectedCompanyId(company.id);
              setImageDialogOpen(true);
            }}
            className="btn btn-icon btn-sm btn-light-info"
            title={t("uploadImage")}
          >
            <i className="ki-duotone ki-switch fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
          <button
            onClick={() => {
              setSelectedBannerCompanyId(company.id);
              setBannerDialogOpen(true);
            }}
            className="btn btn-icon btn-sm btn-light-primary"
            title={t("uploadBanners")}
          >
            <i className="ki-duotone ki-switch fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
            </i>
          </button>
          <button
            onClick={() => onEdit(company.id)}
            className="btn btn-icon btn-sm btn-light-warning"
            title={t("edit")}
          >
            <i className="ki-duotone ki-pencil fs-2">
              {" "}
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
          <button
            onClick={() => onDelete(company.id)}
            className="btn btn-icon btn-sm btn-light-danger"
            title={t("delete")}
          >
            <i className="ki-duotone ki-trash fs-2">
              {" "}
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </button>
        </div>
      ),
      className: `${isRTL ? "text-right" : "text-left"} w-32`,
    },
  ];

  return (
    <>
      <BaseTable
        data={companies}
        columns={columns}
        isLoading={isLoading}
        getItemId={(company) => company.id}
      />
      <CompanyImageUploadDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        companyId={selectedCompanyId || 0}
        onUploadSuccess={() => {
          setImageDialogOpen(false);
          if (onReload) onReload(); // <-- reload companies here
        }}
      />
      <CompanyBannerUploadDialog
        open={bannerDialogOpen}
        onClose={() => setBannerDialogOpen(false)}
        companyId={selectedBannerCompanyId || 0}
        onUploadSuccess={() => {
          setBannerDialogOpen(false);
          if (onReload) onReload(); // <-- reload companies here too
        }}
      />
      <CompanyDetailsDialog
        company={selectedCompany}
        isOpen={dialogOpen}
        onClose={closeDialog}
      />
    </>
  );
};

export default CompanyTable;
