import { InjectionToken } from "@angular/core";

export enum SessionKeys {
  USER_DATA = "user_data",
  // FORM_VALUES = "form_values",
  HISTORY = "history",
}

// export const SESSION_KEYS = new InjectionToken<Record<string, string>>(
//   "SessionKeys",
//   {
//     providedIn: "root",
//     factory: () => ({
//       FORM_VALUES: "form_values",
//       HISTORY: "history",
//     }),
//   }
// );


export const SESSION_KEYS = new InjectionToken<typeof SessionKeys>('SessionKeys', {
    providedIn: 'root',
    factory: () => SessionKeys,
  });
