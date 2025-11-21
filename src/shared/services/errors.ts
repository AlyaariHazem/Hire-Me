import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class Errors {
  constructor(private toastr: ToastrService) {}

  // Arabic field labels for error messages
  private readonly fieldLabel: Record<string, string> = {
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    password_confirm: 'تأكيد كلمة المرور',
    first_name: 'الاسم الأول',
    last_name: 'الاسم الأخير',
    phone: 'رقم الهاتف',
    username: 'البريد الإلكتروني',
  };
// this method displays error messages using Toastr
  error(
    err: any,
    opts: { join?: boolean; maxToasts?: number; title?: string } = {}
  ): void {
    const { join = false, maxToasts = 6, title = 'حدثت أخطاء' } = opts;

    // Network errors
    if (err?.status === 0) {
      this.toastr.error('تعذّر الاتصال بالخادم. تأكد من اتصال الإنترنت ثم أعد المحاولة.');
      return;
    }

    const messages = this.extractMessages(err);

    if (messages.length === 0) {
      this.toastr.error('فشل الطلب. يرجى المحاولة لاحقًا.');
      return;
    }

    // Optional: clear previous toasts to prevent clutter
    this.toastr.clear();

    // Display messages
    if (join) {
      // Single toast (with line breaks)
      this.toastr.error(
        messages.join('<br/>'),
        title,
        { enableHtml: true, timeOut: 9000, closeButton: true, progressBar: true }
      );
    } else {
      // Multiple toasts
      messages.slice(0, maxToasts).forEach(m => this.toastr.error(m));
      const remaining = messages.length - maxToasts;
      if (remaining > 0) {
        this.toastr.error(`و${remaining} رسالة أخرى…`);
      }
    }
  }
//  this method extracts error messages from various error response formats
  private extractMessages(err: any): string[] {
    const src = err?.error?.data ?? err?.error?.errors ?? err?.error ?? err;

    const map: Record<string, string[]> = {};
    const push = (k: string, v: any) => {
      if (v == null) return;
      const arr = Array.isArray(v) ? v : [v];
      arr.forEach(x => {
        const s = String(x ?? '').trim();
        if (s) (map[k] ||= []).push(s);
      });
    };

    const consume = (obj: any) => {
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (['detail', 'message', 'non_field_errors', '_error'].includes(k)) {
          push('_error', v);
        } else if (v && typeof v === 'object' && !Array.isArray(v)) {
          consume(v); // recursively traverse nested objects
        } else {
          push(k, v);
        }
      }
    };

    if (typeof src === 'string') push('_error', src);
    else if (Array.isArray(src)) src.forEach(x => push('_error', x));
    else if (src && typeof src === 'object') consume(src);
    else push('_error', 'حدث خطأ غير متوقع.');

    // Normalize common field names
    const aliases: Record<string, string> = {
      password2: 'password_confirm',
      confirm_password: 'password_confirm',
      username: 'email',
    };
    for (const [from, to] of Object.entries(aliases)) {
      if (map[from]) {
        map[to] = (map[to] || []).concat(map[from]);
        delete map[from];
      }
    }

    // Final formatting: "Field: message" or general message
    const msgs: string[] = [];
    for (const [k, arr] of Object.entries(map)) {
      const unique = Array.from(new Set(arr));
      if (k === '_error') {
        msgs.push(...unique);
      } else {
        const label = this.fieldLabel[k] ?? k;
        unique.forEach(m => msgs.push(`${label}: ${m}`));
      }
    }
    return Array.from(new Set(msgs)); // Remove additional duplicates
  }
}
