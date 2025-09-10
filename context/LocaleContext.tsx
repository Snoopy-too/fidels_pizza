import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Locale } from '../types';

// --- TRANSLATION DATA ---

const translations = {
    en: {
        currency: 'JPY',
        modal: {
            ok: 'OK',
            confirm: 'Confirm',
            cancel: 'Cancel',
        },
        header: {
            title: "Fidel's Pizza",
            home: 'Home',
            menu: 'Menu',
            myOrders: 'My Orders',
            admin: 'Admin',
            welcome: 'Welcome, {{name}}',
            logout: 'Logout',
            login: 'Login',
            register: 'Register',
        },
        footer: {
            copy: '© {{year}} Fidel\'s Pizza. All rights reserved.',
            crafted: 'Crafted with passion in Tokyo.',
        },
        landingPage: {
            eventInfo: {
                date: 'Date',
                location: 'Location',
            },
            registerNow: 'Register Now',
            preOrder: 'View Menu & Pre-Order',
            pastEventsTitle: 'From Our Past Events',
        },
        registerPage: {
            title: 'Create Your Account',
            accessCodePrompt: 'Please enter the 4-digit access code for the event.',
            accessCodeLabel: 'Access Code',
            verifyCodeBtn: 'Verify Code',
            invalidCodeError: 'Invalid access code. Please try again.',
            codeVerifiedSuccess: 'Code verified! Please fill out your details.',
            fullNameLabel: 'Full Name',
            emailLabel: 'Email Address',
            passwordLabel: 'Password',
            simulationNotice: 'This is a simulation. Do not use a real password.',
            createAccountBtn: 'Create Account',
            successTitle: 'Registration Successful!',
            successMessage: 'Welcome! You can now proceed to the menu to place your order.',
            emailExistsError: 'An account with this email already exists.',
        },
        loginPage: {
            title: 'Welcome Back',
            emailLabel: 'Email',
            passwordLabel: 'Password',
            passwordHint: 'Hint: For mock users, the password is "password".',
            signInBtn: 'Sign In',
            invalidCredentialsError: 'Invalid email or password.',
            forgotPasswordLink: 'Forgot your password?',
        },
        forgotPassword: {
            title: 'Forgot Password',
            prompt: "Enter your email address and we'll send you a link to reset your password.",
            emailLabel: 'Email',
            sendBtn: 'Send Reset Link',
            sendingBtn: 'Sending...',
            backToLogin: 'Back to Login',
            noAccount: 'No account found with this email address.',
            resetLinkSentTitle: 'Reset Link Sent',
            resetLinkSentMessage: 'A password reset link has been sent to {{email}}. Please check your inbox. For this simulation, the link is: {{resetUrl}}',
            resetLinkSentSuccess: 'If an account exists for {{email}}, a password reset link has been sent.',
        },
        resetPassword: {
            title: 'Reset Your Password',
            prompt: 'Please enter your new password below.',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password',
            resetBtn: 'Reset Password',
            resettingBtn: 'Resetting...',
            noToken: 'Invalid or missing reset token. Please request a new link.',
            passwordMismatch: "Passwords don't match. Please try again.",
            passwordLengthError: 'Password must be at least 6 characters long.',
            success: 'Your password has been reset successfully!',
            invalidToken: 'This password reset link is invalid or has expired.',
            requestNewLink: 'Request a new reset link',
            redirecting: ' Redirecting to login...',
        },
        menuPage: {
            title: 'Pizza Menu',
            addToOrderBtn: 'Add to Order',
            unavailableBtn: 'Unavailable',
            viewCartBtn: 'View My Order',
            loginRequiredTitle: 'Please Log In',
            loginRequiredMessage: 'You need to be logged in to place an order.',
            emptyCartTitle: 'Empty Order',
            emptyCartMessage: 'Your order is empty. Please add some pizzas first.',
            cart: {
                title: 'My Order',
                empty: 'Your order is empty.',
                total: 'Total:',
                clearBtn: 'Clear',
                placeOrderBtn: 'Place Order',
                updateOrderBtn: 'Update Order',
            },
        },
        myOrders: {
            title: 'My Orders',
            order: 'Order',
            placedOn: 'Placed on',
            pickupTime: 'Pickup Time:',
            unassigned: 'Unassigned',
            summaryTitle: 'Order Summary',
            total: 'Total:',
            updateOrderBtn: 'Update Items',
            cancelOrderBtn: 'Cancel Order',
            noOrders: "You haven't placed any orders yet.",
            confirmCancelTitle: 'Confirm Cancellation',
            confirmCancelMessage: 'Are you sure you want to cancel this order? This action cannot be undone.',
            editOrderTitle: 'Editing Order',
            emptyOrder: 'Your order is now empty.',
            saveChangesBtn: 'Save Changes',
            discardChangesBtn: 'Discard',
            confirmEmptyTitle: 'Empty Order',
            confirmEmptyMessage: 'You have removed all items from your order. This will cancel the order. Do you want to proceed?',
            confirmEmptyBtn: 'Yes, Cancel Order'
        },
        order: {
            placed: {
                title: 'Order Placed!',
                message: 'Your order #{{orderId}} has been successfully placed. A confirmation has been sent to {{email}}.',
            },
            updated: {
                title: 'Order Updated!',
                message: 'Your order #{{orderId}} has been successfully updated.',
            },
            cancelled: {
                title: 'Order Cancelled',
                message: 'Your order #{{orderId}} has been cancelled.',
            },
            status: {
                pending: 'Pending',
                completed: 'Completed',
                cancelled: 'Cancelled',
            },
        },
        profile: {
            title: 'My Profile',
            notAuthenticated: 'User not authenticated.',
            incorrectPassword: 'The current password you entered is incorrect.',
            updateSuccess: 'Profile updated successfully.',
            passwordMismatch: "The new passwords don't match.",
            noChanges: 'No changes to save.',
            saveBtn: 'Save Changes',
            accountDetails: {
                title: 'Account Details',
                name: 'Name',
                email: 'Email',
            },
            changePassword: {
                title: 'Change Password',
                current: 'Current Password',
                currentPlaceholder: 'Required to change password',
                new: 'New Password',
                newPlaceholder: 'Leave blank to keep current',
                confirm: 'Confirm New Password',
            },
        },
        admin: {
            dashboard: {
                title: 'Admin Dashboard',
                tabs: {
                    orders: 'Orders',
                    menu: 'Menu Management',
                    settings: 'Site Settings',
                    profile: 'My Profile',
                },
            },
            orders: {
                title: 'Order Management',
                filterPlaceholder: 'Filter by customer, order ID, or pizza...',
                selectedCount: '{{count}} order(s) selected.',
                setPickupTime: 'Set Pickup Time',
                applyBtn: 'Apply',
                notAvailable: 'N/A',
                viewAction: 'View/Edit',
                modalTitle: 'Order Details: #{{orderId}}',
                customerLabel: 'Customer:',
                itemsLabel: 'Items:',
                totalLabel: 'Total:',
                statusLabel: 'Status:',
                pickupTimeLabel: 'Pickup Time:',
                missingInfoTitle: 'Missing Information',
                missingInfoMessage: 'Please select a pickup time to apply.',
                bulkUpdateConfirmTitle: 'Confirm Bulk Update',
                bulkUpdateConfirmMessage: 'Are you sure you want to set the pickup time to {{pickupTime}} for {{count}} orders?',
                bulkUpdateSuccessTitle: 'Update Successful',
                bulkUpdateSuccessMessage: '{{count}} orders have been updated.',
                headers: {
                    id: 'ID',
                    customer: 'Customer',
                    items: 'Items',
                    total: 'Total',
                    pickupTime: 'Pickup',
                    date: 'Date',
                    status: 'Status',
                    actions: 'Actions',
                },
                productionSummary: {
                    title: 'Production Summary',
                    totalPizza: 'Total Pizzas Required',
                    pizzaType: 'Pizza',
                    total: 'Total',
                    byTime: 'Production by Time Slot',
                    time: 'Time',
                },
            },
            menu: {
                title: 'Menu Management',
                addNewBtn: 'Add New Item',
                statusLabel: 'Status:',
                available: 'Available',
                unavailable: 'Unavailable',
                editBtn: 'Edit',
                deleteBtn: 'Delete',
                confirmDeleteTitle: 'Confirm Deletion',
                confirmDeleteMessage: 'Are you sure you want to delete this menu item?',
                modal: {
                    editTitle: 'Edit Menu Item',
                    addTitle: 'Add New Menu Item',
                    namePlaceholder: 'Pizza Name',
                    descriptionPlaceholder: 'Description',
                    pricePlaceholder: 'Price',
                    imageUrlPlaceholder: 'Image URL',
                    availableLabel: 'Available for ordering',
                    saveBtn: 'Save Changes',
                    addBtn: 'Add Item',
                },
            },
            settings: {
                title: 'Site Settings',
                updateSuccessTitle: 'Success',
                eventUpdateSuccess: 'Event information updated successfully.',
                landingUpdateSuccess: 'Landing page content updated successfully.',
                codeUpdateSuccess: 'Access code updated successfully.',
                clearOrdersSuccessTitle: 'Orders Cleared',
                clearOrdersSuccessMessage: 'All orders have been successfully cleared from the system.',
                clearOrdersConfirmTitle: 'Confirm Clear All Orders',
                clearOrdersConfirmMessage: 'Are you sure you want to permanently delete ALL orders? This action cannot be undone.',
                eventDetails: {
                    title: 'Event Details',
                    date: 'Date',
                    address: 'Address',
                    saveBtn: 'Save Event Info',
                },
                landingContent: {
                    title: 'Landing Page Content',
                    pageTitle: 'Title',
                    description: 'Description',
                    imageUrls: 'Image URLs (comma-separated)',
                    saveBtn: 'Save Content',
                },
                accessCode: {
                    title: 'Registration Access Code',
                    code: '4-Digit Code',
                    saveBtn: 'Save Code',
                },
                dangerZone: {
                    title: 'Danger Zone',
                    description: 'These actions are destructive and cannot be undone. Please be certain.',
                    clearOrdersBtn: 'Clear All Orders',
                },
            },
        },
    },
    ja: {
        currency: '円',
        modal: {
            ok: 'OK',
            confirm: '確認',
            cancel: 'キャンセル',
        },
        header: {
            title: 'フィデルのピザ',
            home: 'ホーム',
            menu: 'メニュー',
            myOrders: '注文履歴',
            admin: '管理',
            welcome: 'ようこそ、{{name}}さん',
            logout: 'ログアウト',
            login: 'ログイン',
            register: '登録',
        },
        footer: {
            copy: '© {{year}} フィデルのピザ. All rights reserved.',
            crafted: '東京で情熱を込めて作られています。',
        },
        landingPage: {
            eventInfo: {
                date: '開催日',
                location: '場所',
            },
            registerNow: '今すぐ登録',
            preOrder: 'メニューを見る・事前注文',
            pastEventsTitle: '過去のイベントから',
        },
        registerPage: {
            title: 'アカウント作成',
            accessCodePrompt: 'イベント用の4桁のアクセスコードを入力してください。',
            accessCodeLabel: 'アクセスコード',
            verifyCodeBtn: 'コードを認証',
            invalidCodeError: 'アクセスコードが無効です。もう一度お試しください。',
            codeVerifiedSuccess: 'コードが認証されました！詳細を入力してください。',
            fullNameLabel: '氏名',
            emailLabel: 'メールアドレス',
            passwordLabel: 'パスワード',
            simulationNotice: 'これはシミュレーションです。実際のパスワードは使用しないでください。',
            createAccountBtn: 'アカウントを作成',
            successTitle: '登録が完了しました！',
            successMessage: 'ようこそ！メニューに進んで注文してください。',
            emailExistsError: 'このメールアドレスは既に登録されています。',
        },
        loginPage: {
            title: 'おかえりなさい',
            emailLabel: 'メールアドレス',
            passwordLabel: 'パスワード',
            passwordHint: 'ヒント：モックユーザーのパスワードは "password" です。',
            signInBtn: 'サインイン',
            invalidCredentialsError: 'メールアドレスまたはパスワードが無効です。',
            forgotPasswordLink: 'パスワードをお忘れですか？',
        },
        forgotPassword: {
            title: 'パスワードをお忘れの場合',
            prompt: 'メールアドレスを入力してください。パスワード再設定用のリンクをお送りします。',
            emailLabel: 'メールアドレス',
            sendBtn: '再設定リンクを送信',
            sendingBtn: '送信中...',
            backToLogin: 'ログインに戻る',
            noAccount: 'このメールアドレスのアカウントは見つかりませんでした。',
            resetLinkSentTitle: '再設定リンクを送信しました',
            resetLinkSentMessage: 'パスワード再設定リンクを{{email}}に送信しました。受信トレイを確認してください。シミュレーションのため、リンクはこちらです：{{resetUrl}}',
            resetLinkSentSuccess: '{{email}}のアカウントが存在する場合、パスワード再設定リンクが送信されました。',
        },
        resetPassword: {
            title: 'パスワードをリセット',
            prompt: '新しいパスワードを以下に入力してください。',
            newPassword: '新しいパスワード',
            confirmPassword: '新しいパスワード（確認）',
            resetBtn: 'パスワードをリセット',
            resettingBtn: 'リセット中...',
            noToken: '再設定トークンが無効または見つかりません。新しいリンクをリクエストしてください。',
            passwordMismatch: 'パスワードが一致しません。もう一度お試しください。',
            passwordLengthError: 'パスワードは6文字以上で設定してください。',
            success: 'パスワードが正常にリセットされました！',
            invalidToken: 'このパスワード再設定リンクは無効か、有効期限が切れています。',
            requestNewLink: '新しい再設定リンクをリクエスト',
            redirecting: ' ログイン画面にリダイレクトします...',
        },
        menuPage: {
            title: 'ピザメニュー',
            addToOrderBtn: '注文に追加',
            unavailableBtn: '品切れ',
            viewCartBtn: '注文を確認',
            loginRequiredTitle: 'ログインしてください',
            loginRequiredMessage: '注文するにはログインが必要です。',
            emptyCartTitle: '注文が空です',
            emptyCartMessage: '注文が空です。先にピザを追加してください。',
            cart: {
                title: 'マイオーダー',
                empty: '注文は空です。',
                total: '合計:',
                clearBtn: 'クリア',
                placeOrderBtn: '注文を確定',
                updateOrderBtn: '注文を更新',
            },
        },
        myOrders: {
            title: '注文履歴',
            order: '注文',
            placedOn: '注文日',
            pickupTime: '受取時間:',
            unassigned: '未定',
            summaryTitle: '注文概要',
            total: '合計:',
            updateOrderBtn: '商品を編集',
            cancelOrderBtn: '注文をキャンセル',
            noOrders: 'まだ注文がありません。',
            confirmCancelTitle: 'キャンセル確認',
            confirmCancelMessage: '本当にこの注文をキャンセルしますか？この操作は元に戻せません。',
            editOrderTitle: '注文を編集中',
            emptyOrder: '注文が空になりました。',
            saveChangesBtn: '変更を保存',
            discardChangesBtn: '破棄',
            confirmEmptyTitle: '注文が空です',
            confirmEmptyMessage: '注文からすべての商品を削除しました。これにより注文がキャンセルされます。続行しますか？',
            confirmEmptyBtn: 'はい、キャンセルします'
        },
        order: {
            placed: {
                title: '注文が完了しました！',
                message: '注文番号#{{orderId}}の受付が完了しました。確認メールを{{email}}にお送りしました。',
            },
            updated: {
                title: '注文が更新されました！',
                message: '注文番号#{{orderId}}は正常に更新されました。',
            },
            cancelled: {
                title: '注文がキャンセルされました',
                message: '注文番号#{{orderId}}はキャンセルされました。',

            },
            status: {
                pending: '準備中',
                completed: '完了',
                cancelled: 'キャンセル済',
            },
        },
        profile: {
            title: 'マイプロフィール',
            notAuthenticated: 'ユーザーが認証されていません。',
            incorrectPassword: '現在のパスワードが間違っています。',
            updateSuccess: 'プロフィールが正常に更新されました。',
            passwordMismatch: '新しいパスワードが一致しません。',
            noChanges: '保存する変更がありません。',
            saveBtn: '変更を保存',
            accountDetails: {
                title: 'アカウント詳細',
                name: '名前',
                email: 'メールアドレス',
            },
            changePassword: {
                title: 'パスワード変更',
                current: '現在のパスワード',
                currentPlaceholder: 'パスワード変更に必要です',
                new: '新しいパスワード',
                newPlaceholder: '変更しない場合は空欄',
                confirm: '新しいパスワード（確認）',
            },
        },
        admin: {
            dashboard: {
                title: '管理者ダッシュボード',
                tabs: {
                    orders: '注文管理',
                    menu: 'メニュー管理',
                    settings: 'サイト設定',
                    profile: 'マイプロフィール',
                },
            },
            orders: {
                title: '注文管理',
                filterPlaceholder: '顧客名、注文ID、ピザ名で絞り込み...',
                selectedCount: '{{count}}件の注文を選択中',
                setPickupTime: '受取時間を設定',
                applyBtn: '適用',
                notAvailable: '未設定',
                viewAction: '表示/編集',
                modalTitle: '注文詳細: #{{orderId}}',
                customerLabel: '顧客:',
                itemsLabel: '商品:',
                totalLabel: '合計:',
                statusLabel: 'ステータス:',
                pickupTimeLabel: '受取時間:',
                missingInfoTitle: '情報が不足しています',
                missingInfoMessage: '適用する受取時間を選択してください。',
                bulkUpdateConfirmTitle: '一括更新の確認',
                bulkUpdateConfirmMessage: '{{count}}件の注文の受取時間を{{pickupTime}}に設定しますか？',
                bulkUpdateSuccessTitle: '更新成功',
                bulkUpdateSuccessMessage: '{{count}}件の注文が更新されました。',
                headers: {
                    id: 'ID',
                    customer: '顧客',
                    items: '品数',
                    total: '合計',
                    pickupTime: '受取',
                    date: '日付',
                    status: 'ステータス',
                    actions: '操作',
                },
                productionSummary: {
                    title: '生産サマリー',
                    totalPizza: '必要なピザの総数',
                    pizzaType: 'ピザ',
                    total: '合計',
                    byTime: '時間帯別生産数',
                    time: '時間',
                },
            },
            menu: {
                title: 'メニュー管理',
                addNewBtn: '新規追加',
                statusLabel: '状態:',
                available: '提供中',
                unavailable: '品切れ',
                editBtn: '編集',
                deleteBtn: '削除',
                confirmDeleteTitle: '削除の確認',
                confirmDeleteMessage: 'このメニュー項目を本当に削除しますか？',
                modal: {
                    editTitle: 'メニュー項目を編集',
                    addTitle: '新しいメニュー項目を追加',
                    namePlaceholder: 'ピザの名前',
                    descriptionPlaceholder: '説明',
                    pricePlaceholder: '価格',
                    imageUrlPlaceholder: '画像URL',
                    availableLabel: '注文可能にする',
                    saveBtn: '変更を保存',
                    addBtn: '項目を追加',
                },
            },
            settings: {
                title: 'サイト設定',
                updateSuccessTitle: '成功',
                eventUpdateSuccess: 'イベント情報が正常に更新されました。',
                landingUpdateSuccess: 'ランディングページの内容が正常に更新されました。',
                codeUpdateSuccess: 'アクセスコードが正常に更新されました。',
                clearOrdersSuccessTitle: '注文を削除しました',
                clearOrdersSuccessMessage: 'すべての注文がシステムから正常に削除されました。',
                clearOrdersConfirmTitle: 'すべての注文の削除を確認',
                clearOrdersConfirmMessage: '本当にすべての注文を完全に削除しますか？この操作は元に戻せません。',
                eventDetails: {
                    title: 'イベント詳細',
                    date: '日付',
                    address: '住所',
                    saveBtn: 'イベント情報を保存',
                },
                landingContent: {
                    title: 'ランディングページの内容',
                    pageTitle: 'タイトル',
                    description: '説明',
                    imageUrls: '画像URL（カンマ区切り）',
                    saveBtn: '内容を保存',
                },
                accessCode: {
                    title: '登録アクセスコード',
                    code: '4桁のコード',
                    saveBtn: 'コードを保存',
                },
                dangerZone: {
                    title: '危険ゾーン',
                    description: 'これらの操作は破壊的であり、元に戻すことはできません。十分に確認してください。',
                    clearOrdersBtn: 'すべての注文を削除',
                },
            },
        },
    }
};

// --- CONTEXT SETUP ---

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>('en');

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
        const lang = translations[locale] as any;
        // Access nested properties using dot notation
        let text = key.split('.').reduce((obj, k) => obj && obj[k], lang);

        if (typeof text !== 'string') {
            console.warn(`Translation not found or not a string for key: ${key}`);
            return key; // Return the key itself as a fallback
        }
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`{{${placeholder}}}`, 'g');
                text = text.replace(regex, String(replacements[placeholder]));
            });
        }

        return text;
    }, [locale]);

    const value = { locale, setLocale, t };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};
