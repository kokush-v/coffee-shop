import { dayFields } from "@/src/features/footer/const/work-hours-const";

import { FooterSocialUrl } from "@/src/features/footer/components/footer-url";
import { cn } from "@/src/lib/utils";

export const Footer = () => {
  return (
    <footer className="py-2 border-t border-zinc-200 grid grid-cols-2 layout-spacing-rule">
      <div>
        <div className="space-y-1">
          <h2 className="footer-heading">Контактні дані</h2>
          <p className="footer-contact">Uzhhorod, Zakarpattia Oblast, Ukraine</p>
          <p className="footer-contact">+380 (12) 345 678</p>
        </div>
        <div className="space-y-1 mt-2">
          <h2 className="footer-heading">Робочий час</h2>
          {dayFields.map((day, index) => (
            <p
              key={day.label}
              className={cn(
                "text-xs font-medium text-zinc-700 flex flex-row w-[180px]",
                new Date().getDay() == index + 1 && "text-black font-bold"
              )}
            >
              {day.label} <span className="flex-1 text-right">{day.time}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="footer-heading">Ми в соцмережах</h2>
        <FooterSocialUrl src="/instagram.svg">Instagram</FooterSocialUrl>
        <FooterSocialUrl src="/telegram.svg">Telegram</FooterSocialUrl>
      </div>
    </footer>
  );
};
