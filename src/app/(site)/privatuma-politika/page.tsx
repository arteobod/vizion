'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

const content = {
  lv: {
    title: 'PRIVĀTUMA POLITIKA',
    updated: 'Pēdējo reizi atjaunināts: 2026. gads',
    back: '← ATPAKAĻ',
    sections: [
      {
        heading: '1. PĀRZINIS',
        text: 'Personas datu pārzinis ir SIA Vižon (tālāk — "mēs", "Vižon"), reģistrācijas numurs: reģistrēts Latvijas Komercreģistrā. Juridiskā adrese: Rīga, Latvija. Kontakts privātuma jautājumos: info@viz-on.net.',
      },
      {
        heading: '2. KĀDI DATI TIEK VĀKTI',
        text: 'Apmeklējot mūsu vietni viz-on.net, mēs varam apstrādāt šādus datus:\n• Kontaktformas dati: vārds, e-pasta adrese, projekta apraksts — ko jūs iesniedzat brīvprātīgi.\n• Tehniskie dati: IP adrese, pārlūkprogramma, ierīces tips, lapu apmeklējumu statistika — kas tiek apkopoti automātiski.\n• Lietotāja preferences: valodas izvēle (fv-locale) un krāsu tēma (fv-theme) — saglabātas tikai jūsu pārlūkā (localStorage).',
      },
      {
        heading: '3. APSTRĀDES MĒRĶI UN JURIDISKAIS PAMATS',
        text: '• Kontaktformas dati tiek apstrādāti, lai atbildētu uz jūsu pieprasījumu (VDAR 6. panta 1. punkta b) apakšpunkts — līguma noslēgšanas priekšpasākumi).\n• Tehniskie dati tiek apkopoti mūsu leģitīmo interešu ietvaros vietnes darbības nodrošināšanai un uzlabošanai (VDAR 6. panta 1. punkta f) apakšpunkts).\n• Preferences (localStorage) netiek nosūtītas mūsu serveriem un paliek tikai jūsu ierīcē.',
      },
      {
        heading: '4. DATU GLABĀŠANA',
        text: 'Kontaktformas dati tiek glabāti ne ilgāk kā 12 mēnešus pēc pēdējās saziņas. Tehniskie žurnālu dati — ne vairāk kā 90 dienas. Jūs varat pieprasīt savu datu dzēšanu jebkurā laikā, rakstot uz info@viz-on.net.',
      },
      {
        heading: '5. TREŠĀS PUSES',
        text: 'Mēs neizmantojam trešo pušu sīkdatnes (cookies) un nepārdodam jūsu datus trešajām pusēm. Veidlapas iesniegšana tiek apstrādāta caur mūsu API — dati netiek nodoti ārpusē bez jūsu piekrišanas.',
      },
      {
        heading: '6. JŪSU TIESĪBAS',
        text: 'Saskaņā ar VDAR (Vispārīgo datu aizsardzības regulu) jums ir tiesības:\n• Piekļūt saviem datiem\n• Labot neprecīzus datus\n• Pieprasīt datu dzēšanu\n• Ierobežot datu apstrādi\n• Iebilst pret apstrādi\n• Iesniegt sūdzību Datu valsts inspekcijai (www.dvi.gov.lv)',
      },
      {
        heading: '7. SĪKDATNES',
        text: 'Mūsu vietne neizmanto izsekošanas sīkdatnes. LocalStorage tiek izmantots tikai lietotāja interfeisa preferences saglabāšanai (tēma, valoda) — tas ir funkcionāli nepieciešams elements, kuram nav nepieciešama atsevišķa piekrišana.',
      },
      {
        heading: '8. IZMAIŅAS',
        text: 'Mēs paturam tiesības atjaunināt šo privātuma politiku. Par būtiskām izmaiņām informēsim, publicējot jauno versiju šajā lapā ar jauninātu datumu.',
      },
      {
        heading: '9. KONTAKTS',
        text: 'Ja jums ir jautājumi par personas datu apstrādi, rakstiet: info@viz-on.net',
      },
    ],
  },
  en: {
    title: 'PRIVACY POLICY',
    updated: 'Last updated: 2026',
    back: '← BACK',
    sections: [
      {
        heading: '1. DATA CONTROLLER',
        text: 'The data controller is Vižon (hereinafter "we", "Vižon"), registered in the Latvian Commercial Register. Legal address: Riga, Latvia. Privacy contact: info@viz-on.net.',
      },
      {
        heading: '2. DATA WE COLLECT',
        text: 'When you visit viz-on.net, we may process the following data:\n• Contact form data: name, email address, project description — submitted voluntarily by you.\n• Technical data: IP address, browser, device type, page visit statistics — collected automatically.\n• User preferences: language choice (fv-locale) and colour theme (fv-theme) — stored only in your browser\'s localStorage.',
      },
      {
        heading: '3. PURPOSES AND LEGAL BASIS',
        text: '• Contact form data is processed to respond to your inquiry (GDPR Art. 6(1)(b) — pre-contractual measures).\n• Technical data is processed under our legitimate interests to operate and improve the website (GDPR Art. 6(1)(f)).\n• Preferences (localStorage) are not sent to our servers and remain on your device only.',
      },
      {
        heading: '4. RETENTION',
        text: 'Contact form data is retained for no more than 12 months after the last communication. Technical log data — no more than 90 days. You may request deletion at any time by emailing info@viz-on.net.',
      },
      {
        heading: '5. THIRD PARTIES',
        text: 'We do not use third-party tracking cookies and do not sell your data to third parties. Form submissions are processed through our API — data is not shared externally without your consent.',
      },
      {
        heading: '6. YOUR RIGHTS',
        text: 'Under GDPR you have the right to:\n• Access your data\n• Rectify inaccurate data\n• Request erasure\n• Restrict processing\n• Object to processing\n• Lodge a complaint with the Data State Inspectorate of Latvia (www.dvi.gov.lv)',
      },
      {
        heading: '7. COOKIES',
        text: 'Our website does not use tracking cookies. LocalStorage is used solely to save UI preferences (theme, language) — this is a functionally necessary element that does not require separate consent.',
      },
      {
        heading: '8. CHANGES',
        text: 'We reserve the right to update this privacy policy. We will notify you of significant changes by publishing the new version on this page with an updated date.',
      },
      {
        heading: '9. CONTACT',
        text: 'If you have questions about personal data processing, email: info@viz-on.net',
      },
    ],
  },
  ru: {
    title: 'ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ',
    updated: 'Последнее обновление: 2026',
    back: '← НАЗАД',
    sections: [
      {
        heading: '1. ОПЕРАТОР ДАННЫХ',
        text: 'Оператором персональных данных является Vižon (далее — "мы", "Vižon"), зарегистрировано в Коммерческом регистре Латвии. Юридический адрес: Рига, Латвия. Контакт по вопросам конфиденциальности: info@viz-on.net.',
      },
      {
        heading: '2. СОБИРАЕМЫЕ ДАННЫЕ',
        text: 'При посещении viz-on.net мы можем обрабатывать следующие данные:\n• Данные контактной формы: имя, адрес электронной почты, описание проекта — предоставляемые вами добровольно.\n• Технические данные: IP-адрес, браузер, тип устройства, статистика посещений — собираемые автоматически.\n• Пользовательские настройки: язык (fv-locale) и цветовая тема (fv-theme) — хранятся только в localStorage вашего браузера.',
      },
      {
        heading: '3. ЦЕЛИ И ПРАВОВЫЕ ОСНОВАНИЯ',
        text: '• Данные контактной формы обрабатываются для ответа на ваш запрос (GDPR ст. 6(1)(b) — преддоговорные меры).\n• Технические данные обрабатываются в рамках наших законных интересов по обеспечению работы и улучшению сайта (GDPR ст. 6(1)(f)).\n• Настройки (localStorage) не передаются на наши серверы и остаются только на вашем устройстве.',
      },
      {
        heading: '4. ХРАНЕНИЕ ДАННЫХ',
        text: 'Данные контактной формы хранятся не более 12 месяцев после последней связи. Технические журналы — не более 90 дней. Вы можете запросить удаление своих данных в любое время, написав на info@viz-on.net.',
      },
      {
        heading: '5. ТРЕТЬИ СТОРОНЫ',
        text: 'Мы не используем сторонние файлы cookie для отслеживания и не продаём ваши данные третьим сторонам. Отправки форм обрабатываются через наш API — данные не передаются внешним сторонам без вашего согласия.',
      },
      {
        heading: '6. ВАШИ ПРАВА',
        text: 'В соответствии с GDPR вы имеете право:\n• Получить доступ к своим данным\n• Исправить неточные данные\n• Запросить удаление\n• Ограничить обработку\n• Возразить против обработки\n• Подать жалобу в Инспекцию по защите данных Латвии (www.dvi.gov.lv)',
      },
      {
        heading: '7. ФАЙЛЫ COOKIE',
        text: 'Наш сайт не использует файлы cookie для отслеживания. LocalStorage используется исключительно для сохранения настроек интерфейса (тема, язык) — это функционально необходимый элемент, не требующий отдельного согласия.',
      },
      {
        heading: '8. ИЗМЕНЕНИЯ',
        text: 'Мы оставляем за собой право обновлять эту политику конфиденциальности. О существенных изменениях мы уведомим, опубликовав новую версию на этой странице с обновлённой датой.',
      },
      {
        heading: '9. КОНТАКТ',
        text: 'По вопросам обработки персональных данных: info@viz-on.net',
      },
    ],
  },
}

export default function PrivacyPolicyPage() {
  const { locale } = useLanguage()
  const c = content[locale] ?? content.lv

  return (
    <main className="min-h-screen bg-fv-bg text-fv-text">
      <div className="max-w-[860px] mx-auto px-6 lg:px-10 py-20">

        {/* Back link */}
        <Link
          href="/"
          className="inline-block font-mono text-xs text-fv-text-muted hover:text-fv-orange transition-colors mb-12"
        >
          {c.back}
        </Link>

        {/* Header */}
        <div className="mb-16 pb-8 border-b border-fv-border">
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-fv-text mb-4">
            {c.title}
          </h1>
          <p className="font-mono text-xs text-fv-text-muted">{c.updated}</p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {c.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-mono text-sm font-bold text-fv-text mb-4 tracking-wide">
                {section.heading}
              </h2>
              <div className="font-sans text-sm text-fv-text-dim leading-relaxed whitespace-pre-line">
                {section.text}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-fv-border">
          <p className="font-mono text-micro text-fv-text-muted">
            &copy; {new Date().getFullYear()} VŽN &mdash; viz-on.net
          </p>
        </div>
      </div>
    </main>
  )
}
