import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class Errors {
  constructor(private toastr: ToastrService) {}

  // أسماء عرض لطيفة (اختياري)
  private readonly fieldLabel: Record<string, string> = {
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    password_confirm: 'تأكيد كلمة المرور',
    first_name: 'الاسم الأول',
    last_name: 'الاسم الأخير',
    phone: 'رقم الهاتف',
    username: 'البريد الإلكتروني',
  };

  /** اعرض كل رسائل أخطاء الباك في Toastr */
  error(
    err: any,
    opts: { join?: boolean; maxToasts?: number; title?: string } = {}
  ): void {
    const { join = false, maxToasts = 6, title = 'حدثت أخطاء' } = opts;

    // أخطاء الشبكة
    if (err?.status === 0) {
      this.toastr.error('تعذّر الاتصال بالخادم. تأكد من اتصال الإنترنت ثم أعد المحاولة.');
      return;
    }

    const messages = this.extractMessages(err);

    if (messages.length === 0) {
      this.toastr.error('فشل الطلب. يرجى المحاولة لاحقًا.');
      return;
    }

    // اختياري: امسح التوستات السابقة لمنع التكدّس
    this.toastr.clear();

    // اعرض الرسائل
    if (join) {
      // Toast واحد (مع فواصل أسطر)
      this.toastr.error(
        messages.join('<br/>'),
        title,
        { enableHtml: true, timeOut: 9000, closeButton: true, progressBar: true }
      );
    } else {
      // عدّة Toasts
      messages.slice(0, maxToasts).forEach(m => this.toastr.error(m));
      const remaining = messages.length - maxToasts;
      if (remaining > 0) {
        this.toastr.error(`و${remaining} رسالة أخرى…`);
      }
    }
  }

  /** يحوّل ردّ الباك إلى قائمة رسائل جاهزة للعرض */
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
          consume(v); // توغّل للكائنات المتداخلة
        } else {
          push(k, v);
        }
      }
    };

    if (typeof src === 'string') push('_error', src);
    else if (Array.isArray(src)) src.forEach(x => push('_error', x));
    else if (src && typeof src === 'object') consume(src);
    else push('_error', 'حدث خطأ غير متوقع.');

    // تطبيع أسماء شائعة
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

    // صياغة نهائية: "الحقل: الرسالة" أو رسالة عامة
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
    return Array.from(new Set(msgs)); // إزالة تكرارات إضافية
  }
}
