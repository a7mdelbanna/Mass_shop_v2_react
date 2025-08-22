import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getItemSpotlightAllById,
  getItemSpotlightDetailsBySpotlightAllId,
  deleteItemSpotlightDetail,
  createItemSpotlightDetail,
  updateItemSpotlightDetail,
} from "@/services/spotlight-service";
import { useTranslation } from "react-i18next";
import { sweetAlert } from "@/utils/alert";
import { Button } from "@/components/ui/button";
import { BaseTable, TableColumn } from "@/components/ui/base-table";
import ItemSpotlightDetailsDialog from "@/components/item-spotlight/ItemSpotlightDetailsDialog";
import ItemSpotlightEditDialog from "@/components/item-spotlight/ItemSpotlightEditDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import ItemSpotlightBulkAddDialog from "@/components/item-spotlight/ItemSpotlightBulkAddDialog";

const SpotlightItemsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const [spotlight, setSpotlight] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  const fetchSpotlight = async () => {
    setIsLoading(true);
    try {
      const detailsRes = await getItemSpotlightAllById(Number(id));
      const itemsRes = await getItemSpotlightDetailsBySpotlightAllId(
        Number(id)
      );
      setSpotlight(detailsRes.data);
      setItems(itemsRes.data || []);
    } catch {
      setSpotlight(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotlight();
  }, [id]);

  const handleDelete = (itemId: number) => {
  setItemToDelete(items.find((i) => i.item.id === itemId));
  setDeleteDialogOpen(true);
};

const confirmDelete = async () => {
  if (!itemToDelete) return;
  setIsLoading(true);
  try {
    await deleteItemSpotlightDetail(Number(id), itemToDelete.item.id);
    sweetAlert.fire({ icon: "success", title: t("itemDeletedSuccessfully") });
    setItems((prev) => prev.filter((i) => i.item.id !== itemToDelete.item.id));
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    fetchSpotlight();
  } catch {
    sweetAlert.fire({ icon: "error", title: t("failedToDeleteItem") });
  } finally {
    setIsLoading(false);
  }
};

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setItemToEdit(item);
    setEditDialogOpen(true);
  };

  const handleSave = async (items: any[]) => {
    setIsLoading(true);
    try {
      if (dialogMode === "add") {
        for (const item of items) {
          await createItemSpotlightDetail({
            ...item,
            spotlightAllId: spotlight?.id,
          });
        }
      } else if (dialogMode === "edit" && selectedItem) {
        await updateItemSpotlightDetail({
          ...items[0],
          id: selectedItem.id,
          spotlightAllId: spotlight?.id,
        });
      }
      setDialogOpen(false);
      fetchSpotlight();
    } catch {
      sweetAlert.fire({ icon: "error", title: t("failedToSaveItem") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSave = async (updatedItem: any) => {
    setIsLoading(true);
    try {
      await updateItemSpotlightDetail({
        ...updatedItem,
        id: updatedItem.id,
        spotlightAllId: spotlight?.id,
      });
      setEditDialogOpen(false);
      setItemToEdit(null);
      fetchSpotlight();
      sweetAlert.fire({ icon: "success", title: t("itemUpdatedSuccessfully") });
    } catch {
      sweetAlert.fire({ icon: "error", title: t("failedToSaveItem") });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: TableColumn<any>[] = [
    {
      key: "itemId",
      header: t("itemId"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => `#${item.item?.id}`,
    },
    {
      key: "itemName",
      header: t("itemName"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => item.item?.nameEN,
    },
    {
      key: "itemAmount",
      header: t("itemAmount"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => item.itemAmount,
    },
    {
      key: "itemBasicPrice",
      header: t("itemBasicPrice"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => item.itemBasicPrice,
    },
    {
      key: "itemPrice",
      header: t("itemPrice"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => item.itemPrice,
    },
    {
      key: "discountValue",
      header: t("discountValue"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => item.discountValue,
    },
    {
      key: "discountPercent",
      header: t("discountPercent"),
      className: isRTL ? "text-right" : "text-left",
      cell: (item) => item.discountPercent,
    },
    {
      key: "actions",
      header: t("actions"),
      className: `${isRTL ? "text-right" : "text-left"} w-32`,
      cell: (item) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="btn btn-icon btn-sm btn-light-warning"
            onClick={() => handleEdit(item)}
          >
            <i className="ki-duotone ki-pencil fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="btn btn-icon btn-sm btn-light-danger"
            onClick={() => handleDelete(item.item.id)}
          >
            <i className="ki-duotone ki-trash fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
          </Button>
        </div>
      ),
    },
  ];

  if (!isLoading && !spotlight) {
    return (
      <div className="container mx-auto py-6">
        <div className="alert alert-danger">{t("notFound")}</div>
        <Button className="btn btn-info" onClick={() => navigate(-1)}>
          {t("back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="card mb-xl-8">
        <div className="card-header border-0 pt-5 flex justify-between items-center">
          <div>
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                {spotlight?.titleEN || t("spotlightItems")}
              </span>
              <span className="text-muted mt-1 fw-semibold fs-7">
                {t("manageSpotlightItems")}
              </span>
            </h3>
          </div>
          <div className="flex gap-2">
            <Button className="btn btn-primary" onClick={handleAdd}>
              + {t("addItem")}
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => setBulkDialogOpen(true)}
            >
              + {t("addItems")}
            </Button>
          </div>
        </div>
        <div className="card-body pt-3">
          <div className="table-responsive">
            <BaseTable
              data={items}
              columns={columns}
              isLoading={isLoading}
              getItemId={(item) => item.id}
            />
          </div>
        </div>
      </div>
      <Button className="btn btn-info" onClick={() => navigate(-1)}>
        {t("back")}
      </Button>
      <ItemSpotlightDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        spotlight={
          spotlight
            ? { id: spotlight.id, titleEN: spotlight.titleEN }
            : { id: 0, titleEN: "" }
        }
        onSave={handleSave}
      />
      <ItemSpotlightEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={itemToEdit}
        onSave={handleEditSave}
      />
      <ItemSpotlightBulkAddDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        storeId={"1"}
        spotlightId={Number(id)}
        onSuccess={() => {
          fetchSpotlight();
          setBulkDialogOpen(false);
        }}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("areYouSureDeleteItem")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpotlightItemsPage;
