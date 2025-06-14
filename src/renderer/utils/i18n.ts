// SPDX-FileCopyrightText: 2025 The BAR Lobby Authors
//
// SPDX-License-Identifier: MIT

export const pluralize = (str: string, quantity: number, locale: string = "en-US"): string => {
    const rule = new Intl.PluralRules(locale).select(quantity);
    if (rule == "one") return str;
    return str + "s"; // TODO: link to i18n translation files
};
