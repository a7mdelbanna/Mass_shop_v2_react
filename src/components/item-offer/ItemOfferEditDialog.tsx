import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { FullProduct } from '@/types/product';
import { ItemUnit } from '@/types/item-unit';
import { getProductById } from '@/services/product-service';

interface ProductUnit {
  id: number;
  nameEN: string;
}

interface OfferItemEdit {
  id: number;
  item: FullProduct,
  itemUnit: ProductUnit,
  itemId: number;
  itemUnitId :number;
  NameEN: string;
  itemBasicPrice: number;
  itemPrice: number;
  discountValue: number;
  discountPercent: number;
}

interface ItemOfferEditDialogProps {
  open: boolean;
  onClose: () => void;
  item: OfferItemEdit | null;
  onSave: (item: OfferItemEdit) => void;
}


const ItemOfferEditDialog: React.FC<ItemOfferEditDialogProps> = ({ open, onClose, item, onSave }) => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState<OfferItemEdit | null>(item);
  const [units, setUnits] = React.useState<ProductUnit[]>([]);

  React.useEffect(() => {
    if (item) {
      setForm({
        ...item,
        itemUnitId: item.itemUnitId || item.itemUnit?.id || (units && units[0]?.id) || 0,
        itemUnit: item.itemUnit || (units && units[0]) || undefined,
      });
    }
  }, [item, open, units]);

  React.useEffect(() => {
    if (item?.item?.id) {
      getProductById(item.item.id).then(product => {
        const arr = [];
        if (product.bigUnit) arr.push({ id: product.bigUnit.id, nameEN: product.bigUnit.nameEN });
        if (product.smallUnit) arr.push({ id: product.smallUnit.id, nameEN: product.smallUnit.nameEN });
        setUnits(arr);
      });
    } else {
      setUnits([]);
    }
  }, [item, open]);

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editItem')}</DialogTitle>
          <DialogDescription>{t('editProductAndDiscountForOffer')}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            const updatedForm = form ? { ...form, itemId: form.item?.id, itemUnitId: form.itemUnitId } : form;
            onSave(updatedForm);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('product')}</label>
            <Input value={form.item?.nameEN} disabled className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">{t('unit')}</label>
            <Select
              value={form.itemUnitId ? String(form.itemUnitId) : (units[0]?.id ? String(units[0].id) : '')}
              onValueChange={val => {
                const unit = units.find(u => u.id === Number(val));
                setForm(f => f
                  ? {
                      ...f,
                      itemUnit: unit || f.itemUnit,
                      itemUnitId: Number(val)
                    }
                  : f
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('unit')} />
              </SelectTrigger>
              <SelectContent>
                {units.map(u => (
                  <SelectItem key={u.id} value={String(u.id)}>{u.nameEN}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

export default ItemOfferEditDialog; 