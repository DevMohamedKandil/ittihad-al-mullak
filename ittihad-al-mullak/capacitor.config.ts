import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ittihadalmullak.app',
  appName: 'اتحاد الملاك',
  webDir: 'dist/ittihad-al-mullak/browser',
  // مرحلة التجربة بس: التطبيق بيحمّل الصفحة مباشرة من سيرفر التطوير (نفس اللي بيفتحه على المتصفح)
  // بدل ما يستخدم نسخة مبنية جوّاه — أسرع للتجربة، وأي تعديل في الكود بيبان على طول من غير إعادة بناء.
  // قبل أي نشر حقيقي على المتجر: امسح الـ server ده كله عشان يستخدم webDir المبني بدل كده.
  server: {
    url: 'http://10.10.11.202:4300',
    cleartext: true,
  },
};

export default config;
