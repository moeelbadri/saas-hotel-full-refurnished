"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const getInitialLanguage = () => {
    if (typeof window !== "undefined") {
        // console.log("Language:", localStorage.getItem("lang"));
      return localStorage.getItem("lang")==="en" ? "en" : "ar"; // ✅ Runs only in browser
    }
    return "en"; // ✅ Default to "en" on the server
  };
  
i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                firstName: "First Name",
                lastName: "Last Name",
                email: "Email",
                password: "Password",
                phone: "Phone Number",
                LogIn: "Log In",
                LogInH: "Log in to your account",
                SignUp: "Sign Up",
                SignUpH: "Sign Up",
                LogOut: "Log Out",
                authUnauthorized : "Email / Password is incorrect",
                authForbidden : "You have to Contact the Hotel Owner to get Approval",
                networkError : "Oops! We can’t connect to our service at the moment. Please check your network connection or try again soon. If this issue persists, contact support.",
                authNotFound : "Email Not Found / if you don't have an account, sign up",
                authCredentialsError : "Email / Password is incorrect",
                // Storage translations
                criticalLevel: "Critical level",
                orderingInProgress: "Ordering ...",
                orderAddedSuccessfully: "Order has been successfully added",
                orderAddError: "There was an error while adding the order",
                editingStorageItem: "Editing storage item in progress... ",
                itemEditedSuccessfully: "Item successfully edited",
                editStorageItemError: "There was an error while editing storage item",
                deletingStorageItem: "Deleting storage item in progress... ",
                itemDeletedSuccessfully: "Item successfully Deleted",
                deleteStorageItemError: "There was an error while deleting storage item",
                editingItem: "Editing Item",
                newItemCreated: "New Item successfully created",
                failedToAddItem: "Failed to add Item",
                addingActivity: "Adding Activity",
                newActivityCreated: "New Activity successfully created",
                failedToAddActivity: "Failed to add Activity",
                // Settings translations
                updatingSettings: "Updating settings...",
                settingsEditedSuccessfully: "Settings successfully edited",
                failedToUpdateSettings: "Failed to update settings",
                updatingAmenities: "Updating amenities...",
                amenitiesUpdatedSuccessfully: "Amenities updated successfully!",
                failedToUpdateAmenities: "Failed to update amenities",
                updatingAlerts: "Updating Alerts...",
                alertsEditedSuccessfully: "Alerts successfully edited/inserted",
                failedToUpdateAlerts: "Failed to update Alerts",
                deletingAlerts: "Deleting Alerts...",
                alertsDeletedSuccessfully: "Alerts successfully deleted",
                failedToDeleteAlerts: "Failed to delete Alerts",
                // Reports translations
                deletingStorageActivity: "Deleting Storage Activity...",
                storageActivityDeleted: "Storage Activity successfully deleted",
                deleteStorageActivityError: "There was an error while deleting Storage Activity",
                // Notifications translations
                updatingNotifications: "Updating Notifications...",
                notificationsEditedSuccessfully: "Notifications successfully edited/inserted",
                failedToUpdateNotifications: "Failed to update Notifications",
                // Messages translations
                updatingMessages: "Updating Messages...",
                messagesEditedSuccessfully: "Messages successfully edited/inserted",
                failedToUpdateMessages: "Failed to update Messages",
                // Guests translations
                guestsUploadedSuccessfully: "Guests successfully Uploaded",
                guestEditedSuccessfully: "Guest successfully edited",
                newGuestCreated: "New Guest successfully created",
                // Discounts translations
                editingDiscount: "Editing discount in progress... ",
                discountEditedSuccessfully: "Discount successfully edited",
                editDiscountError: "There was an error while editing discount",
                // Common translations
                cancel: "Cancel",
                // Form labels
                addItem: "Add Item",
                name: "name",
                category: "Category",
                cost: "Cost",
                location: "Location",
                image: "Image",
                imageUploadHint: " (Upload img if you want to change it)",
                select: "Select...",
                edit: "Edit",
                add: "Add",
            },
        },
        ar: {
            translation: {
                firstName: "الاسم الأول",
                lastName: "الاسم الأخير",
                email: "البريد الإلكتروني",
                password: "كلمة المرور",
                phone: "رقم الهاتف",
                LogIn: "تسجيل الدخول",
                LogInH: "قم بتسجيل الدخول لحسابك",
                SignUp: "انشاء حساب",
                SignUpH: "قم بانشاء حساب",
                LogOut: "تسجيل الخروج",
                authUnauthorized : "البريد الإلكتروني / كلمة المرور غير صحيحة",
                authForbidden : "يجب التواصل مع صاحب الفندق للحصول على الموافقة",
                networkError: "عذراً! لا يمكننا الاتصال بالخدمة في الوقت الحالي. يُرجى التحقق من اتصالك بالشبكة أو المحاولة مرة أخرى قريباً. إذا استمرت المشكلة، يُرجى التواصل مع الدعم.",
                authNotFound : "البريد الإلكتروني غير موجود / اذا ليس لديك حساب ، قم بانشاء حساب",
                authCredentialsError : "البريد الإلكتروني / كلمة المرور غير صحيحة",
                // Storage translations
                criticalLevel: "مستوى التحذير",
                orderingInProgress: "جاري الطلب ...",
                orderAddedSuccessfully: "تمت اضافة الطلب بنجاح",
                orderAddError: "حدث خطأ اثناء اضافة الطلب",
                editingStorageItem: "جاري تعديل عنصر التخزين...",
                itemEditedSuccessfully: "تم تعديل العنصر بنجاح",
                editStorageItemError: "حدث خطأ اثناء تعديل عنصر التخزين",
                deletingStorageItem: "جاري حذف عنصر التخزين...",
                itemDeletedSuccessfully: "تم حذف العنصر بنجاح",
                deleteStorageItemError: "حدث خطأ اثناء حذف عنصر التخزين",
                editingItem: "جاري اضافة العنصر",
                newItemCreated: "تم انشاء عنصر جديد بنجاح",
                failedToAddItem: "فشل في اضافة العنصر",
                addingActivity: "جاري اضافة عملية",
                newActivityCreated: "تم انشاء عملية جديدة بنجاح",
                failedToAddActivity: "فشل اضافة عملية",
                // Settings translations
                updatingSettings: "جاري تحديث الاعدادات...",
                settingsEditedSuccessfully: "تم تعديل الاعدادات بنجاح",
                failedToUpdateSettings: "فشل تحديث الاعدادات",
                updatingAmenities: "جاري تحديث الخدمات...",
                amenitiesUpdatedSuccessfully: "تم تحديث الخدمات بنجاح",
                failedToUpdateAmenities: "فشل في تحديث الخدمات",
                updatingAlerts: "جاري تحديث التنبيهات...",
                alertsEditedSuccessfully: "تم تعديل/اضافة التنبيهات بنجاح",
                failedToUpdateAlerts: "فشل تحديث التنبيهات",
                deletingAlerts: "جاري حذف التنبيهات...",
                alertsDeletedSuccessfully: "تم حذف التنبيهات بنجاح",
                failedToDeleteAlerts: "فشل حذف التنبيهات",
                // Reports translations
                deletingStorageActivity: "جاري حذف العملية...",
                storageActivityDeleted: "تم حدف العملية بنجاح",
                deleteStorageActivityError: "حدث خطاء اثناء حذف العملية",
                // Notifications translations
                updatingNotifications: "جاري تحديث الرسائل...",
                notificationsEditedSuccessfully: "تم تعديل/اضافة الرسائل بنجاح",
                failedToUpdateNotifications: "فشل تحديث الرسائل",
                // Messages translations
                updatingMessages: "جاري تحديث التنبيهات...",
                messagesEditedSuccessfully: "تم تعديل/اضافة التنبيهات بنجاح",
                failedToUpdateMessages: "فشل تحديث التنبيهات",
                // Guests translations
                guestsUploadedSuccessfully: "تم تحميل بيانات النزلاء بنجاح",
                guestEditedSuccessfully: "تم تعديل الزائر بنجاح",
                newGuestCreated: "تم انشاء زائر جديد بنجاح",
                // Discounts translations
                editingDiscount: "جاري تعديل التخفيض...",
                discountEditedSuccessfully: "تم تعديل التخفيض بنجاح",
                editDiscountError: "حدث خطأ اثناء تعديل التخفيض",
                // Common translations
                cancel: "الغاء",
                // Form labels
                addItem: "إضافة عنصر",
                name: "اسم العنصر",
                category: "الفئة",
                cost: "التكلفة",
                location: "الموقع",
                image: "الصورة",
                imageUploadHint: " (قم برفع صورة اذا اردت التغيير)",
                select: "اختر...",
                edit: "تعديل",
                add: "إضافة",
            },
        },
    },
    lng:getInitialLanguage (), // Default language
    fallbackLng: "ar", // Fallback if the selected language is missing
    interpolation: {
        escapeValue: false, // React already escapes strings
    },
});

export default i18n;
