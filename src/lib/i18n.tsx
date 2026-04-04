"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Supported languages
export const languages = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  pt: { name: "Português", flag: "🇧🇷" },
  ja: { name: "日本語", flag: "🇯🇵" },
  zh: { name: "中文", flag: "🇨🇳" },
} as const;

export type Language = keyof typeof languages;

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.bookings": "Bookings",
    "nav.messages": "Messages",
    "nav.properties": "Properties",
    "nav.settings": "Settings",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.close": "Close",

    // Booking/Guest-Facing Pages
    "booking.searchProperties": "Search Properties",
    "booking.whereTo": "Where to?",
    "booking.checkIn": "Check-in",
    "booking.checkOut": "Check-out",
    "booking.guests": "Guests",
    "booking.searchButton": "Search",
    "booking.filters": "Filters",
    "booking.priceRange": "Price Range",
    "booking.propertyType": "Property Type",
    "booking.amenities": "Amenities",
    "booking.bedrooms": "Bedrooms",
    "booking.bathrooms": "Bathrooms",
    "booking.clearAll": "Clear All",
    "booking.applyFilters": "Apply Filters",
    "booking.sortBy": "Sort by",
    "booking.relevance": "Relevance",
    "booking.priceLowHigh": "Price: Low to High",
    "booking.priceHighLow": "Price: High to Low",
    "booking.rating": "Rating",
    "booking.perNight": "per night",
    "booking.totalFor": "Total for",
    "booking.nights": "nights",
    "booking.reserveNow": "Reserve Now",
    "booking.instantBook": "Instant Book",
    "booking.requestToBook": "Request to Book",
    "booking.viewDetails": "View Details",
    "booking.compare": "Compare",
    "booking.addToCompare": "Add to Compare",
    "booking.removeFromCompare": "Remove from Compare",
    "booking.compareProperties": "Compare Properties",
    "booking.clearComparison": "Clear Comparison",

    // Property Details
    "property.hostedBy": "Hosted by",
    "property.superhost": "Superhost",
    "property.reviews": "reviews",
    "property.aboutThisPlace": "About this place",
    "property.whatThisPlaceOffers": "What this place offers",
    "property.showAllAmenities": "Show all amenities",
    "property.whereYouWillBe": "Where you'll be",
    "property.availability": "Availability",
    "property.houseRules": "House rules",
    "property.checkInTime": "Check-in time",
    "property.checkOutTime": "Check-out time",
    "property.cancellationPolicy": "Cancellation policy",
    "property.reportListing": "Report this listing",

    // Checkout
    "checkout.title": "Complete your booking",
    "checkout.paymentMethod": "Payment method",
    "checkout.orPayWithCard": "or pay with card",
    "checkout.cardNumber": "Card number",
    "checkout.expiryDate": "Expiry date",
    "checkout.cvc": "CVC",
    "checkout.nameOnCard": "Name on card",
    "checkout.country": "Country",
    "checkout.zipCode": "ZIP code",
    "checkout.saveCard": "Save card for future payments",
    "checkout.yourTrip": "Your trip",
    "checkout.dates": "Dates",
    "checkout.priceDetails": "Price details",
    "checkout.cleaningFee": "Cleaning fee",
    "checkout.serviceFee": "Service fee",
    "checkout.taxes": "Taxes",
    "checkout.total": "Total",
    "checkout.confirmAndPay": "Confirm and pay",
    "checkout.secureCheckout": "Secure checkout",

    // Calendar Sync
    "calendar.syncCalendar": "Sync Calendar",
    "calendar.exportToGoogle": "Export to Google Calendar",
    "calendar.exportToiCal": "Export to iCal",
    "calendar.importCalendar": "Import Calendar",
    "calendar.calendarUrl": "Calendar URL",
    "calendar.syncNow": "Sync Now",
    "calendar.lastSynced": "Last synced",
    "calendar.autoSync": "Auto-sync enabled",

    // Dashboard
    "dashboard.title": "Host Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.totalBookings": "Total Bookings",
    "dashboard.totalRevenue": "Total Revenue",
    "dashboard.occupancyRate": "Occupancy Rate",
    "dashboard.avgRating": "Average Rating",
    "dashboard.recentBookings": "Recent Bookings",
    "dashboard.upcomingPayouts": "Upcoming Payouts",

    // Bookings
    "bookings.pending": "Pending",
    "bookings.confirmed": "Confirmed",
    "bookings.completed": "Completed",
    "bookings.cancelled": "Cancelled",
    "bookings.checkIn": "Check-in",
    "bookings.checkOut": "Check-out",
    "bookings.guests": "Guests",
    "bookings.nights": "nights",

    // Messages
    "messages.title": "Messages",
    "messages.newMessage": "New Message",
    "messages.typeMessage": "Type a message...",
    "messages.send": "Send",
    "messages.noMessages": "No messages yet",
    "messages.today": "Today",
    "messages.yesterday": "Yesterday",

    // Properties
    "properties.title": "Your Properties",
    "properties.addNew": "Add New Property",
    "properties.bedrooms": "bedrooms",
    "properties.bathrooms": "bathrooms",
    "properties.maxGuests": "max guests",
    "properties.perNight": "per night",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.markAllRead": "Mark all as read",
    "notifications.newBooking": "New booking request",
    "notifications.bookingConfirmed": "Booking confirmed",
    "notifications.newMessage": "New message received",
    "notifications.payoutProcessed": "Payout processed",
    "notifications.reviewReceived": "New review received",
  },
  es: {
    "nav.home": "Inicio",
    "nav.dashboard": "Panel",
    "nav.bookings": "Reservas",
    "nav.messages": "Mensajes",
    "nav.properties": "Propiedades",
    "nav.settings": "Configuración",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.search": "Buscar",
    "common.loading": "Cargando...",
    "common.noResults": "Sin resultados",
    "common.confirm": "Confirmar",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.submit": "Enviar",
    "common.close": "Cerrar",
    // Booking/Guest-Facing
    "booking.searchProperties": "Buscar Propiedades",
    "booking.whereTo": "¿A dónde?",
    "booking.checkIn": "Llegada",
    "booking.checkOut": "Salida",
    "booking.guests": "Huéspedes",
    "booking.searchButton": "Buscar",
    "booking.filters": "Filtros",
    "booking.priceRange": "Rango de Precio",
    "booking.propertyType": "Tipo de Propiedad",
    "booking.amenities": "Comodidades",
    "booking.bedrooms": "Habitaciones",
    "booking.bathrooms": "Baños",
    "booking.clearAll": "Limpiar Todo",
    "booking.applyFilters": "Aplicar Filtros",
    "booking.sortBy": "Ordenar por",
    "booking.perNight": "por noche",
    "booking.totalFor": "Total por",
    "booking.nights": "noches",
    "booking.reserveNow": "Reservar Ahora",
    "booking.instantBook": "Reserva Instantánea",
    "booking.viewDetails": "Ver Detalles",
    "booking.compare": "Comparar",
    "booking.addToCompare": "Agregar a Comparar",
    "booking.compareProperties": "Comparar Propiedades",
    "property.hostedBy": "Anfitrión",
    "property.superhost": "Superanfitrión",
    "property.reviews": "reseñas",
    "property.aboutThisPlace": "Acerca de este lugar",
    "property.whatThisPlaceOffers": "Lo que ofrece este lugar",
    "property.availability": "Disponibilidad",
    "property.houseRules": "Reglas de la casa",
    "checkout.title": "Completa tu reserva",
    "checkout.paymentMethod": "Método de pago",
    "checkout.cardNumber": "Número de tarjeta",
    "checkout.total": "Total",
    "checkout.confirmAndPay": "Confirmar y pagar",
    "checkout.secureCheckout": "Pago seguro",
    "calendar.syncCalendar": "Sincronizar Calendario",
    "calendar.exportToGoogle": "Exportar a Google Calendar",
    "calendar.exportToiCal": "Exportar a iCal",
    "dashboard.title": "Panel del Anfitrión",
    "dashboard.welcome": "Bienvenido de nuevo",
    "dashboard.totalBookings": "Total de Reservas",
    "dashboard.totalRevenue": "Ingresos Totales",
    "dashboard.occupancyRate": "Tasa de Ocupación",
    "dashboard.avgRating": "Calificación Promedio",
    "bookings.pending": "Pendiente",
    "bookings.confirmed": "Confirmado",
    "bookings.completed": "Completado",
    "bookings.cancelled": "Cancelado",
    "messages.title": "Mensajes",
    "messages.typeMessage": "Escribe un mensaje...",
    "messages.send": "Enviar",
    "notifications.title": "Notificaciones",
    "notifications.markAllRead": "Marcar todo como leído",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de bord",
    "nav.bookings": "Réservations",
    "nav.messages": "Messages",
    "nav.properties": "Propriétés",
    "nav.settings": "Paramètres",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.search": "Rechercher",
    "common.loading": "Chargement...",
    // Booking/Guest-Facing
    "booking.searchProperties": "Rechercher des Propriétés",
    "booking.whereTo": "Où aller?",
    "booking.checkIn": "Arrivée",
    "booking.checkOut": "Départ",
    "booking.guests": "Voyageurs",
    "booking.searchButton": "Rechercher",
    "booking.filters": "Filtres",
    "booking.priceRange": "Fourchette de Prix",
    "booking.perNight": "par nuit",
    "booking.reserveNow": "Réserver",
    "booking.viewDetails": "Voir les Détails",
    "booking.compare": "Comparer",
    "booking.compareProperties": "Comparer les Propriétés",
    "property.hostedBy": "Hôte",
    "property.reviews": "commentaires",
    "checkout.title": "Finaliser la réservation",
    "checkout.total": "Total",
    "checkout.confirmAndPay": "Confirmer et payer",
    "calendar.syncCalendar": "Synchroniser le Calendrier",
    "calendar.exportToGoogle": "Exporter vers Google Calendar",
    "calendar.exportToiCal": "Exporter vers iCal",
    "dashboard.title": "Tableau de Bord Hôte",
    "dashboard.welcome": "Bon retour",
    "messages.title": "Messages",
    "messages.typeMessage": "Tapez un message...",
    "messages.send": "Envoyer",
    "notifications.title": "Notifications",
  },
  de: {
    "nav.home": "Startseite",
    "nav.dashboard": "Dashboard",
    "nav.bookings": "Buchungen",
    "nav.messages": "Nachrichten",
    "nav.properties": "Immobilien",
    "nav.settings": "Einstellungen",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.search": "Suchen",
    // Booking/Guest-Facing
    "booking.searchProperties": "Unterkünfte Suchen",
    "booking.whereTo": "Wohin?",
    "booking.checkIn": "Anreise",
    "booking.checkOut": "Abreise",
    "booking.guests": "Gäste",
    "booking.searchButton": "Suchen",
    "booking.filters": "Filter",
    "booking.perNight": "pro Nacht",
    "booking.reserveNow": "Jetzt Buchen",
    "booking.viewDetails": "Details Anzeigen",
    "booking.compare": "Vergleichen",
    "booking.compareProperties": "Unterkünfte Vergleichen",
    "property.hostedBy": "Gastgeber",
    "property.reviews": "Bewertungen",
    "checkout.title": "Buchung Abschließen",
    "checkout.total": "Gesamt",
    "checkout.confirmAndPay": "Bestätigen und Bezahlen",
    "calendar.syncCalendar": "Kalender Synchronisieren",
    "calendar.exportToGoogle": "Zu Google Calendar Exportieren",
    "calendar.exportToiCal": "Zu iCal Exportieren",
    "dashboard.title": "Gastgeber-Dashboard",
    "messages.title": "Nachrichten",
    "notifications.title": "Benachrichtigungen",
  },
  pt: {
    "nav.home": "Início",
    "nav.dashboard": "Painel",
    "nav.bookings": "Reservas",
    "nav.messages": "Mensagens",
    "nav.properties": "Propriedades",
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    // Booking/Guest-Facing
    "booking.searchProperties": "Buscar Propriedades",
    "booking.whereTo": "Para onde?",
    "booking.checkIn": "Check-in",
    "booking.checkOut": "Check-out",
    "booking.guests": "Hóspedes",
    "booking.searchButton": "Buscar",
    "booking.filters": "Filtros",
    "booking.perNight": "por noite",
    "booking.reserveNow": "Reservar Agora",
    "booking.viewDetails": "Ver Detalhes",
    "booking.compare": "Comparar",
    "booking.compareProperties": "Comparar Propriedades",
    "property.hostedBy": "Anfitrião",
    "property.reviews": "avaliações",
    "checkout.title": "Finalizar Reserva",
    "checkout.total": "Total",
    "checkout.confirmAndPay": "Confirmar e Pagar",
    "calendar.syncCalendar": "Sincronizar Calendário",
    "calendar.exportToGoogle": "Exportar para Google Calendar",
    "calendar.exportToiCal": "Exportar para iCal",
    "dashboard.title": "Painel do Anfitrião",
    "messages.title": "Mensagens",
    "notifications.title": "Notificações",
  },
  ja: {
    "nav.home": "ホーム",
    "nav.dashboard": "ダッシュボード",
    "nav.bookings": "予約",
    "nav.messages": "メッセージ",
    "nav.properties": "物件",
    "common.save": "保存",
    "common.cancel": "キャンセル",
    // Booking/Guest-Facing
    "booking.searchProperties": "物件を検索",
    "booking.whereTo": "どこへ?",
    "booking.checkIn": "チェックイン",
    "booking.checkOut": "チェックアウト",
    "booking.guests": "ゲスト",
    "booking.searchButton": "検索",
    "booking.filters": "フィルター",
    "booking.perNight": "泊",
    "booking.reserveNow": "今すぐ予約",
    "booking.viewDetails": "詳細を見る",
    "booking.compare": "比較",
    "booking.compareProperties": "物件を比較",
    "property.hostedBy": "ホスト",
    "property.reviews": "レビュー",
    "checkout.title": "予約を完了",
    "checkout.total": "合計",
    "checkout.confirmAndPay": "確認して支払う",
    "calendar.syncCalendar": "カレンダーを同期",
    "calendar.exportToGoogle": "Googleカレンダーにエクスポート",
    "calendar.exportToiCal": "iCalにエクスポート",
    "dashboard.title": "ホストダッシュボード",
    "messages.title": "メッセージ",
    "notifications.title": "通知",
  },
  zh: {
    "nav.home": "首页",
    "nav.dashboard": "仪表板",
    "nav.bookings": "预订",
    "nav.messages": "消息",
    "nav.properties": "房源",
    "common.save": "保存",
    "common.cancel": "取消",
    // Booking/Guest-Facing
    "booking.searchProperties": "搜索房源",
    "booking.whereTo": "去哪里?",
    "booking.checkIn": "入住",
    "booking.checkOut": "退房",
    "booking.guests": "房客",
    "booking.searchButton": "搜索",
    "booking.filters": "筛选",
    "booking.perNight": "每晚",
    "booking.reserveNow": "立即预订",
    "booking.viewDetails": "查看详情",
    "booking.compare": "对比",
    "booking.compareProperties": "对比房源",
    "property.hostedBy": "房东",
    "property.reviews": "评价",
    "checkout.title": "完成预订",
    "checkout.total": "总计",
    "checkout.confirmAndPay": "确认并支付",
    "calendar.syncCalendar": "同步日历",
    "calendar.exportToGoogle": "导出到谷歌日历",
    "calendar.exportToiCal": "导出到iCal",
    "dashboard.title": "房东仪表板",
    "messages.title": "消息",
    "notifications.title": "通知",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = translations[language]?.[key] || translations.en[key] || key;

      if (params) {
        for (const [param, value] of Object.entries(params)) {
          text = text.replace(`{${param}}`, String(value));
        }
      }

      return text;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Language selector component
export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
      >
        <span className="text-lg">{languages[language].flag}</span>
        <span className="text-sm hidden sm:inline">{languages[language].name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-20 overflow-hidden">
            {Object.entries(languages).map(([code, { name, flag }]) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLanguage(code as Language);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                  language === code ? "bg-zinc-50 dark:bg-zinc-800" : ""
                }`}
              >
                <span className="text-lg">{flag}</span>
                <span className="text-sm">{name}</span>
                {language === code && (
                  <svg className="w-4 h-4 ml-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
