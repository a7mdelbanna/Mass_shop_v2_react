import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOfferDetailsWithItems,
  deleteItemOfferDetails,
  createItemOfferDetails,
  updateItemOfferDetails,
  getOfferItems,
  getItemOfferDetailsById,
  getAllItemOfferDetailsByOfferId,
} from "@/services/offer-service";
import { Offer } from "@/types/offer";
import { useTranslation } from "react-i18next";
import { sweetAlert } from "@/utils/alert";
import { Button } from "@/components/ui/button";
import { BaseTable, TableColumn } from "@/components/ui/base-table";
import ItemOfferDetailsDialog from "@/components/item-offer/ItemOfferDetailsDialog";
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
import ItemOfferEditDialog from "@/components/item-offer/ItemOfferEditDialog";
import ItemOfferBulkAddDialog from "@/components/item-offer/ItemOfferBulkAddDialog";

const OfferItemsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = React.useState(false);

  const fetchOffer = async () => {
    setIsLoading(true);
    try {
      const detailsRes = await getOfferDetailsWithItems(Number(id));
      const items = await getAllItemOfferDetailsByOfferId(Number(id));

      setOffer(detailsRes.offer);
      setItems(items.data);
    } catch {
      setOffer(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const handleDelete = async (itemId: number) => {
    setItemToDelete(items.find((i) => i.id === itemId));
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      await deleteItemOfferDetails("1", itemToDelete.id);
      sweetAlert.fire({ icon: "success", title: t("itemDeletedSuccessfully") });
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchOffer();
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

  const handleEditSave = async (updatedItem: any) => {
    setIsLoading(true);
    try {
      await updateItemOfferDetails("1", {
        ...updatedItem,
        id: updatedItem.id,
        itemOfferId: offer?.id,
      });
      setEditDialogOpen(false);
      setItemToEdit(null);
      fetchOffer();
      sweetAlert.fire({ icon: "success", title: t("itemUpdatedSuccessfully") });
    } catch {
      sweetAlert.fire({ icon: "error", title: t("failedToSaveItem") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (items: any[]) => {
    setIsLoading(true);
    try {
      if (dialogMode === "add") {
        for (const item of items) {
          await createItemOfferDetails("1", {
            ...item,
            itemOfferId: offer?.id,
          });
        }
      } else if (dialogMode === "edit" && selectedItem) {
        await updateItemOfferDetails("1", {
          ...items[0],
          id: selectedItem.id,
          itemOfferId: offer?.id,
        });
      }
      setDialogOpen(false);
      fetchOffer();
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
            onClick={() => handleDelete(item.id)}
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

  if (!isLoading && !offer) {
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
                {offer?.nameEN || t("offerItems")}
              </span>
              <span className="text-muted mt-1 fw-semibold fs-7">
                {t("manageOfferItems")}
              </span>
            </h3>
          </div>

          {/* Button Group */}
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
              data={items || []}
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
      <ItemOfferDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        offer={
          offer ? { id: offer.id, nameEN: offer.nameEN } : { id: 0, nameEN: "" }
        }
        onSave={handleSave}
        selectedItem={selectedItem}
        mode={dialogMode}
      />
      <ItemOfferEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        item={itemToEdit}
        onSave={handleEditSave}
      />
      <ItemOfferBulkAddDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        storeId={"1"}
        offerId={Number(id)}
        onSuccess={() => {
          fetchOffer();
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

export default OfferItemsPage;
