/**
 * J03 — Presentation catalogue. No factory formats, prices or orderability
 * are represented as verified by these visual-only records.
 */
export type CatalogueLocale = "fr" | "ar";
export const localeFrom = (value: string | undefined): CatalogueLocale =>
  value === "ar" ? "ar" : "fr";

export const J03_MODELS = [
  { id: "lettres-frontales", asset: "CAT-ENS-01", nameFr: "Lettres lumineuses frontales", nameAr: "حروف مضيئة من الأمام" },
  { id: "lettres-retroeclairees", asset: "CAT-ENS-02", nameFr: "Lettres rétroéclairées", nameAr: "حروف بإضاءة خلفية" },
  { id: "caisson-rectangulaire", asset: "CAT-ENS-03", nameFr: "Caisson lumineux rectangulaire", nameAr: "صندوق ضوئي مستطيل" },
  { id: "neon-led-flexible", asset: "CAT-ENS-04", nameFr: "Néon LED flexible", nameAr: "نيون LED مرن" },
] as const;

export type J03Model = (typeof J03_MODELS)[number];
export const getJ03Model = (value: string): J03Model | undefined =>
  J03_MODELS.find((item) => item.id === value);

export const catalogueText = {
  fr: {
    backHome: "Retour à l’accueil", products: "Produits", family: "Enseignes",
    luminous: "Enseignes lumineuses", nonLuminous: "Enseignes non lumineuses",
    chooseFamily: "Choisissez votre type d’enseigne.",
    chooseModel: "Choisissez le modèle adapté à votre projet.",
    discover: "Découvrir les modèles", unavailable: "Bientôt disponible",
    notOrderable: "Modèles présentés à titre indicatif. La fabrication et la disponibilité restent à confirmer avec notre partenaire.",
    continue: "Choisir ce modèle", backModels: "Tous les modèles",
    activityTitle: "Quel est votre métier ?", activityHint: "Choisissez une activité, puis passez au format.",
    liberal: "Profession libérale", commerce: "Commerce", other: "Autre",
    specify: "Précisez votre activité", next: "Continuer vers le format",
    formatTitle: "Formats standards", formatHint: "Les formats seront proposés après validation des données de l’usine.",
    formatBlocked: "Aucun format n’est confirmé pour le moment. Le devis et PANOKIT Studio ne sont donc pas accessibles depuis cette sélection.",
    comeBack: "Modifier mon activité", home: "Accueil", info: "Informations produit",
    modelUnknown: "Modèle non disponible", familyUnknown: "Famille non disponible",
    otherFamilyHint: "Cette famille n’est pas encore ouverte dans le catalogue.",
    legal: "Signalétique & communication visuelle",
    artPending: "Illustration validée — intégration de l’image en attente",
    currentStep: "Étape", selection: "Modèle sélectionné",
    noPurchase: "Pas de commande possible à ce stade",
  },
  ar: {
    backHome: "العودة إلى الرئيسية", products: "المنتجات", family: "اللافتات",
    luminous: "اللافتات المضيئة", nonLuminous: "اللافتات غير المضيئة",
    chooseFamily: "اختر نوع اللافتة.",
    chooseModel: "اختر النموذج المناسب لمشروعك.",
    discover: "عرض النماذج", unavailable: "قريباً",
    notOrderable: "هذه النماذج للعرض فقط. يجب تأكيد إمكانية التصنيع والتوفر مع شريكنا.",
    continue: "اختيار هذا النموذج", backModels: "جميع النماذج",
    activityTitle: "ما مجال نشاطك؟", activityHint: "اختر نشاطك ثم انتقل إلى المقاسات.",
    liberal: "مهنة حرة", commerce: "تجارة", other: "أخرى",
    specify: "حدد مجال نشاطك", next: "المتابعة إلى المقاسات",
    formatTitle: "المقاسات القياسية", formatHint: "ستُعرض المقاسات بعد تأكيد بيانات المصنع.",
    formatBlocked: "لم يتم تأكيد أي مقاس بعد. لذلك لا يمكن طلب عرض سعر أو الانتقال إلى استوديو PANOKIT.",
    comeBack: "تعديل النشاط", home: "الرئيسية", info: "معلومات المنتج",
    modelUnknown: "النموذج غير متوفر", familyUnknown: "الفئة غير متوفرة",
    otherFamilyHint: "هذه الفئة غير متاحة في الكتالوج بعد.",
    legal: "اللافتات والتواصل البصري",
    artPending: "تم اعتماد الرسم — بانتظار إدراج الصورة",
    currentStep: "الخطوة", selection: "النموذج المختار",
    noPurchase: "لا يمكن إتمام الطلب في هذه المرحلة",
  },
} as const;

export const j03ModelName = (model: J03Model, locale: CatalogueLocale): string =>
  locale === "ar" ? model.nameAr : model.nameFr;

export const j03AssetPath = (model: J03Model): string =>
  `/visuals/catalogue/${model.asset}.webp`;
