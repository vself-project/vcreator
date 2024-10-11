import Root from "../../components/Root/Root";
import "./style.css";

export const metadata = {
  title: "vSelf App",
  description: "vSelf Mini App for Telegram",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className=''>
        <div className='backdrop bg-[url(https://vself.app/mission_bg.png)] bg-cover bg-no-repeat'></div>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
