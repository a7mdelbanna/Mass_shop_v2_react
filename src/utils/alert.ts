import Swal from 'sweetalert2';
import i18n from '@/i18n'; // or 'i18next' if you prefer
const isRTL = i18n.language === 'ar';

const getToastPosition = () => {
  if (typeof document !== 'undefined') {
    return isRTL ? 'bottom-start' : 'bottom-end';
  }
  return 'bottom-end';
};

export const sweetAlert = Swal.mixin({
  toast: true,
  position: getToastPosition(),
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

