import { ITULanguage } from "../utils/itu.ts";

export interface GdprText {
  body: string;
  thanks: string;
  button: string;
  agree: string[];
}

export const GDPR_TEXT: Record<ITULanguage, GdprText> = {
  EN: {
    body: `
This is a bot about clay pot coolers. Before we can continue with our chat, you will need to agree that we process the information you provide.

If you are not sure, have a look at our Privacy Policy and our Terms of Use.

https://dooiy.org/privacy-policy
https://dooiy.org/terms-of-use`.trim(),
    thanks: `
Thank you for agreeing to our Privacy Policy and our Terms of Use.`.trim(),
    button: "I agree",
    agree: ["yes", "i agree"],
  },
  FR: {
    body: `
Ceci est un bot en matière de canaris de refroidissement, donc avant de pouvoir continuer notre conversation, vous devez accepter que nous traitions les informations que vous fournissez.

Si vous n'êtes pas sûr, consultez notre politique de confidentialité et nos conditions d'utilisation.

https://dooiy.org/privacy-policy
https://dooiy.org/terms-of-use`.trim(),
    thanks: `
Merci d'avoir accepté notre politique de confidentialité et nos conditions d'utilisation.`
      .trim(),
    button: "J'accepte",
    agree: ["oui", "j'accepte"],
  },
  AR: {
    body: `
هذا هو الروبوت ، لذلك قبل أن نتمكن من مواصلة محادثتنا ، ستحتاج إلى الموافقة على معالجة المعلومات التي تقدمها.

إذا لم تكن متأكدًا ، فانظر إلى سياسة الخصوصية وشروط الاستخدام الخاصة بنا.

https://dooiy.org/privacy-policy
https://dooiy.org/terms-of-use`.trim(),
    thanks: `
شكرا لك على الموافقة على سياسة الخصوصية وشروط الاستخدام الخاصة بنا.`.trim(),
    button: "أوافق",
    agree: ["نعم", "أوافق"],
  },
  ES: {
    body: `
Disculpe las molestias.

Este es un bot, por lo que antes de que podamos continuar con nuestro chat, deberá aceptar que procesemos la información que proporcione.

Si no está seguro, consulte nuestra Política de privacidad y nuestros Términos de uso.

https://dooiy.org/privacy-policy
https://dooiy.org/terms-of-use`.trim(),

    thanks: `
Gracias por aceptar nuestra Política de privacidad y nuestros Términos de uso.`
      .trim(),
    button: "Estoy de acuerdo",
    agree: ["sí", "estoy de acuerdo"],
  },
  RU: {
    body: `
Извините за беспокойство.

Это бот, поэтому, прежде чем мы сможем продолжить наш чат, вам нужно согласиться с тем, что мы обрабатываем предоставляемую вами информацию.

Если вы не уверены, ознакомьтесь с нашей Политикой конфиденциальности и нашими Условиями использования.

https://dooiy.org/privacy-policy
https://dooiy.org/terms-of-use`.trim(),
    thanks: `
Спасибо за согласие с нашей Политикой конфиденциальности и нашими Условиями использования.`
      .trim(),
    button: "Я согласен",
    agree: ["да", "я согласен"],
  },
  CN: {
    body: `
不好意思打扰你。

这是一个机器人，因此在我们继续聊天之前，您需要同意我们处理您提供的信息。

如果您不确定，请查看我们的隐私政策和使用条款。

https://dooiy.org/privacy-policy
https://dooiy.org/terms-of-use`.trim(),
    thanks: `
感谢您同意我们的隐私政策和使用条款。`.trim(),
    button: "我同意",
    agree: ["是的", "我同意"],
  },
};
