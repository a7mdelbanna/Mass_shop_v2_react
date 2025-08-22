import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { fetchProducts } from '@/services/product-service';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ItemUnit } from '@/types/item-unit';
import { Search, X } from 'lucide-react';

interface Product {
  id: number;
  nameEN: string;
  nameAR: string;
  bigUnitPrice?: number;
  bigUnitSpecialPrice?: number;
  smallUnitPrice?: number;
  smallUnitSpecialPrice?: number;
  bigUnit?: { id: number; nameEN: string ;nameAR : string};
  smallUnit?: { id: number; nameEN: string ;nameAR : string};
}

interface OfferItem {
  productId: number;
  productName: string;
  itemUnitId: number;
  itemUnitName: string;
  itemBasicPrice: number;
  itemPrice: number;
  discountValue: number;
  discountPercent: number;
}

interface ItemOfferDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  offer: { id: number; nameEN: string };
  onSave: (items: OfferItem[]) => void;
  selectedItem?: OfferItem | null;
  mode?: 'add' | 'edit';
}

const ProductCombobox = ({ products, onAdd, offer, onSearch, searchTerm, isSearching }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const safeProducts = Array.isArray(products) ? products : [];
  const [selected, setSelected] = React.useState<any | null>(null);
  const [selectedUnitId, setSelectedUnitId] = React.useState<number | null>(null);
  const [discountValue, setDiscountValue] = React.useState('');
  const [discountPercent, setDiscountPercent] = React.useState('');
  const [itemPrice, setItemPrice] = React.useState('');
  const [itemBasicPrice, setItemBasicPrice] = React.useState('');

  // Build units array from product
  const units = React.useMemo(() => {
    if (!selected) return [];
    if (selected.units && Array.isArray(selected.units)) {
      return selected.units;
    }
    const arr = [];
    if (selected.bigUnit) arr.push({
      id: selected.bigUnit.id,
      nameEN: selected.bigUnit.nameEN,
      nameAR: selected.bigUnit.nameAR,
      amount: selected.bigUnit.amount,
      type: 'big',
      price: selected.bigUnitPrice,
      specialPrice: selected.bigUnitSpecialPrice,
    });
    if (selected.smallUnit) arr.push({
      id: selected.smallUnit.id,
      nameEN: selected.smallUnit.nameEN,
      nameAR: selected.smallUnit.nameAR,
      amount: selected.smallUnit.amount,
      type: 'small',
      price: selected.smallUnitPrice,
      specialPrice: selected.smallUnitSpecialPrice,
    });
    return arr;
  }, [selected]);

  // When product or unit changes, update price fields
  React.useEffect(() => {
    if (selected && selectedUnitId) {
      const unit = units.find(u => u.id === selectedUnitId);
      setItemBasicPrice(unit?.price ?? '');
      setItemPrice(unit?.specialPrice ?? '');
    } else {
      setItemBasicPrice('');
      setItemPrice('');
    }
  }, [selected, selectedUnitId, units]);

  // Reset unit when product changes
  React.useEffect(() => {
    if (units.length > 0) {
      setSelectedUnitId(units[0].id);
    } else {
      setSelectedUnitId(null);
    }
  }, [selected]);

  return (
    <div className="rounded-lg bg-gray-50 p-4 shadow-sm border mb-4">
      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('searchProducts')}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className={`pl-10 ${isRTL ? 'pr-10 text-right' : ''}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {searchTerm && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="mt-2 text-sm text-blue-600">{t('searching')}...</div>
        )}
      </div>
      
      <div className="grid grid-cols-12 gap-4 items-end w-full">
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t('product')}</label>
          <Select value={selected?.id ? String(selected.id) : ''} onValueChange={val => {
            const prod = safeProducts.find(p => p.id === Number(val));
            setSelected(prod || null);
          }} dir={isRTL ? "rtl" : "ltr"}>
            <SelectTrigger className={isRTL ? "text-right" : ""}>
              <SelectValue placeholder={t('selectProduct')} />
            </SelectTrigger>
            <SelectContent className={isRTL ? "text-right" : ""} dir={isRTL ? "rtl" : "ltr"}>
              {safeProducts.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>{isRTL ? p.nameAR : p.nameEN}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t('unit')}</label>
          <Select value={selectedUnitId ? String(selectedUnitId) : ''} onValueChange={val => setSelectedUnitId(Number(val))} disabled={!selected} dir={isRTL ? "rtl" : "ltr"}>
            <SelectTrigger className={isRTL ? "text-right" : ""}>
              <SelectValue placeholder={t('unit')} />
            </SelectTrigger>
            <SelectContent className={isRTL ? "text-right" : ""} dir={isRTL ? "rtl" : "ltr"}>
              {units.map(u => (
                <SelectItem key={u.id} value={String(u.id)}>{isRTL ? u.nameAR : u.nameEN}({u.amount})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t('itemBasicPrice')}</label>
          <Input
            type="number"
            placeholder={t('itemBasicPrice')}
            value={itemBasicPrice}
            onChange={e => setItemBasicPrice(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t('itemPrice')}</label>
          <Input
            type="number"
            placeholder={t('itemPrice')}
            value={itemPrice}
            onChange={e => setItemPrice(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t('discountValueOpt')}</label>
          <Input
            type="number"
            placeholder={t('discountValue')}
            value={discountValue}
            onChange={e => setDiscountValue(e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">{t('discountPercentOpt')}</label>
          <Input
            type="number"
            placeholder={t('discountPercent')}
            value={discountPercent}
            onChange={e => setDiscountPercent(e.target.value)}
          />
        </div>
        <div className="col-span-3 flex items-end">
          <Button
            type="button"
            className="btn btn-primary w-full bg-primary-600 hover:bg-primary-700 text-white transition"
            onClick={() => {
              if (selected && selected.id && selectedUnitId) {
                const unit = units.find(u => u.id === selectedUnitId);
                onAdd({
                  itemBasicPrice: itemBasicPrice ? Number(itemBasicPrice) : 0,
                  itemPrice: itemPrice ? Number(itemPrice) : 0,
                  discountValue: discountValue ? Number(discountValue) : 0,
                  discountPercent: discountPercent ? Number(discountPercent) : 0,
                  itemUnitId: selectedUnitId,
                  itemId: selected.id,
                  itemOfferId: offer?.id,
                  productName: selected.nameEN,
                  itemUnitName: unit?.nameEN ?? '',
                });
                setSelected(null);
                setSelectedUnitId(null);
                setDiscountValue('');
                setDiscountPercent('');
                setItemBasicPrice('');
                setItemPrice('');
              }
            }}
          >
            {t('add')}
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
        <span>{t('addProductToOfferHelp')}</span>
      </div>
    </div>
  );
};

const ItemOfferDetailsDialog: React.FC<ItemOfferDetailsDialogProps> = ({ open, onClose, offer, onSave, selectedItem, mode = 'add' }) => {
  const { t } = useTranslation();
  const [items, setItems] = React.useState<OfferItem[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounced search function
  const debounceRef = React.useRef<NodeJS.Timeout>();
  
  const handleSearch = React.useCallback((term: string) => {
    setSearchTerm(term);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      fetchProducts({ 
        page: 1, 
        pageSize: 1000,
        searchTerm: term || undefined
      })
        .then(res => setProducts(res.data || []))
        .catch(() => setProducts([]))
        .finally(() => setIsSearching(false));
    }, 500);
  }, []);

  React.useEffect(() => {
    if (open) {
      setLoadingProducts(true);
      setSearchTerm('');
      fetchProducts({ page: 1, pageSize: 1000 })
        .then(res => setProducts(res.data || []))
        .catch(() => setProducts([]))
        .finally(() => setLoadingProducts(false));
      if (mode === 'edit' && selectedItem) {
        setItems([selectedItem]);
      } else {
        setItems([]);
      }
    }
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [open, mode, selectedItem]);

  const handleAddItem = (item: OfferItem) => {
    setItems(prev => [...prev, item]);
  };
  const handleRemoveItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(items);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] my-6 p-0 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-primary-800">
            {mode === 'edit' ? t('editItem') : t('addItemsToOffer')}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            {mode === 'edit' ? t('editProductAndDiscountForOffer') : t('addProductsAndDiscountsToOffer')}:
            <span className="ml-1 font-semibold text-primary-600">{offer.nameEN}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Add product */}
            {mode === 'add' && (
              <div>
                <h4 className="text-base font-semibold text-primary-700 mb-2">{t('addProductToOffer')}</h4>
                <ProductCombobox 
                  products={products} 
                  onAdd={handleAddItem} 
                  offer={offer}
                  onSearch={handleSearch}
                  searchTerm={searchTerm}
                  isSearching={isSearching}
                />
              </div>
            )}
            {/* Offer items table */}
            <div>
              <h4 className="text-base font-semibold text-primary-700 mb-2">{t('offerItems')}</h4>
              {items.length === 0 ? (
                <div className="text-gray-500 text-center py-6 border border-dashed border-gray-300 rounded-lg">
                  {t('noItemsAddedYet')}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-primary-50 text-primary-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 font-semibold">{t('product')}</th>
                        <th className="px-4 py-3 font-semibold">{t('unit')}</th>
                        <th className="px-4 py-3 font-semibold">{t('itemBasicPrice')}</th>
                        <th className="px-4 py-3 font-semibold">{t('itemPrice')}</th>
                        <th className="px-4 py-3 font-semibold">{t('discountValue')}</th>
                        <th className="px-4 py-3 font-semibold">{t('discountPercent')}</th>
                        <th className="px-4 py-3 text-center font-semibold">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-primary-100 transition-colors">
                          <td className="px-4 py-3">{item.productName}</td>
                          <td className="px-4 py-3">{item.itemUnitName}</td>
                          <td className="px-4 py-3">{item.itemBasicPrice}</td>
                          <td className="px-4 py-3">{item.itemPrice}</td>
                          <td className="px-4 py-3">{item.discountValue}</td>
                          <td className="px-4 py-3">{item.discountPercent}</td>
                          <td className="px-4 py-3 text-center">
                            {mode === 'add' && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="rounded-full px-4 py-1"
                                onClick={() => handleRemoveItem(idx)}
                              >
                                {t('remove')}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Footer buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="rounded-md"
                onClick={onClose}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="btn btn-primary text-white"
                disabled={items.length === 0}
              >
                {t('saveItems')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemOfferDetailsDialog; 