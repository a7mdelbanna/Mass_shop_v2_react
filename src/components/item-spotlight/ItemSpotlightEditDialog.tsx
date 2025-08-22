import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { fetchItemUnits } from '@/services/item-unit-service';
import { ItemUnit } from '@/types/item-unit';
import { sweetAlert } from '@/utils/alert';

interface SpotlightItemEdit {
  id: number;
  item: { id: number; nameEN: string; bigUnit?: any; smallUnit?: any };
  itemUnit: { id: number; nameEN: string };
  itemId: number;
  itemBasicPrice: number;
  itemPrice: number;
  discountValue: number;
  discountPercent: number;
  spotlightAllId?: number;
  spotlightAll?: any;
}

interface ItemSpotlightEditDialogProps {
  open: boolean;
  onClose: () => void;
  item: SpotlightItemEdit | null;
  onSave: (item: SpotlightItemEdit) => void;
}

const ItemSpotlightEditDialog: React.FC<ItemSpotlightEditDialogProps> = ({ open, onClose, item, onSave }) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState<SpotlightItemEdit | null>(item);

  // Build units from the selected item's product (bigUnit, smallUnit)
  const units = React.useMemo(() => {
    if (!item?.item) return [];
    const arr = [];
    if (item.item.bigUnit) arr.push(item.item.bigUnit);
    if (item.item.smallUnit) arr.push(item.item.smallUnit);
    return arr;
  }, [item]);

  React.useEffect(() => {
    setForm(item);
  }, [item, open]);

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editItem')}</DialogTitle>
          <DialogDescription>{t('editProductAndDiscountForSpotlight')}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
          
            // Only send IDs, not full objects
            const updatedForm = form
              ? {
                  ...form,
                  itemId: form.item?.id,
                  spotlightAllId: (form as any).spotlightAllId || undefined,
                  item: undefined,
                  itemUnit: undefined,
                  spotlightlightAll: undefined
                }
              : form;
            onSave(updatedForm);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('product')}</label>
            <Input value={form.item?.nameEN} disabled className="w-full" />
          </div>
         
              
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('itemBasicPrice')}</label>
            <Input
              type="number"
              value={form.itemBasicPrice}
              onChange={e => setForm(f => f ? { ...f, itemBasicPrice: Number(e.target.value) } : f)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('itemPrice')}</label>
            <Input
              type="number"
              value={form.itemPrice}
              onChange={e => setForm(f => f ? { ...f, itemPrice: Number(e.target.value) } : f)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('discountValue')}</label>
            <Input
              type="number"
              value={form.discountValue}
              onChange={e => setForm(f => f ? { ...f, discountValue: Number(e.target.value) } : f)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('discountPercent')}</label>
            <Input
              type="number"
              value={form.discountPercent}
              onChange={e => setForm(f => f ? { ...f, discountPercent: Number(e.target.value) } : f)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
            <Button type="submit" className="btn btn-primary">{t('save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSpotlightEditDialog; 